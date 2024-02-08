use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Serialize, Deserialize, Debug)]
pub struct Firmware {
    pub id: i32,                 // Corresponds to SERIAL PRIMARY KEY
    pub version: String,         // Corresponds to VARCHAR(50)
    pub filename: String,        // Corresponds to VARCHAR(255)
    pub uploaded: DateTime<Utc>, // Corresponds to TIMESTAMP WITH TIME ZONE
    pub elf_checksum: Option<String>,
    pub bin_checksum: Option<String>, // Corresponds to VARCHAR(255)
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum FileType {
    BIN,
    ELF,
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Deserialize, Serialize)]
pub struct FileUpload {
    pub data: Vec<Url>,
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Deserialize, Serialize)]
pub struct Url {
    pub url: String,
    pub file_name: String,
    pub version: String,
    pub checksum: Option<String>,
    pub file_type: FileType,
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Serialize, Deserialize, Debug)]
pub struct RegisterDevice {
    pub id: String,
    pub user_id: String,
    pub email: String,
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Serialize, Deserialize, Debug)]
pub struct Device {
    pub id: String,
    pub registered_on: DateTime<Utc>,
    pub registered_by: String,
    pub email: String,
}

#[derive(Deserialize, Serialize)]
pub struct Pagination<T> {
    pub page: usize,
    pub page_size: usize,
    pub search: T,
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Deserialize, Serialize, Debug)]
pub struct FirmwareParams {
    pub version: String,
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Deserialize, Serialize)]
pub struct DeviceParam {
    pub id: String,
    pub email: String,
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Serialize)]
pub struct PaginatedResponse<T> {
    items: Vec<T>,
    page: usize,
    page_size: usize,
    total_items: usize, // Optional, if you want to include total item count
    has_next: bool,
}

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Deserialize, Serialize)]
pub struct Version {
    pub major: u32,
    pub minor: u32,
    pub patch: u32,
}
