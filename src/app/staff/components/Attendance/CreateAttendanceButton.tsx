"use client";

import { Button } from "@/components/ui/button";
import { Plus,BanIcon } from "lucide-react";

export function CreateAttendanceButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="gap-2">
      <Plus className="w-4 h-4" />
      Create Attendance
    </Button>
  );
}
export function CancelAttendanceButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="destructive" onClick={onClick} className="gap-2 w-full">
      <BanIcon className="w-4 h-4" />
      Close
    </Button>
  );
}
