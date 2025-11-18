"use client";

import { format } from "date-fns";
import { useState } from "react";

import { toast } from "@/components/ui/use-toast";
import { type CreateAttendancePayload, type Frequency } from "@/types";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";

export function useAttendanceCreate() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<Frequency | "">("");
  const { selectedClass } = useAttendanceStore();
  const [range, setRange] = useState<{
    from: string | Date | null;
    to: string | Date | null;
  } | null>(null);

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
    const payload: CreateAttendancePayload | null = range
      ? {
          classId: selectedClass,
          startDate: format(range.from!, "yyyy-MM-dd"),
          endDate: format(range.to!, "yyyy-MM-dd"),
          frequency: frequency as Frequency,
        }
      : null;

    console.log("Creating attendance...", payload);

    // TODO: integrate backend API:
    // await createAttendance(payload);
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
