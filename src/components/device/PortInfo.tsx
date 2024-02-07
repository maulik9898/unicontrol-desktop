import { SerialPortInfo } from "@/types";
import React from "react";

interface PortInfoProps {
  port: SerialPortInfo;
}
const PortInfo: React.FC<PortInfoProps> = ({ port }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold">{port.port_name}</span>
      <span className="text-xs font-medium">{port.port_type.UsbPort.product}</span>
    </div>
  );
};

export default PortInfo;
