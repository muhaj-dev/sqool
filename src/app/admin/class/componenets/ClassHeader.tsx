// components/class-management/ClassHeader.tsx
"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import CreateClassDialog from "./CreateClassDialog";

interface ClassHeaderProps {
  onRefresh?: () => void;
}

const ClassHeader = ({ onRefresh }: ClassHeaderProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleClassCreated = () => {
    setIsCreateDialogOpen(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* <GraduationCap className="h-8 w-8 text-blue-600" /> */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
            <p className="text-gray-600 mt-1">Manage classes, subjects, teachers, and schedules</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => setIsCreateDialogOpen(true)} className=" ">
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Create Class Dialog */}
      <CreateClassDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onClassCreated={handleClassCreated}
      />
    </div>
  );
};

export default ClassHeader;
