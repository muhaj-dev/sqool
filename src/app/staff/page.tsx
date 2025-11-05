"use client";

import React, { useState } from "react";
import { StatsCard } from "./components/dashboard/StatsCard";
import { UpcomingLessons } from "./components/dashboard/UpcomingLessons";
import { RecentNotices } from "./components/dashboard/RecentNotice";
import { AttendanceOverview } from "./components/dashboard/AttendanceOverview";
import { ExaminationCard } from "./components/dashboard/ExaminationCard";
import { Users, GraduationCap, BookOpen, Calendar } from "lucide-react";

const Page = () => {
  //TODO: fetch staff dashboad and populate from server and populate
  const stats = {
    activeClasss: 5,
    totalStudent: 156,
    totalSubject: 2,
    lessonScheduledToday: 3,
    attendanceStats: 90,
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
        <StatsCard
          title="My Classes"
          value={stats.activeClasss ?? 0}
          subtitle="Active classes"
          icon={BookOpen}
        />
        <StatsCard
          title="My Students"
          value={stats.totalStudent ?? 0}
          subtitle="Total students"
          icon={Users}
        />
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
          <UpcomingLessons />
          <RecentNotices />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AttendanceOverview attendanceRate={stats.attendanceStats ?? 0} />
          <ExaminationCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
