"use client";

import React, { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";

import LoadingStateAttendance from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { type AcademicSessionTerms } from "@/types";
import { getSessionsForStaff } from "@/utils/api";
import { getStaffClasses } from "@/utils/api/index";
import { formatDate, normalizeSessionTermsData } from "@/utils/lib";
import { useAuthStore } from "@/zustand/authStore";
import { useStaffClassesStore } from "@/zustand/staff/staffStore";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";

import MessageDialog from "@/components/message-dialog";
import { useAttendanceCreate } from "../../hooks/useAttendanceCreate";
import { AttendanceDatePicker } from "./AttendanceDatePicker";
import CreateAttendanceDialog from "./CreateAttendanceDialog";

export function AttendanceHeader() {
  const { user } = useAuthStore();
  const { setClasses } = useStaffClassesStore();
  const [academicSessions, setAcademicSessions] = React.useState<string[]>([]);
  const [termRanges, setTermRanges] = React.useState<AcademicSessionTerms>({});

  const staffId = user?._id;

  useAuthRedirect();
  const classQuery = useQuery({
    queryKey: ["staff-classes", staffId],
    queryFn: async () => {
      const res = await getStaffClasses(1, 15);
      return res.data.result;
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const sessionsTermsQuery = useQuery({
    queryKey: ["sessions-terms", staffId],
    queryFn: async () => {
      const res = await getSessionsForStaff("1", "15");
      return res.data?.result;
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    selectedClass,
    selectedSession,
    setSession,
    selectedTerm,
    setTerm,
    setClass,
    markAllPresent,
    attendance,
    students,
    resetAttendance,
  } = useAttendanceStore();
  const attendanceCreate = useAttendanceCreate();
  const controller = {
    ...attendanceCreate,
    selectedClass,
    setSelectedClass: setClass,
    selectedSession,
    setSelectedSession: setSession,
    selectedTerm,
    setSelectedTerm: setTerm,
  };

  useEffect(() => {
    if (classQuery.data) {
      setClasses(classQuery.data);
      setClass(classQuery.data[0]?._id || "");
    }
  }, [classQuery.data, setClasses]);

  useEffect(() => {
    if (sessionsTermsQuery.data) {
      const { academicSessions, termRanges } = normalizeSessionTermsData(sessionsTermsQuery.data);
      console.log({ academicSessions, termRanges }, "normalized sessions terms");
      setAcademicSessions(academicSessions);
      //default to first session
      if (academicSessions.length > 0) {
        setSession(academicSessions[0]);
      }
      setTermRanges(termRanges);
    }
  }, [sessionsTermsQuery.data]);

  const handleMarkAllPresent = () => {
    markAllPresent();
    toast({
      title: "Success",
      description: "All students marked as present",
    });
  };

  const saveAttendance = () => {
    const mappedAttendance = Object.entries(attendance).map(([studentId, record]) => ({
      studentId,
      status: record.status,
      remarks: record.remarks,
    }));
    attendanceCreate.setLoading(true);
    // Call the saveAttendance mutation from useAttendanceCreate
    attendanceCreate.saveAttendance({ classId: selectedClass, attendance: mappedAttendance });
  };

  const handleSaveAttendance = () => {
    void saveAttendance();
  };

  if (attendanceCreate.loading) {
    return (
      <MessageDialog
        title="Saving Attendance"
        type="info"
        description={`Attendance for ${students.length} on ${formatDate(new Date())} is being saved.`}
        open={attendanceCreate.loading}
        onOpenChange={() => {
          return;
        }}
        showSpinner={attendanceCreate.loading}
        message="Please wait while the attendance is being saved."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="attendance-header">
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">
            Manage daily attendance for your assigned classes
          </p>
        </div>
        <div className="flex justify-end">
          {/* <CreateAttendanceButton
            disabled={classQuery.isPending}
            onClick={() => controller.setOpen(true)}
          /> */}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date Picker */}
        <AttendanceDatePicker />

        {/* Class Selector */}
        <Select value={selectedClass} onValueChange={setClass}>
          <SelectTrigger disabled={classQuery.isPending} className="w-[280px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classQuery.data
              ? classQuery.data?.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id}>
                    {cls.className} - {cls.shortName}
                  </SelectItem>
                ))
              : null}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {/* Action Buttons */}
        <Button disabled={classQuery.isPending} variant="outline" onClick={handleMarkAllPresent}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark All Present
        </Button>

        <Button disabled={classQuery.isPending} onClick={handleSaveAttendance}>
          Save Attendance
        </Button>
      </div>
      {attendanceCreate.loading ? <LoadingStateAttendance title="Creating attendance..." /> : null}
      <CreateAttendanceDialog
        controller={controller}
        students={students}
        classOptions={
          classQuery.data?.map((item) => ({
            id: item._id,
            name: `${item.className} -(${item.shortName})`,
          })) || []
        }
        academicSessions={academicSessions}
        termRanges={termRanges}
      />
    </div>
  );
}
