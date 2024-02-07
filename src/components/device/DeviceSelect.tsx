import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import PortInfo from "./PortInfo";
import { useDeviceStore } from "@/store";
import { getPortList } from "@/data/tauri";
const DeviceSelect = () => {
  const { data } = useQuery({
    queryKey: ["port_list"],
    queryFn: async () => {
      const ports = await getPortList()
      if (ports.length > 0 && selectedPort.trim() == "") {
        setSelectedPort(ports[0].port_name);
      }
      if (ports.length == 0){
        setSelectedPort("")
      }
      return ports;
    },
    refetchInterval: 1000,
  });

  const { setSelectedPort, selectedPort, isFlashing } = useDeviceStore((state) => ({
    setSelectedPort: state.setSelectedPort,
    selectedPort: state.selectedPort,
    isFlashing: state.isFlasing
  }));
  return (
    <Select disabled={isFlashing} value={selectedPort} onValueChange={setSelectedPort}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a port">
          <span>{selectedPort}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data !== undefined &&
            data.map((port) => (
              <SelectItem key={port.port_name} value={port.port_name}>
                <PortInfo port={port} />
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DeviceSelect;
