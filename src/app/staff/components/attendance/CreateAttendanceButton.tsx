"use client";

import { BanIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CreateAttendanceButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button disabled={disabled} onClick={onClick} className="gap-2">
      <Plus className="w-4 h-4" />
      Create Attendance
    </Button>
  );
}
export function CancelAttendanceButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button disabled={disabled} variant="destructive" onClick={onClick} className="gap-2 w-full">
      <BanIcon className="w-4 h-4" />
      Close
    </Button>
  );
}
