'use client'

import React from "react";
import { StatsCard, StatsCardSkeleton } from "./components/dashboard/StatsCard";
import { UpcomingLessons } from "./components/dashboard/UpcomingLessons";
import { RecentNotices } from "./components/dashboard/RecentNotice";
import { AttendanceOverview } from "./components/dashboard/AttendanceOverview";
import { ExaminationCard } from "./components/dashboard/ExaminationCard";
import { Users, GraduationCap, BookOpen, Calendar } from "lucide-react";
import { useAuthStore } from "@/zustand/authStore";
import { useStaffClassesStore } from "@/zustand/staff/staffStore";
import { getStaffClasses, getAllStudents } from "@/utils/api/index";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { PAGE_SIZE } from "@/constants";

const Page = () => {
  const user = useAuthStore((state) => state.user);
  const { staffCards, setStaffCards } = useStaffClassesStore();
  const staffId = user?._id;
  //TODO: fetch staff dashboad and populate from server and populate
  const staffQuery = useQuery({
    queryKey: ["staff-classes", staffId],
    queryFn: async () => {
      const res = await getStaffClasses(1, 15);
      setStaffCards({ ...staffCards, totalClass: res.data.result.length });
      return res.data.result;
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const queryStaffStudent = useInfiniteQuery({
    queryKey: ["staffs-students", staffId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getAllStudents(pageParam, PAGE_SIZE, "");
      setStaffCards({
        ...staffCards,
        totalStudents: res.data.pagination.total,
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNextPage) {
        return lastPage.pagination.nextPage;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!staffId && user?.role === "teacher",
  });

  const stats = {
    activeClasss: staffCards.totalClass,
    totalStudent: staffCards.totalStudents,
    totalSubject: staffCards.totalSubjects,
    lessonScheduledToday: staffCards.totalLessonsToday,
    attendanceStats: staffCards.attendanceStat,
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, kon lola 👋
          </h1>
          <p className="text-muted-foreground">
            Primary 3 – Mathematics and Science
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Show stats:</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Home</span>
        <span>›</span>
        <span className="text-foreground">Dashboard</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staffQuery.isPending ? (
          <StatsCardSkeleton />
        ) : (
          <StatsCard
            title="My Classes"
            value={stats.activeClasss ?? 0}
            subtitle="Active classes"
            icon={BookOpen}
          />
        )}

        {queryStaffStudent.isPending ? (
          <StatsCardSkeleton />
        ) : (
          <StatsCard
            title="My Students"
            value={stats.totalStudent ?? 0}
            subtitle="Total students"
            icon={Users}
          />
        )}
        <StatsCard
          title="Subjects"
          value={stats.totalSubject ?? 0}
          subtitle="Mathematics, Science"
          icon={GraduationCap}
        />
        <StatsCard
          title="Today's Lessons"
          value={stats.lessonScheduledToday ?? 0}
          subtitle="Scheduled today"
          icon={Calendar}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingLessons staffId={user?._id} user={user} />
          <RecentNotices staffId={user?._id} user={user} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AttendanceOverview attendanceRate={stats.attendanceStats ?? 0} />
          <ExaminationCard staffId={user?._id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default Page
