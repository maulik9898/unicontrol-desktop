import { useCallback, useEffect, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { FileType } from "@/types/FileType";
import { open } from "@tauri-apps/api/dialog";
interface UseFileSelectorProps {
  fileType: FileType;
  onFileDrop: (files: string) => void;
}

export const useFileSelector = ({
  fileType,
  onFileDrop,
}: UseFileSelectorProps) => {
  const [hovered, setHovered] = useState(false);

  const checkFile = useCallback(
    (paths: string[]) => {
      return paths.length == 1 && paths.some((path) => path.endsWith(fileType));
    },
    [fileType],
  );

  const openFileSelector = useCallback(async () => {
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "firmware",
          extensions: [fileType],
        },
      ],
    });
    if (selected === null) {
      // Do nothing if input is null
      return;
    } else if (typeof selected === "string") {
      // If input is a string, convert it to string[] and call processArray
      const d = checkFile([selected]);
      if (d) {
        onFileDrop(selected);
      }
    } else {
      // If input is already string[], directly pass it to processArray
      const d = checkFile(selected);
      if (d) {
        onFileDrop(selected[0]);
      }
    }
  }, [fileType]);
  useEffect(() => {
    const unlistenPromise = appWindow.onFileDropEvent((event) => {
      setHovered(false);
      let payload = event.payload;
      if (payload.type === "drop" && checkFile(payload.paths)) {
        onFileDrop(payload.paths[0]);
      }
      if (payload.type === "hover" && checkFile(payload.paths)) {
        setHovered(true);
      }
      // Reset hover state on drop or cancel
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [onFileDrop]);
  return { hovered, openFileSelector };
};
