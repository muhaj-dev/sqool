"use client";

import { useState } from "react";
import { CreateAttendancePayload } from "@/types";
import { toast } from "@/components/ui/use-toast";

export function useAttendanceCreate() {
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<
    "week" | "month" | "term" | "custom" | ""
  >("");
  const [range, setRange] = useState<{ start: string; end: string } | null>(
    null
  );

  const reset = () => {
    setSelectedClass("");
    setFrequency("");
    setRange(null);
  };

  const submit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      reset();
    toast({
        title:"Success Attendance",
        description:"Attendance was created successfully"
    })
    }, 3000);
    const payload: CreateAttendancePayload = {
      classId: selectedClass,
      startDate: range?.start!,
      endDate: range?.end!,
      frequency: frequency as any,
    };

    console.log("Creating attendance...", payload);

    // TODO: integrate backend API:
    // await createAttendance(payload);

    // setOpen(false);
    // reset();
    // toast({
    //     title:"Success Attendance",
    //     description:"Attendance was created successfully"
    // })
  };

  return {
    open,
    setOpen,
    loading,
    selectedClass,
    setSelectedClass,
    frequency,
    setFrequency,
    range,
    setRange,
    reset,
    submit,
  };
}
