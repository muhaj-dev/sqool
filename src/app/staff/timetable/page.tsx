"use client";

import { useQuery } from "@tanstack/react-query";

import ErrorState from "@/components/ErrorState";
import { type Subject } from "@/types";
import { getClassScheduleForStaff, getSubjectsForStaff } from "@/utils/api";
import { formatTime } from "@/utils/lib";
import { useAuthStore } from "@/zustand/authStore";

import { ClassSummarySection } from "../components/timetable/ClassSummarySection";
import { HeaderSection } from "../components/timetable/Header";
import { TimetableSkeleton } from "../components/timetable/SkeletonsTimetable";
import { SubjectLegendSection } from "../components/timetable/SubjectLegend";
import {
  getCurrentClassesInfo,
  getSubjectColor,
  groupSchedulesByDay,
} from "../components/timetable/utils";
import { WeeklyTimetableSection } from "../components/timetable/WeeklyTimetableSection";

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
    queryFn: async () => (await getClassScheduleForStaff()).data,
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
          error={errorSchedule}
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
