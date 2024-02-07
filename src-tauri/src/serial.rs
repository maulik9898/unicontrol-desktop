use espflash::{
    flasher::{DeviceInfo, Flasher},
    interface::Interface,
};
use miette::{Context, IntoDiagnostic, Result};
use serialport::{available_ports, SerialPortInfo, SerialPortType, UsbPortInfo};
use tauri::Manager;

use crate::{
    error::{ErrorMessage, TauriError},
    file_manager::FileManager,
    model::{backend::Url, board_info::BoardInfo, event::Events, progress::CustomProgressCallback},
    utils::handle_error_with_event,
};

/// Serialport's auto-detect doesn't provide any port information when using MUSL
/// Linux we can do some manual parsing of sysfs to get the relevant bits
/// without udev
#[cfg(all(target_os = "linux", target_env = "musl"))]
pub fn detect_usb_serial_ports() -> Result<Vec<SerialPortInfo>> {
    use std::{
        fs::{read_link, read_to_string},
        path::PathBuf,
    };

    use serialport::UsbPortInfo;

    let ports = available_ports().into_diagnostic()?;
    let ports = ports
        .into_iter()
        .filter_map(|port_info| {
            // With musl, the paths we get are `/sys/class/tty/*`
            let path = PathBuf::from(&port_info.port_name);

            // This will give something like:
            // `/sys/devices/pci0000:00/0000:00:07.1/0000:0c:00.3/usb5/5-3/5-3.1/5-3.1:1.0/ttyUSB0/tty/ttyUSB0`
            let mut parent_dev = path.canonicalize().ok()?;

            // Walk up 3 dirs to get to the device hosting the tty:
            // `/sys/devices/pci0000:00/0000:00:07.1/0000:0c:00.3/usb5/5-3/5-3.1/5-3.1:1.0`
            parent_dev.pop();
            parent_dev.pop();
            parent_dev.pop();

            // Check that the device is using the usb subsystem
            read_link(parent_dev.join("subsystem"))
                .ok()
                .filter(|subsystem| subsystem.ends_with("usb"))?;

            let interface = read_to_string(parent_dev.join("interface"))
                .ok()
                .map(|s| s.trim().to_string());

            // /sys/devices/pci0000:00/0000:00:07.1/0000:0c:00.3/usb5/5-3/5-3.1
            parent_dev.pop();

            let vid = read_to_string(parent_dev.join("idVendor")).ok()?;
            let pid = read_to_string(parent_dev.join("idProduct")).ok()?;

            Some(SerialPortInfo {
                port_type: SerialPortType::UsbPort(UsbPortInfo {
                    vid: u16::from_str_radix(vid.trim(), 16).ok()?,
                    pid: u16::from_str_radix(pid.trim(), 16).ok()?,
                    product: interface,
                    serial_number: None,
                    manufacturer: None,
                }),
                port_name: format!("/dev/{}", path.file_name()?.to_str()?),
            })
        })
        .collect::<Vec<_>>();

    Ok(ports)
}

/// Returns a vector with available USB serial ports.
#[cfg(not(all(target_os = "linux", target_env = "musl")))]
pub fn detect_usb_serial_ports() -> Result<Vec<SerialPortInfo>> {
    let ports = available_ports().into_diagnostic()?;
    let ports = ports
        .into_iter()
        .filter(|port_info| {
            matches!(
                &port_info.port_type,
                SerialPortType::UsbPort(..) |
                // Allow PciPort. The user may want to use it.
                // The port might have been misdetected by the system as PCI.
                SerialPortType::PciPort |
                // Good luck.
                SerialPortType::Unknown
            )
        })
        .collect::<Vec<_>>();

    Ok(ports)
}

