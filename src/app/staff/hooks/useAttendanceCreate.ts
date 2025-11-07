"use client";

import { useState } from "react";
import { CreateAttendancePayload } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";
import { format } from "date-fns";

export function useAttendanceCreate() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<
    "week" | "month" | "term" | "custom" | ""
  >("");
  const { selectedClass } = useAttendanceStore();
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);

  console.log({ range });

  const reset = () => {
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
        title: "Success Attendance",
        description: "Attendance was created successfully",
      });
    }, 3000);
    const payload: CreateAttendancePayload = {
      classId: selectedClass,
      startDate: format(range?.from!, "yyyy-MM-dd"),
      endDate: format(range?.to!, "yyyy-MM-dd"),
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
    frequency,
    setFrequency,
    range,
    setRange,
    reset,
    submit,
  };
}
