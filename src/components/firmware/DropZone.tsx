import { FileType } from "@/types/FileType";
import React from "react";
import { useFileSelector } from "@/hooks/useFileSelector";
import { useDeviceStore } from "@/store";
import File from "./File";
interface DropZoneProps {
  fileType: FileType;
}

const DropZone: React.FC<DropZoneProps> = ({ fileType }) => {
  const [file, setFile] = useDeviceStore((state) => [
    state.files.get(fileType),
    state.setFile,
  ]);
  const { hovered, openFileSelector } = useFileSelector({
    fileType: fileType,
    onFileDrop: (file) => {
      setFile(fileType, file)
      console.log("Files dropped:", file);
    },
  });
  return (
    <div
      onClick={async () => {
        await openFileSelector();
      }}
      className={`w-full rounded flex justify-center h-full ${hovered ? "bg-primary-foreground/80 border-dashed border" : "border"} `}
    >
      {file == null ? (
        <span className="font-mono m-8  text-lg text-primary/50">
          Select {fileType.toUpperCase()} File
        </span>
      ) : (
        <File type={fileType} path={file} />
      )}
    </div>
  );
};

export default DropZone;
