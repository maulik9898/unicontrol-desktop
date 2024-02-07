import DeviceSelect from "./DeviceSelect";
import DeviceStatus from "./DeviceStatus";
import VersionSelection from "../VersionSelection";
import LogArea from "./LogArea";
import FlashButton from "./FlashButton";
const DeviceFlash = () => {
  return (
    <div className=" gap-4  flex flex-col h-full">
      <div className="flex justify-between gap-4">
        <div className="flex gap-4">
          <DeviceSelect />
          <DeviceStatus />
        </div>
        <VersionSelection />
      </div>
      <div className="flex-grow">
        <LogArea />
      </div>
      <FlashButton />
    </div>
  );
};

export default DeviceFlash;
