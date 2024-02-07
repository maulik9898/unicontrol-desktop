use espflash::flasher::DeviceInfo;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS)]
#[ts(export, export_to = "../src/types/")]
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BoardInfo {
    pub chip: String,
    pub revision: Option<(u32, u32)>,
    pub crystal_frequency: u32,
    pub features: Vec<String>,
    pub mac_address: String,
    pub flash_size: String,
}

impl From<DeviceInfo> for BoardInfo {
    fn from(device: DeviceInfo) -> Self {
        BoardInfo {
            chip: device.chip.to_string(),
            revision: device.revision,
            crystal_frequency: device.crystal_frequency,
            features: device.features,
            mac_address: device.mac_address,
            flash_size: device.flash_size.to_string(),
        }
    }
}
