"use client";
import { type NavbarProps } from "./Navbar";
import NavItem from "./NavItem";

const NavItems = ({ sections, activeIndex, setActiveIndex }: NavbarProps) => {
  return (
    <div className="flex gap-4 h-full transition-all animate-in my-4 border-b-2 ">
      {sections.map((category, i) => {
        const handleCurrentTab = () => {
          setActiveIndex(i);
        };

        const current = i === activeIndex;
        return (
          <NavItem
            category={category}
            tabChangeHandler={handleCurrentTab}
            isCurrent={current}
            key={category.label}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
