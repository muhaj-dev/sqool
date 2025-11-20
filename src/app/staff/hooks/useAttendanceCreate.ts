"use client";

import { format } from "date-fns";
import { useState } from "react";

import { toast } from "@/components/ui/use-toast";
import { type AttendanceStatus, type CreateAttendancePayload, type Frequency } from "@/types";
import { createStudentAttendanceStaff, saveStaffAttendance } from "@/utils/api/index";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAttendanceCreate() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<Frequency | "">("");
  const { selectedClass, students, resetAttendance, clearLocalStorage } = useAttendanceStore();
  const [range, setRange] = useState<{
    from: string | Date | null;
    to: string | Date | null;
  } | null>(null);

  const queryClient = useQueryClient();

  const { mutate: createAttendance, data: attendanceDataCreated } = useMutation({
    mutationFn: async ({
      classId,
      attendance,
    }: {
      classId: string;
      attendance: { studentId: string; status: AttendanceStatus; remarks: string }[];
    }) => {
      return createStudentAttendanceStaff(classId, attendance);
    },

    onSuccess: async () => {
      setLoading(false);
      toast({
        title: "Attendance Created",
        description: "Attendance records have been created successfully",
      });

      await queryClient.invalidateQueries({
        queryKey: ["staff-student-attendance"],
      });
    },

    onError: (error: any) => {
      setLoading(false);
      toast({
        title: "Failed to Create Attendance",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const { mutate: saveAttendance, data: attendanceDataSaved } = useMutation({
    mutationFn: async ({
      classId,
      attendance,
    }: {
      classId: string;
      attendance: { studentId: string; status: AttendanceStatus; remarks: string }[];
    }) => {
      return saveStaffAttendance(classId, attendance);
    },

    onSuccess: async () => {
      setLoading(false);
      toast({
        title: "Attendance Saved",
        description: "Attendance records have been saved successfully",
      });
      resetAttendance();
      clearLocalStorage();
      await queryClient.invalidateQueries({
        queryKey: ["staff-student-attendance"],
      });
    },

    onError: (error: any) => {
      setLoading(false);
      toast({
        title: "Failed to Save Attendance",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const reset = () => {
    setFrequency("");
    setRange(null);
  };

  const submit = () => {
    const attendance = {};
    if (!attendance) return;
    setLoading(true);

    const payload: CreateAttendancePayload | null = range
      ? {
          classId: selectedClass,
          startDate: format(range.from!, "yyyy-MM-dd"),
          endDate: format(range.to!, "yyyy-MM-dd"),
          frequency: frequency as Frequency,
          // attendance: Object.entries(attendance).map(([studentId, record]) => ({
          //   studentId,
          //   status: record.status,
          //   remarks: record.remarks,
          // })),
        }
      : null;

    // if (payload) {
    //   console.log({ payload }, "Submitting attendance");
    //   createAttendance(payload);
    //   setOpen(false);
    //   reset();
    //   setLoading(false);
    //   toast({
    //     title: "Success Attendance",
    //     description: "Attendance was created successfully",
    //   });
    // }
  };

  return {
    open,
    setOpen,
    loading,
    setLoading,
    frequency,
    setFrequency,
    range,
    setRange,
    reset,
    submit,
    saveAttendance,
  };
}
