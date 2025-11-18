// import { sections } from "../app/onboarding/page"
import { type sections } from "@/lib/sections";
import { cn } from "@/lib/utils";

type Category = (typeof sections)[number];
interface NavItemProps {
  category: Category;
  tabChangeHandler: () => void;
  isCurrent: boolean;
}
const NavItem = ({ category, isCurrent, tabChangeHandler }: NavItemProps) => {
  return (
    <div className="relative flex items-center">
      <div
        onClick={tabChangeHandler}
        className={cn("transition-all text-muted-foreground pb-1", {
          "border-b-2 border-primary text-black ": isCurrent,
        })}
      >
        {category.label}
      </div>
    </div>
  );
};

export default NavItem;
