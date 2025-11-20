"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, GraduationCap, Users } from "lucide-react";

import { getStaffDashboardStats } from "@/utils/api/index";
import { useAuthStore } from "@/zustand/authStore";

import { AttendanceOverview } from "./components/dashboard/AttendanceOverview";
import { ExaminationCard } from "./components/dashboard/ExaminationCard";
import { RecentNotices } from "./components/dashboard/RecentNotice";
import { StatsCard, StatsCardSkeleton } from "./components/dashboard/StatsCard";
import { UpcomingLessons } from "./components/dashboard/UpcomingLessons";
import Staffbar from "./components/staff/Staffbar";

const Page = () => {
  const user = useAuthStore((state) => state.user);

  const staffId = user?._id;
  //TODO: fetch staff dashboad and populate from server and populate
  const staffQueryStats = useQuery({
    queryKey: ["staff-dashboard-stats", staffId],
    queryFn: async () => {
      const res = await getStaffDashboardStats();
      return res.data;
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const stats = {
    activeClasss: staffQueryStats.data?.activeClasss,
    totalStudent: staffQueryStats.data?.totalStudent,
    totalSubject: staffQueryStats.data?.totalSubject,
    lessonScheduledToday: staffQueryStats.data?.lessonScheduledToday,
    attendanceStats: staffQueryStats.data?.attendanceStats,
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <Staffbar
        user={user}
        isPending={staffQueryStats.isPending}
        classes={stats.attendanceStats ?? []}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staffQueryStats.isPending ? (
          <StatsCardSkeleton />
        ) : (
          <StatsCard
            title="My Classes"
            value={stats.activeClasss ?? 0}
            subtitle="Active classes"
            icon={BookOpen}
          />
        )}

        {staffQueryStats.isPending ? (
          <StatsCardSkeleton />
        ) : (
          <StatsCard
            title="My Students"
            value={stats.totalStudent ?? 0}
            subtitle="Total students"
            icon={Users}
          />
        )}
        {staffQueryStats.isPending ? (
          <StatsCardSkeleton />
        ) : (
          <StatsCard
            title="Subjects"
            value={stats.totalSubject ?? 0}
            subtitle="Mathematics, Science"
            icon={GraduationCap}
          />
        )}
        {staffQueryStats.isPending ? (
          <StatsCardSkeleton />
        ) : (
          <StatsCard
            title="Today's Lessons"
            value={stats.lessonScheduledToday ?? 0}
            subtitle="Scheduled today"
            icon={Calendar}
          />
        )}
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
          <AttendanceOverview data={stats.attendanceStats ?? []} />
          <ExaminationCard staffId={user?._id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default Page;
