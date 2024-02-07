use crate::{error::TauriError, model::event::Events};
use log::error;
use tauri::Manager;

pub fn handle_error_with_event(app_handle: &tauri::AppHandle, error: TauriError) -> TauriError {
    let err: TauriError = error.into();
    error!("{}", err.to_string());
    let _ = app_handle.emit_all(
        "logs",
        Events::ErrorEvent(crate::error::ErrorMessage::from(err.clone())),
    );
    err
}
