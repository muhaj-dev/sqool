import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ClassSchedule } from "@/types";
import ErrorState from "@/components/ErrorState";
import { TimetableSkeleton } from "./SkeletonsTimetable";

export const WeeklyTimetableSection = ({
  schedulesByDay,
  isPending,
  isError,
  error,
  refetch,
  formatTime,
}: {
  schedulesByDay: Record<string, ClassSchedule[]>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  formatTime: (d: string) => string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Weekly Timetable</CardTitle>
    </CardHeader>
    <CardContent>
      {isPending ? (
        <TimetableSkeleton skipHeader />
      ) : isError ? (
        <ErrorState
          error={error as Error}
          onRetry={refetch}
          title="Failed to load schedule"
          description="We couldn’t fetch your class schedules. Please retry."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(schedulesByDay).map(([day, periods]) => (
            <div key={day} className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">{day}</h3>
              {periods.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed bg-muted/50 text-center text-muted-foreground">
                  No classes scheduled for {day}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {periods.map((p) => (
                    <div
                      key={p._id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium capitalize">
                            {p.subject.name}
                          </h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {p.teacher?.userId?.firstName}{" "}
                            {p.teacher?.userId?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {formatTime(p.startTime)} - {formatTime(p.endTime)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);