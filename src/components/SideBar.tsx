import { Cpu, FileTerminal } from "lucide-react";
import SideBarItem from "./ui/sidebar-item";
import UserIcon from "./UserIcon";
import GroupChecker from "./GroupChecker";

const Header = () => {
  return (
    <div className="group flex flex-col gap-4 p-2  h-full ">
      <nav className=" gap-1 px-2 flex flex-col justify-between h-full ">
        <div className="flex flex-col gap-1">
          <GroupChecker group={["deviceAdmin", "flash"]}>
            <SideBarItem name="Device" href="/" icon={Cpu} />
          </GroupChecker>
          <GroupChecker group={["firmware"]}>
            <SideBarItem name="Firmware" href="/firmware" icon={FileTerminal} />
          </GroupChecker>
        </div>
        <UserIcon />
      </nav>
    </div>
  );
};

export default Header;
