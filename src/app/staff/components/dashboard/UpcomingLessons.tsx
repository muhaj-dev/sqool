"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClassScheduleForStaff } from "@/utils/api";
import ErrorState from "@/components/ErrorState";
import { format } from "date-fns";
import { ClassSchedule } from "@/types";
import Link from "next/link";
import { AuthUser } from "@/zustand/authStore";

interface UpcomingLessonsProps {
  staffId: string | undefined;
  user: AuthUser | null;
}

export function UpcomingLessons({ staffId, user }: UpcomingLessonsProps) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["staff-upcoming-lessons", staffId],
    queryFn: async () => {
      const res = await getClassScheduleForStaff();
      console.log("getClassScheduleForStaff Response:", res);
      return res.data;
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 10 * 60 * 60 * 1000,
    gcTime: 10 * 60 * 60 * 1000,
  });
  const lessons: ClassSchedule[] = data || [];

  const formatTimeRange = (start: string, end: string) => {
    try {
      return `${format(new Date(start), "hh:mm a")} - ${format(
        new Date(end),
        "hh:mm a"
      )}`;
    } catch {
      return "Invalid time";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Upcoming Lessons</CardTitle>
        <Link
          href="/staff/timetable"
          className="font-medium text-sm py-1 hover:bg-accent hover:text-accent-foreground relative -top-0.5 px-0.5 rounded-xs"
        >
          View All
        </Link>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Skeleton Loader */}
          {isPending &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0 animate-pulse"
              >
                <div className="p-2 bg-primary/10 rounded-lg h-6 w-6" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-2 bg-muted rounded w-3/4" />
                  <div className="h-2 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          {/*Error State */}
          {isError && (
            <ErrorState
              variant="compact"
              onRetry={refetch}
              error={error}
              title="Failed to load lessons"
              description="Please try again later."
            />
          )}
          {/* Lesson Items */}
          {!isPending &&
            !isError &&
            lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-sm capitalize">
                      {lesson.subject?.name || "Unnamed Subject"}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {lesson.class || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {lesson.day || "—"}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {formatTimeRange(lesson.startTime, lesson.endTime)}
                  </p>
                </div>
              </div>
            ))}
          {/* Empty State */}
          {!isPending && !isError && lessons.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No upcoming lessons scheduled.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
