"use client";

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

const classes = [
  { id: "p3-math", name: "Primary 3 - Mathematics" },
  { id: "p3-science", name: "Primary 3 - Science" },
  { id: "p4-math", name: "Primary 4 - Mathematics" },
  { id: "p5-science", name: "Primary 5 - Science" },
];

const academicSessions = ["2023/2024", "2024/2025", "2025/2026"];

const termRanges = {
  termDates: {
    first: { start: "2025-09-10", end: "2025-12-05" },
    second: { start: "2026-01-10", end: "2026-03-31" },
    third: { start: "2026-04-15", end: "2026-07-20" },
  },
};

export function AttendanceHeader() {
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
          <CreateAttendanceButton onClick={() => controller.setOpen(true)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
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
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {/* Action Buttons */}
        <Button variant="outline" onClick={handleMarkAllPresent}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark All Present
        </Button>

        <Button
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
        classOptions={classes}
        academicSessions={academicSessions}
        termRanges={termRanges}
      />
    </div>
  );
}
