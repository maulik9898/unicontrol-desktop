import SideBar from "@/components/SideBar";
import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Root = () => {
  return (
    <div className="h-full w-full flex-col">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          minSize={22}
          maxSize={22}
        >
          <SideBar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-8">
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Root;
