use serde::{Deserialize, Serialize};

use crate::error::ErrorMessage;

use super::{board_info::BoardInfo, progress::Progress};

use ts_rs::TS;

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "kind")]
pub enum Events {
    BoardInfoEvent(BoardInfo),
    FlashProgressEvent(Progress),
    FlashingEnd,
    ErrorEvent(ErrorMessage),
    FileDownloadStartEvent,
    FileDownloadProgress(Progress),
    FileDownloadEndEvent,
    FileUploadProgress(Progress),
}

pub struct FlashingEvent {}
