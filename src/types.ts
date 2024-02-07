export interface SerialPortInfo {
  // The short name of the serial port
  port_name: string;
  // The hardware device type that exposes this port
  port_type: {
    UsbPort: UsbPort;
  };
}

export type SerialPortType = UsbPort | "PciPort" | "BluetoothPort" | "Unknown";

export interface UsbPort {
  vid: number;
  pid: number;
  serial_number?: string;
  manufacturer?: string;
  product?: string;
}



export interface Message {
  message: string,
  type: MessageType
}
export type MessageType = "ERROR" | "INFO" | "SUCCESS"
