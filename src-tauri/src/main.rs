// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod error;
pub mod file_manager;
pub mod model;
pub mod serial;
pub mod uploader;
pub mod utils;

use crate::uploader::upload;
use error::TauriError;
use file_manager::FileManager;
use futures_util::TryFutureExt;
use log::LevelFilter;
use model::{backend::Url, board_info::BoardInfo, event::Events};
use serial::{flash_elf_to_device, get_board_info, get_port_info, get_serial_ports};
use serialport::SerialPortInfo;
use tauri::Manager;
use tauri_plugin_log::fern::colors::{Color, ColoredLevelConfig};

#[tauri::command]
async fn port_list() -> Vec<SerialPortInfo> {
    get_serial_ports()
}

#[tauri::command]
async fn board_info(
    port_name: &str,
    app_handle: tauri::AppHandle,
) -> Result<BoardInfo, TauriError> {
    let port_info = get_port_info(port_name)?;
    let info = get_board_info(port_info)?;
    let info = BoardInfo::from(info);
    let _ = app_handle.emit_all("logs", Events::BoardInfoEvent(info.clone()));
    Ok(info)
}

#[tauri::command]
async fn delete_firmware_dir(app_handle: tauri::AppHandle) -> Result<(), ()> {
    let file_manager = FileManager::new(app_handle);
    file_manager.delete_firmware_dir().await.map_err(|_| (()))
}

#[tauri::command]
async fn flash(port_name: &str, url: Url, app_handle: tauri::AppHandle) -> Result<(), TauriError> {
    let port_info = get_port_info(port_name)?;
    flash_elf_to_device(port_info, url, app_handle).await?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .with_colors(ColoredLevelConfig {
                    error: Color::Red,
                    warn: Color::Yellow,
                    debug: Color::Green,
                    info: Color::Blue,
                    trace: Color::White,
                })
                .level_for("mio", LevelFilter::Off)
                .build(),
        )
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_fs_extra::init())
        .invoke_handler(tauri::generate_handler![
            port_list,
            board_info,
            flash,
            upload,
            delete_firmware_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
