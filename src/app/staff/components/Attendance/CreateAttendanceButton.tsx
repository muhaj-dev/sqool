"use client";

import { Button } from "@/components/ui/button";
import { Plus,BanIcon } from "lucide-react";

export function CreateAttendanceButton({ onClick,disabled=false }: { onClick: () => void,disabled:boolean }) {
  return (
    <Button disabled={disabled} onClick={onClick} className="gap-2">
      <Plus className="w-4 h-4" />
      Create Attendance
    </Button>
  );
}
export function CancelAttendanceButton({ onClick,disabled=false }: { onClick: () => void,disabled:boolean })  {
  return (
    <Button disabled={disabled} variant="destructive" onClick={onClick} className="gap-2 w-full">
      <BanIcon className="w-4 h-4" />
      Close
    </Button>
  );
}
