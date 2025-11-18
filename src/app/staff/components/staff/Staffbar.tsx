import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ClassAttendanceStat } from "@/types";
import { GreaterThan } from "@/utils/icon";
import { type AuthUser } from "@/zustand/authStore";

interface StaffbarProps {
  user: AuthUser | null;
  classes: ClassAttendanceStat[];
  isPending: boolean;
}

//TODO: add a reusable component and also a useTheme hook

const Staffbar = ({ user, classes, isPending }: StaffbarProps) => {
  return (
    <div>
      <div className="flex items-center justify-between my-4 ">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName} {user?.lastName}. 👋
          </h1>
          <p className="text-muted-foreground flex gap-3">
            {!isPending &&
              classes.map((staffClass) => (
                <span
                  key={staffClass.classId}
                  className="bg-green-100 border-green-300 text-green-800 text-[9px] font-medium px-1.5 py-0.5 rounded-sm border"
                >
                  {staffClass.className.toUpperCase()}
                </span>
              ))}
          </p>
        </div>
        <Select>
          <SelectTrigger className="w-[120px] text-[#84818A]">
            <SelectValue placeholder="Show stats: " />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div
        //   href="/staff"
        className="space-y-2 cursor-pointer hover:bg-slate-100 rounded-md"
      >
        <div className="flex items-center gap-3 text-[#84818A] text-sm mt-10">
          Home
          <GreaterThan />
          Dashboard
        </div>
      </div>
    </div>
  );
};

export default Staffbar;
