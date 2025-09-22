"use client";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/contexts/onboarding-context";
import { Section } from "@/lib/sections";

interface NavItemProps {
  section: Section;
  index: number;
}

const NavItem = ({ section, index }: NavItemProps) => {
  const {
    activeIndex,
    setActiveIndex,
    onboarding
  } = useOnboarding();

  const isCurrent = index === activeIndex;
  const isCompleted = onboarding[index]?.isCompleted;
  const isDisabled = index > activeIndex && !onboarding[index-1]?.isCompleted;

  const handleClick = () => {
    if (!isDisabled) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          "transition-all w-fit pb-1 hover:cursor-pointer flex flex-col items-start",
          {
            "border-b-2 border-primaryColor text-black font-medium": isCurrent,
            "text-muted-foreground": !isCurrent && !isCompleted,
            "text-green-600": isCompleted && !isCurrent,
            "opacity-50 cursor-not-allowed": isDisabled,
          }
        )}
      >
        <span className="text-sm">{section.label}</span>
        {/* <span className="text-xs text-muted-foreground">{section.text}</span> */}
      </button>
      
      {isCompleted && !isCurrent && (
        <span className="absolute -right-4 text-green-500">✓</span>
      )}
    </div>
  );
};

export default NavItem;