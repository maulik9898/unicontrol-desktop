import { fileSize } from "@/event";
import { useDeviceStore } from "@/store";
import { FileType } from "@/types/FileType";
import { FileDigit } from "lucide-react";
import React, {  useEffect, useState } from "react";
import { metadata } from "tauri-plugin-fs-extra-api";
interface FileProps {
  path: string;
  type: FileType
}
const File: React.FC<FileProps> = ({ path, type }) => {
  const [size, setSize] = useState("");
  const progress = useDeviceStore((state) => state.uploadProgress.get(type) || 0)

  useEffect(() => {
    metadata(path).then((data) => {
      setSize(fileSize(data.size));
    });
  }, [path]);
  return (
    <div className="relative flex w-full gap-4 flex-wrap  p-8">
      <div className="absolute top-0 left-0 h-full bg-primary/5  transition-all duration-200 " style={{ width: `${progress}%` }}></div>
      <div>
        <FileDigit />
      </div>
      <div className="flex-grow font-mono text-lg z-10">{path}</div>
      <div className="z-10">{size}</div>
    </div>
  );
};

export default File;
