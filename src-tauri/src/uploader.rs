use std::sync::Arc;

use espflash::flasher::ProgressCallbacks;
use futures_util::TryStreamExt;
use read_progress_stream::ReadProgressStream;
use std::sync::Mutex;
use tauri::{command, Manager};
use tokio::fs::File;

use crate::{
    error::TauriError,
    model::progress::{FileProgress, ProgressType},
    utils::handle_error_with_event,
};
use log::{debug, error};
use tokio_util::codec::{BytesCodec, FramedRead};
#[command]
pub async fn upload(
    url: &str,
    id: usize,
    file_path: &str,
    app_handle: tauri::AppHandle,
) -> Result<(), TauriError> {
    debug!("Uploading file: {}", file_path);
    // Read the file
    let file = File::open(file_path).await.map_err(|err| {
        handle_error_with_event(&app_handle, TauriError::FileReadError(err.to_string()))
    })?;
    // Get the file size
    let metadata = file.metadata().await.map_err(|err| {
        handle_error_with_event(&app_handle, TauriError::FileReadError(err.to_string()))
    })?;
    let file_size = metadata.len();
    // Create the request and attach the file to the body
    let client = reqwest::Client::new();
    let fp = Arc::new(Mutex::new(FileProgress::new(
        app_handle.clone(),
        ProgressType::Upload,
        "upload",
    )));
    {
        fp.lock().unwrap().init(id as u32, file_size as usize);
    }
    let request = client
        .put(url)
        .header("Content-Length", file_size.to_string())
        .body(file_to_body(file, fp.clone()));

    // Loop trought the headers keys and values
    // and add them to the request object.

    let response = request.send().await.map_err(|err| {
        error!("File upload error: {}", err.to_string());
        handle_error_with_event(&app_handle, TauriError::FileUploadError)
    })?;
    {
        fp.lock().unwrap().finish()
    }
    debug!("File upload done {}", file_path);

    Ok(())
}

fn file_to_body(file: File, fp: Arc<Mutex<FileProgress>>) -> reqwest::Body {
    let stream = FramedRead::new(file, BytesCodec::new()).map_ok(|r| r.freeze());
    reqwest::Body::wrap_stream(ReadProgressStream::new(
        stream,
        Box::new(move |progress, total| {
            fp.lock().unwrap().update(total as usize);
        }),
    ))
}
