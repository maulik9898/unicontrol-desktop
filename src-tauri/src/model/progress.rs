use std::time::{Duration, Instant};

use espflash::flasher::ProgressCallbacks;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use ts_rs::TS;

use super::event::Events;

const INTERVAL: Duration = Duration::from_millis(100);

pub struct CustomProgressCallback {
    pb: Option<Progress>,
    app_handle: tauri::AppHandle,
}

impl CustomProgressCallback {
    pub fn new(app_handle: tauri::AppHandle) -> Self {
        CustomProgressCallback {
            pb: None,
            app_handle,
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub enum ProgressType {
    Download,
    Upload,
}

impl ProgressType {
    fn to_event(&self, pb: Progress) -> Events {
        match &self {
            Self::Download => Events::FileDownloadProgress(pb),
            Self::Upload => Events::FileUploadProgress(pb),
        }
    }
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Progress {
    pub addr: u32,
    pub len: usize,
    pub current: usize,
}

impl Progress {
    pub fn set_progress(&self, current: usize) -> Self {
        Progress {
            addr: self.addr,
            len: self.len,
            current,
        }
    }
}

pub struct FileProgress {
    app_handle: tauri::AppHandle,
    pb: Option<Progress>,
    last_update: Instant,
    progress_type: ProgressType,
    event: String,
}

impl FileProgress {
    pub fn new(app_handle: AppHandle, progress_type: ProgressType, event: &str) -> Self {
        Self {
            app_handle,
            pb: None,
            last_update: Instant::now() - INTERVAL,
            progress_type,
            event: event.to_string(),
        }
    }
}

impl ProgressCallbacks for FileProgress {
    /// Initialize the progress bar
    fn init(&mut self, addr: u32, len: usize) {
        let pb = Progress {
            addr,
            len,
            current: 0,
        };
        let _ = self
            .app_handle
            .emit_all(&self.event, Events::FileDownloadProgress(pb.clone()));
        self.pb = Some(pb);
    }

    /// Update the progress bar
    fn update(&mut self, current: usize) {
        let now = Instant::now();
        if now.duration_since(self.last_update) >= INTERVAL {
            if let Some(ref pb) = self.pb {
                let pb = &pb.set_progress(current);
                self.pb = Some(pb.clone());
                let event = self.progress_type.to_event(pb.clone());
                let _ = self.app_handle.emit_all(&self.event, event);
                self.last_update = now; // Update the last update time
            }
        }
    }

    /// End the progress bar
    fn finish(&mut self) {
        if let Some(ref pb) = self.pb {
            // Ensure the final progress state is set to 100% completion
            let final_pb = pb.set_progress(pb.len);
            let _ = self
                .app_handle
                .emit_all(&self.event, Events::FileDownloadProgress(final_pb.clone()));
            self.pb = None; // Clear the progress bar as we're done
        }
    }
}

impl ProgressCallbacks for CustomProgressCallback {
    /// Initialize the progress bar
    fn init(&mut self, addr: u32, len: usize) {
        let pb = Progress {
            addr,
            len,
            current: 0,
        };
        let _ = self
            .app_handle
            .emit_all("logs", Events::FlashProgressEvent(pb.clone()));
        self.pb = Some(pb);
    }

    /// Update the progress bar
    fn update(&mut self, current: usize) {
        if let Some(ref pb) = self.pb {
            let pb = &pb.set_progress(current);
            self.pb = Some(pb.clone());
            let _ = self
                .app_handle
                .emit_all("logs", Events::FlashProgressEvent(pb.clone()));
        }
    }

    /// End the progress bar
    fn finish(&mut self) {
        if let Some(ref _pb) = self.pb {
            self.pb = None
        }
    }
}
