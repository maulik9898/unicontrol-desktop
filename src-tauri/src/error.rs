use serde::{ser::SerializeStruct, Deserialize, Serialize};
use thiserror::Error;
use ts_rs::TS;

#[derive(Error, Debug, Clone, Deserialize)]
pub enum TauriError {
    #[error("Port {0} not found ")]
    PortNotFound(String),

    #[error("Connection Error")]
    ConnectionError(String),

    #[error("Flashing Error : {0}")]
    FlashingError(String),

    #[error("Error reading file: {0}")]
    FileReadError(String),

    #[error("Error downloading file: {0}")]
    FileDownloadError(String),

    #[error("Error No cache directory available")]
    CacheDirectoryNotPresent,

    #[error("File Not found")]
    FilenotFound,

    #[error("Error deleting file")]
    FileDeleteError,

    #[error("Error writing file")]
    FileWriteError,

    #[error("Error creating dir")]
    DirCreatingError,

    #[error("File hash does not match")]
    FileHashNotEqual,

    #[error("File upload error")]
    FileUploadError,
}

impl TauriError {
    pub fn enum_string(&self) -> &str {
        match self {
            TauriError::PortNotFound(_) => "PortNotFound",
            TauriError::ConnectionError(_) => "ConnectionError",
            TauriError::FlashingError(_) => "FlashingError",
            TauriError::FileReadError(_) => "FileReadError",
            TauriError::FileDownloadError(_) => "FileDownloadError",
            TauriError::CacheDirectoryNotPresent => "CacheDirectoryNotPresent",
            TauriError::FilenotFound => "FilenotFound",
            TauriError::FileDeleteError => "FileDeleteError",
            TauriError::FileWriteError => "FileWriteError",
            TauriError::DirCreatingError => "DirCreatingError",
            TauriError::FileHashNotEqual => "FileHashNotEqual",
            TauriError::FileUploadError => "FileUploadError",
        }
    }
}

#[derive(Debug, TS, Clone, Deserialize, Serialize)]
#[ts(export, export_to = "../src/types/")]
pub struct ErrorMessage {
    pub error_type: String,
    pub message: String,
}

impl From<TauriError> for ErrorMessage {
    fn from(err: TauriError) -> Self {
        ErrorMessage {
            error_type: err.enum_string().to_string(),
            message: err.to_string(),
        }
    }
}

impl serde::Serialize for TauriError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        let error_kind = &self.enum_string();
        let mut state = serializer.serialize_struct("ErrorMessage", 2)?;
        state.serialize_field("error_type", error_kind)?;
        state.serialize_field::<String>("message", &self.to_string())?;
        state.end()
    }
}
