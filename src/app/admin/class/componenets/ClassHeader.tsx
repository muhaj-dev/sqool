// components/class-management/ClassHeader.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Plus, Search } from "lucide-react";
import CreateClassDialog from "./CreateClassDialog";
import { Class, Teacher } from "./types";

interface ClassHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  teachers: Teacher[];
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  onRefresh?: () => void; 
}

const ClassHeader = ({
  searchTerm,
  onSearchChange,
  teachers,
  classes,
  setClasses,
  onRefresh,
}: ClassHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* <GraduationCap className="h-8 w-8 text-blue-600" /> */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
            <p className="text-gray-600 mt-1">
              Manage classes, subjects, teachers, and schedules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <CreateClassDialog
            teachers={teachers}
            classes={classes}
            setClasses={setClasses}
              onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassHeader;