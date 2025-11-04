"use client"

import { useEffect } from "react";
import { AttendanceStatsCard } from "./AttendanceStatsCard";
import { AttendanceTable } from "./AttendanceTable";
import { useAttendanceData } from "@/hooks/useAttendanceData";
import { useAttendanceStats } from "@/hooks/useAttendanceStats";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CheckCircle, XCircle, TrendingUp } from "lucide-react";

export default function StatsOverview() {
  const { data: studentData, isLoading } = useAttendanceData();
  const { initializeAttendance,setStudent,students } = useAttendanceStore();
  const stats = useAttendanceStats(studentData || []);

  // Initialize attendance records when students load
  useEffect(() => {
    if (studentData) {
      setStudent(studentData)
      initializeAttendance(studentData.map((s) => s.id));
    }
  }, [studentData, initializeAttendance,setStudent]);

  return (
    <div className="space-y-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </>
          ) : (
            <>
              <AttendanceStatsCard
                title="Total Students"
                value={stats.total}
                icon={Users}
                iconClassName="bg-primary/10"
              />
              <AttendanceStatsCard
                title="Present Today"
                value={stats.present}
                subtitle={`${stats.presentRate}%`}
                icon={CheckCircle}
                iconClassName="bg-success/10 text-success"
              />
              <AttendanceStatsCard
                title="Absent Today"
                value={stats.absent}
                subtitle={`${stats.absentRate}%`}
                icon={XCircle}
                iconClassName="bg-destructive/10 text-destructive"
              />
              <AttendanceStatsCard
                title="Attendance Rate"
                value={`${stats.presentRate}%`}
                subtitle="This week"
                icon={TrendingUp}
                iconClassName="bg-accent/10 text-accent-foreground"
              />
            </>
          )}
        </div>
        <AttendanceTable students={students??[]} isLoading={isLoading} />
    </div>
  );
}
