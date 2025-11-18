"use client";
import { sections } from "@/lib/sections";

import NavItem from "./NavItem";

const NavItems = () => {
  return (
    <div className="overflow-auto">
      <div className="flex gap-8 h-full w-fif transition-all animate-in my-4">
        {sections.map((section, index) => (
          <NavItem key={section.label} section={section} index={index} />
        ))}
      </div>
    </div>
  );
};

export default NavItems;
