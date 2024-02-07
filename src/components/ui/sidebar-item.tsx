import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { LucideIcon } from "lucide-react";

interface SideBarItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
}
const SideBarItem: React.FC<SideBarItemProps> = (props) => {
  return (
    <>
      <NavLink
        to={props.href}
        className={({ isActive }) =>
          cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            isActive &&
              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
            "justify-start",
          )
        }
      >
        <props.icon className="h-4 w-4 mr-2 " />
        {props.name}
      </NavLink>
    </>
  );
};

export default SideBarItem;
