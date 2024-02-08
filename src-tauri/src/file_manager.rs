use std::path::PathBuf;
use tokio::fs;

use crate::{
    error::TauriError,
    model::{
        backend::Url,
        event::Events,
        progress::{FileProgress, ProgressType},
    },
    utils::handle_error_with_event,
};
use espflash::flasher::ProgressCallbacks;
use futures_util::StreamExt;
use log::{debug, error};
use md5::{Digest, Md5};
use tauri::Manager;

pub struct FileManager {
    pub app_handle: tauri::AppHandle,
}
impl FileManager {
    pub fn new(app_handle: tauri::AppHandle) -> Self {
        FileManager { app_handle }
    }

    pub async fn get_file(&self, url: Url) -> Result<Vec<u8>, TauriError> {
        let content = match self.check_file(&url).await {
            Err(TauriError::FilenotFound) => self.download_and_save_file(&url, false).await?,
            Err(TauriError::FileReadError(_)) | Err(TauriError::FileHashNotEqual) => {
                self.download_and_save_file(&url, true).await?
            }
            Ok(bytes) => bytes,
            Err(_) => self.download_and_save_file(&url, true).await?,
        };
        Ok(content)
    }

    async fn download_and_save_file(
        &self,
        url: &Url,
        delete_file: bool,
    ) -> Result<Vec<u8>, TauriError> {
        let content = self.download_file(&url.url).await?;
        let file_path = self.get_file_path(url).await.ok();
        if let Some(path) = file_path {
            if delete_file {
                let _ = self.delete_file(&path).await.ok();
            }
            let _ = self.save_file(&path, content.clone()).await.ok();
        }
        Ok(content)
    }

    pub async fn save_file(&self, path: &PathBuf, content: Vec<u8>) -> Result<(), TauriError> {
        debug!("Saving file");
        fs::write(path, content).await.map_err(|err| {
            error!("Error saving file: {}", err.to_string());
            TauriError::FileWriteError
        })?;
        debug!("File saved");
        Ok(())
    }

    pub async fn delete_file(&self, path: &PathBuf) -> Result<(), TauriError> {
        debug!("Deleting file");
        fs::remove_file(path).await.map_err(|err| {
            error!("Error deleting file: {}", err.to_string());
            TauriError::FileDeleteError
        })?;
        debug!("File deleted");
        Ok(())
    }

    pub async fn get_file_path(&self, url: &Url) -> Result<PathBuf, TauriError> {
        let mut cache_path = self.get_firmware_dir_path().await?;
        cache_path.push(&url.file_name);
        Ok(cache_path)
    }

    pub async fn delete_firmware_dir(&self) -> Result<(), TauriError> {
        let path = self.get_firmware_dir_path().await?;
        fs::remove_dir_all(path).await.map_err(|err| {
            error!("Error deleteing firmware dir ");
            TauriError::FileDeleteError
        })
    }

    pub async fn get_firmware_dir_path(&self) -> Result<PathBuf, TauriError> {
        let mut cache_path: PathBuf =
            self.app_handle
                .path_resolver()
                .app_cache_dir()
                .ok_or_else(|| {
                    handle_error_with_event(&self.app_handle, TauriError::CacheDirectoryNotPresent)
                })?;
        cache_path.push(".tmp/");
        if !cache_path.is_dir() {
            fs::create_dir_all(&cache_path).await.map_err(|err| {
                error!("Error creating dir: {}", err.to_string());
                TauriError::DirCreatingError
            })?;
        }
        Ok(cache_path)
    }

    pub async fn check_file(&self, url: &Url) -> Result<Vec<u8>, TauriError> {
        debug!("Check file");
        let cache_path = self.get_file_path(url).await?;
        if !cache_path.is_file() {
            error!("File not found");
            return Err(TauriError::FilenotFound);
        }
        let bytes = fs::read(cache_path).await.map_err(|err| {
            handle_error_with_event(&self.app_handle, TauriError::FileReadError(err.to_string()))
        })?;
        debug!("Checking hash");
        if let Some(checksum) = &url.checksum {
            let mut hasher = Md5::new();
            hasher.update(bytes.clone());
            let result = hasher.finalize();
            let result = format!("{:x}", result);
            if checksum != &result {
                error!("Hash does not match {} : {}", result, checksum);
                return Err(TauriError::FileHashNotEqual);
            } else {
                debug!("File hash Matched");
            }
        }
        Ok(bytes)
    }

    pub async fn download_file(&self, url: &str) -> Result<Vec<u8>, TauriError> {
        debug!("Downloading file");
        let _ = self
            .app_handle
            .emit_all("logs", Events::FileDownloadStartEvent);

        let client = reqwest::Client::new();

        // Asynchronously send the request and await the response
        let resp = client.get(url).send().await.map_err(|err| {
            handle_error_with_event(
                &self.app_handle,
                TauriError::FileDownloadError(err.to_string()),
            )
        })?;

        // Ensure the response status is success
        let resp = resp.error_for_status().map_err(|err| {
            handle_error_with_event(
                &self.app_handle,
                TauriError::FileDownloadError(err.to_string()),
            )
        })?;
        let expected_len = resp.content_length().unwrap_or(0) as usize;

        let mut buffer: Vec<u8> = Vec::with_capacity(expected_len);
        let mut progress =
            FileProgress::new(self.app_handle.clone(), ProgressType::Download, "logs");
        progress.init(0, expected_len);

        // Stream the response body
        let mut stream = resp.bytes_stream();

        while let Some(item) = stream.next().await {
            let chunk = item.map_err(|err| {
                handle_error_with_event(
                    &self.app_handle,
                    TauriError::FileDownloadError(err.to_string()),
                )
            })?;
            // Append the bytes directly to the buffer
            buffer.extend_from_slice(&chunk);

            // Update progress
            progress.update(buffer.len());
        }
        progress.finish();
        debug!("File downloaded");

        let _ = self
            .app_handle
            .emit_all("logs", Events::FileDownloadEndEvent);
        Ok(buffer)
    }
}