pub fn connect(port_info: SerialPortInfo) -> Result<Flasher> {
    let interface = Interface::new(&port_info, None, None)
        .wrap_err_with(|| format!("Failed to open serial port {}", port_info.port_name))?;
    let port_info = match port_info.port_type {
        SerialPortType::UsbPort(info) => info,
        SerialPortType::PciPort | SerialPortType::Unknown => {
            println!("Matched `SerialPortType::PciPort or ::Unknown`");
            UsbPortInfo {
                vid: 0,
                pid: 0,
                serial_number: None,
                manufacturer: None,
                product: None,
            }
        }
        _ => unreachable!(),
    };

    Ok(Flasher::connect(interface, port_info, None, true)?)
}

pub fn get_board_info(port_info: SerialPortInfo) -> Result<DeviceInfo, TauriError> {
    let mut flasher =
        connect(port_info).map_err(|err| TauriError::ConnectionError(err.to_string()))?;
    flasher
        .device_info()
        .map_err(|err| TauriError::ConnectionError(err.to_string()))
}

pub fn get_serial_ports() -> Vec<SerialPortInfo> {
    let ports = detect_usb_serial_ports();
    match ports {
        Ok(ports) => ports,
        Err(..) => Vec::default(),
    }
}

pub fn get_port_info(port_name: &str) -> Result<SerialPortInfo, TauriError> {
    let ports = get_serial_ports();
    let port: SerialPortInfo = ports
        .into_iter()
        .find(|port| port.port_name == port_name)
        .ok_or(TauriError::PortNotFound(port_name.to_owned()))?;

    Ok(port)
}

pub async fn flash_elf_to_device(
    port_info: SerialPortInfo,
    url: Url,
    app_handle: tauri::AppHandle,
) -> Result<(), TauriError> {
    let mut flasher = connect(port_info).map_err(|err| {
        let err = TauriError::ConnectionError(err.to_string());
        let _ = app_handle.emit_all("logs", Events::ErrorEvent(ErrorMessage::from(err.clone())));
        err
    })?;
    // let args = FlashArgs {
    //     bootloader: None,
    //     erase_parts: None,
    //     erase_data_parts: None,
    //     format: None,
    //     monitor: false,
    //     monitor_baud: None,
    //     partition_table: None,
    //     ram: false,
    // };
    let board_info = BoardInfo::from(flasher.device_info().map_err(|err| {
        handle_error_with_event(&app_handle, TauriError::ConnectionError(err.to_string()))
    })?);
    let _ = app_handle.emit_all("logs", Events::BoardInfoEvent(board_info));
    let file_manager = FileManager::new(app_handle.clone());

    let elf_data = file_manager.get_file(url).await?;
    // let bootloader = args.bootloader.as_deref();
    // let partition_table = args.partition_table.as_deref();
    //
    // if let Some(path) = bootloader {
    //     debug!("Bootloader:        {}", path.display());
    // }
    // if let Some(path) = partition_table {
    //     debug!("Partition table:   {}", path.display());
    // }

    // let partition_table = match partition_table {
    //     Some(path) => Some(parse_partition_table(path).map_err(|err| {
    //         handle_error_with_event(&app_handle, TauriError::FlashingError(err.to_string()))
    //     })?),
    //     None => None,
    // };

    // if args.erase_parts.is_some() || args.erase_data_parts.is_some() {
    //     erase_partitions(
    //         &mut flasher,
    //         partition_table.clone(),
    //         args.erase_parts,
    //         args.erase_data_parts,
    //     )?;
    // }

    // let bootloader = if let Some(path) = bootloader {
    //     let path = fs::canonicalize(path).into_diagnostic()?;
    //     let data = fs::read(path).into_diagnostic()?;
    //
    //     Some(data)
    // } else {
    //     None
    // };
    let bootloader = None;
    flasher
        .load_elf_to_flash_with_format(
            &elf_data,
            bootloader,
            None,
            None,
            None,
            None,
            None,
            Some(&mut CustomProgressCallback::new(app_handle.clone())),
        )
        .map_err(|err| {
            handle_error_with_event(&app_handle, TauriError::FlashingError(err.to_string()))
        })?;
    let _ = app_handle.emit_all("logs", Events::FlashingEnd);

    Ok(())
}
