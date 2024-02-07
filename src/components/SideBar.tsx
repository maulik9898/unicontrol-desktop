import { Cpu, FileTerminal } from "lucide-react";
import SideBarItem from "./ui/sidebar-item";
import UserIcon from "./UserIcon";

const Header = () => {
  return (
    <div className="group flex flex-col gap-4 p-2  h-full ">
      <nav className=" gap-1 px-2 flex flex-col justify-between h-full ">
        <div className="flex flex-col gap-1">
          <SideBarItem name="Device" href="/" icon={Cpu} />
          <SideBarItem name="Firmware" href="/firmware" icon={FileTerminal} />
        </div>
        <UserIcon />
      </nav>
    </div>
  );
};

export default Header;
