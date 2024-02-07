import DropZone from "./DropZone";
import UploadVersion from "./UploadVersion";

const FirmwareUpload = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-grow">
      <div className="flex flex-col justify-between items-center  gap-2">
        <DropZone fileType="bin" />
        <span className="font-extrabold text-2xl text-primary/50">+</span>
        <DropZone fileType="elf" />
      </div>
      </div>
      <UploadVersion />
    </div>
  );
};

export default FirmwareUpload;
