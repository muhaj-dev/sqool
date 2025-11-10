"use client";

import React from "react";
import { Calendar, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";
import { cn } from "@/lib/utils";
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


// const academicSessions = ["2023/2024", "2024/2025", "2025/2026"];//TODO: Fetch from API

// const termRanges = {
//   termDates: {
//     first: { start: "2025-09-10", end: "2025-12-05" },
//     second: { start: "2026-01-10", end: "2026-03-31" },
//     third: { start: "2026-04-15", end: "2026-07-20" },
//   },
// };//TODO: Fetch from API

export function AttendanceHeader() {
  const {user} = useAuthStore()
  const {setClasses} = useStaffClassesStore();
  const [academicSessions,setAcademicSessions] =  React.useState<string[]>([]);
  const [termRanges,setTermRanges] =  React.useState<any>({});

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
    selectedDate,
    selectedClass,
    selectedSession,
    setSession,
    selectedTerm,
    setTerm,
    setDate,
    setClass,
    markAllPresent,
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
      setAcademicSessions(academicSessions);
      setTermRanges(termRanges);
    }}, [sessionsTermsQuery.data]);
  
  const handleMarkAllPresent = () => {
    markAllPresent();
    toast({
      title: "Success",
      description: "All students marked as present",
    });
  };

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={classQuery.isPending}
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

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
          onClick={() => {
            toast({
              title: "Attendance Saved",
              description: "Attendance records have been updated successfully",
            });
          }}
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
