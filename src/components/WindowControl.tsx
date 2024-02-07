import { Minus, Square, X } from "lucide-react";
import { Button } from "./ui/button";
import { appWindow } from "@tauri-apps/api/window";

const WindowControl = () => {
  return (
    <div className="flex gap-2 flex-row-reverse ">
      <Button
        onClick={() => appWindow.close()}
        className="rounded-none"
        variant={"ghost"}
        size="sm"
      >
        <X className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => appWindow.toggleMaximize()}
        className="rounded-none"
        variant={"ghost"}
        size="sm"
      >
        <Square className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => appWindow.minimize()}
        className="rounded-none"
        variant={"ghost"}
        size="sm"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WindowControl;
