"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubjectsForStaff, getClassScheduleForStaff } from "@/utils/api";
import { useAuthStore } from "@/zustand/authStore";
import { ClassSchedule, Subject } from "@/types";
import ErrorState from "@/components/ErrorState";
import { TimetableSkeleton } from "../components/timetable/SkeletonsTimetable";
import { ClassSummarySection } from "../components/timetable/ClassSummarySection";
import { HeaderSection } from "../components/timetable/Header";
import { WeeklyTimetableSection } from "../components/timetable/WeeklyTimetableSection";
import { SubjectLegendSection } from "../components/timetable/SubjectLegend";
import {
  getSubjectColor,
  groupSchedulesByDay,
  getCurrentClassesInfo,
} from "../components/timetable/utils";
import { formatTime } from "@/utils/lib";

const Timetable = () => {
  const { user } = useAuthStore();
  const staffId = user?._id;

  // Fetch Class Schedules
  const {
    data: dataSchedule,
    isPending: isPendingSchedule,
    isError: isErrorSchedule,
    error: errorSchedule,
    refetch: refetchSchedule,
  } = useQuery({
    queryKey: ["staff-all-schedules", staffId],
    queryFn: async () =>
      (await getClassScheduleForStaff()).data as ClassSchedule[],
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 10 * 60 * 1000,
  });

  // Fetch Subjects
  const {
    data: dataStaffSubject,
    isPending: isPendingStaffSubject,
    isError: isErrorStaffSubject,
    error: errorStaffSubject,
    refetch: refetchStaffSubject,
  } = useQuery({
    queryKey: ["staff-all-subjects", staffId],
    queryFn: async () => (await getSubjectsForStaff(1)).data as Subject[],
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 10 * 60 * 1000,
  });

  const schedules = dataSchedule || [];
  const staffSubjects = dataStaffSubject || [];
  const schedulesByDay = groupSchedulesByDay(schedules);
  const { currentClass, nextClass, completedClasses, totalToday } =
    getCurrentClassesInfo(schedules);

  return (
    <div className="space-y-6 mb-10">
      {/* Header */}
      <HeaderSection />

      {/* Current / Next Class Section */}
      {isPendingSchedule ? (
        <TimetableSkeleton skipHeader />
      ) : isErrorSchedule ? (
        <ErrorState
          error={errorSchedule as Error}
          onRetry={refetchSchedule}
          title="Failed to load schedule"
          description="We couldn’t fetch your class schedules. Please retry."
        />
      ) : (
        <ClassSummarySection
          currentClass={currentClass}
          nextClass={nextClass}
          completedClasses={completedClasses}
          totalToday={totalToday}
          formatTime={formatTime}
        />
      )}

      {/* Weekly Timetable */}
      <WeeklyTimetableSection
        schedulesByDay={schedulesByDay}
        isPending={isPendingSchedule}
        isError={isErrorSchedule}
        error={errorSchedule}
        refetch={refetchSchedule}
        formatTime={formatTime}
      />

      {/* Subject Legend */}
      <SubjectLegendSection
        isPending={isPendingStaffSubject}
        isError={isErrorStaffSubject}
        error={errorStaffSubject}
        refetch={refetchStaffSubject}
        subjects={staffSubjects}
        getSubjectColor={getSubjectColor}
      />
    </div>
  );
};

export default Timetable;
