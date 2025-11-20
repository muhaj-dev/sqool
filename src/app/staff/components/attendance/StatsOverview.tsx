"use client";

import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { CheckCircle, TrendingUp, Users, XCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { useAttendanceStats } from "@/app/staff/hooks/useAttendanceStats";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudentAttendance } from "@/utils/api/index";
import { mapStudentToAttendance } from "@/utils/lib";
import { useAuthStore } from "@/zustand/authStore";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";

import { AttendanceStatsCard } from "./AttendanceStatsCard";
import { AttendanceTable } from "./AttendanceTable";

export default function StatsOverview() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user } = useAuthStore();
  const { selectedClass, startDate, endDate } = useAttendanceStore();

  const staffId = user?._id;
  console.log({ selectedClass, startDate, endDate }, "selected class and dates in stats overview");

  // const query = useInfiniteQuery({
  //   queryKey: ["staffs-attendance-students", staffId, selectedClass, startDate, endDate],
  //   queryFn: async ({ pageParam = 1 }) => {
  //     const res = await getAllStudentsStaff(pageParam, PAGE_SIZE, searchQuery, {
  //       include: "Attendance",
  //       startDate,
  //       endDate,
  //       classId: selectedClass,
  //     });
  //     return res.data;
  //   },
  //   getNextPageParam: (lastPage) => {
  //     if (lastPage.pagination?.hasNextPage) {
  //       return lastPage.pagination.nextPage;
  //     }
  //     return undefined;
  //   },
  //   initialPageParam: 1,
  //   staleTime: 2 * 60 * 1000,
  //   gcTime: 10 * 60 * 1000,
  //   enabled: !!startDate && !!staffId && !!selectedClass && user?.role === "teacher",
  // });

  const studentAttendanceQuery = useQuery({
    queryKey: ["staff-student-attendance", staffId],
    queryFn: async () => {
      const res = await getStudentAttendance(selectedClass);
      return res;
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Flatten pages
  // const studentData = useMemo(
  //   () =>
  //     query.data?.pages
  //       .flatMap((page) => page.result)
  //       .filter((item, index, self) => index === self.findIndex((t) => t._id === item._id)) ?? [],
  //   [query.data],
  // );

  const studentsAttendance = useMemo(
    () =>
      studentAttendanceQuery.data?.records?.map((item, index) =>
        mapStudentToAttendance(item.student, index),
      ),
    [studentAttendanceQuery.data],
  );

  console.log(studentsAttendance, "students attendance in stats overview");

  const { initializeAttendance, setStudent, students } = useAttendanceStore();
  const stats = useAttendanceStats(studentsAttendance || []);

  // Initialize attendance records when students load
  useEffect(() => {
    if (studentAttendanceQuery.data && studentsAttendance) {
      setStudent(studentsAttendance);
      initializeAttendance(studentsAttendance.map((s) => s.id));
    }
  }, [studentsAttendance, initializeAttendance, setStudent]);

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  if (user?.role !== "teacher") return;

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {studentAttendanceQuery.isPending ? (
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
      <AttendanceTable
        students={students ?? []}
        isLoading={studentAttendanceQuery.isPending}
        performDeepSearch={(query, shouldSearch) => {
          if (shouldSearch) {
            debouncedSearch(query);
          }
        }}
      />
    </div>
  );
}
