"use client";

import React from "react";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";
import { toast } from "@/components/ui/use-toast";
import { CreateAttendanceButton } from "./CreateAttendanceButton";
import CreateAttendanceDialog from "./CreateAttendanceDialog";
import { useAttendanceCreate } from "../../hooks/useAttendanceCreate";
import LoadingStateAttendance from "@/components/LoadingState";
import { useAuthStore } from "@/zustand/authStore";
import { useQuery } from "@tanstack/react-query";
import { getStaffClasses } from "@/utils/api/index";
import { useEffect } from "react";
import { useStaffClassesStore } from "@/zustand/staff/staffStore";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { getSessionsForStaff } from "@/utils/api";
import { normalizeSessionTermsData } from "@/utils/lib";
import { AttendanceDatePicker } from "./AttendanceDatePicker";
import { AcademicSessionTerms } from "@/types";

export function AttendanceHeader() {
  const {user} = useAuthStore()
  const {setClasses} = useStaffClassesStore();
  const [academicSessions,setAcademicSessions] =  React.useState<string[]>([]);
  const [termRanges,setTermRanges] =  React.useState<AcademicSessionTerms>({});

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
    gcTime: 10 * 60 * 1000,       // 10 minutes
  });

  const sessionsTermsQuery = useQuery({
    queryKey: ["sessions-terms", staffId],
    queryFn: async () => {
      const res = await getSessionsForStaff("1", "15");
      return res.data?.result;
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 10 * 60 * 1000,       // 10 minutes
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
     const {academicSessions,termRanges} = normalizeSessionTermsData(sessionsTermsQuery.data);
     console.log({academicSessions,termRanges}, "normalized sessions terms");
      setAcademicSessions(academicSessions);
      //default to first session
      if(academicSessions.length>0){
        setSession(academicSessions[0]);
      }
      setTermRanges(termRanges);
    }}, [sessionsTermsQuery.data]);
  
  const handleMarkAllPresent = () => {
    markAllPresent();
    toast({
      title: "Success",
      description: "All students marked as present",
    });
  };

  const handleSaveAttendance = async () => {
    console.log({attendance});
     toast({
        title: "Attendance Saved",
        description: "Attendance records have been updated successfully",
      });
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
          <CreateAttendanceButton disabled={classQuery.isPending} onClick={() => controller.setOpen(true)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date Picker */}
        <AttendanceDatePicker/>

        {/* Class Selector */}
        <Select value={selectedClass} onValueChange={setClass}>
          <SelectTrigger disabled={classQuery.isPending} className="w-[280px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classQuery.data && 
            classQuery.data?.map((cls) => (
              <SelectItem key={cls._id} value={cls._id}>
                {cls.className} - {cls.shortName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {/* Action Buttons */}
        <Button disabled={classQuery.isPending} variant="outline" onClick={handleMarkAllPresent}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark All Present
        </Button>

        <Button
          disabled={classQuery.isPending}
          onClick={handleSaveAttendance }
        >
          Save Attendance
        </Button>
      </div>
      {attendanceCreate.loading && <LoadingStateAttendance title="Creating attendance..."/>}
      <CreateAttendanceDialog
        controller={controller}
        students={students}
        classOptions={classQuery.data?.map(item=>({id:item._id,name:`${item.className } -(${item.shortName})`})) || []}
        academicSessions={academicSessions}
        termRanges={termRanges}
      />
    </div>
  );
}
