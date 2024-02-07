import { cn } from "@/lib/utils";
import React from "react";
import { NavLink } from "react-router-dom";

const MainNav = () => {
  return (
    <div className="mr-4 hidden md:flex">
        <span className="hidden mr-6 font-bold sm:inline-block">UniControl</span>
      <nav className="flex items-center gap-6 text-sm">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "transition-colors hover:text-foreground/80",
              isActive ? "text-foreground" : "text-foreground/60",
            )
          }
        >
          Device
        </NavLink>
        <NavLink
          to="/firmware"
          className={({ isActive }) =>
            cn(
              "transition-colors hover:text-foreground/80",
              isActive ? "text-foreground" : "text-foreground/60",
            )
          }
        >
          Firmware
        </NavLink>
      </nav>
    </div>
  );
};

export default MainNav;
