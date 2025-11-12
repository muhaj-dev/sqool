"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getStaffUpcomingExam } from "@/utils/api/index"; // ← your API endpoint
import ErrorState from "@/components/ErrorState";
import { AuthUser } from "@/zustand/authStore";
import { Exam } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

interface ExaminationCardProps {
  staffId: string | undefined;
  user: AuthUser | null;
}
export function ExaminationCard({ staffId, user }: ExaminationCardProps) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["staff-dashboard-exams", staffId],
    queryFn: async () => {
      const res = await getStaffUpcomingExam(1, 4); // latest 4 exams
      return res.result;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!staffId && user?.role === "teacher",
  });

  console.log("ExaminationCard Data:", data);

  const exams = data || [];

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Upcoming Examinations
        </CardTitle>

        <Link
          href="/staff/exams"
          className="font-medium text-sm py-1 hover:bg-accent hover:text-accent-foreground relative -top-0.5 px-0.5 rounded-xs"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Skeleton Loader */}
          {isPending &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0 animate-pulse"
              >
                <div className="p-2 bg-warning/10 rounded-lg h-6 w-6" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-2 bg-muted rounded w-1/3" />
                  <div className="h-2 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}

          {/* Error State */}
          {isError && (
            <ErrorState
              variant="compact"
              onRetry={refetch}
              error={error}
              title="Error Fetching Exams"
              description="Failed to load upcoming examinations."
            />
          )}

          {/* Empty State */}
          {!isPending && !isError && exams.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-6">
              No upcoming exams available.
            </div>
          )}

          {/* Exams List */}
          {!isPending &&
            !isError &&
            exams.map((exam: Exam, index: number) => {
              const isApprove = exam.status === "approve";
              const iconColor = isApprove ? "text-green-500" : "text-warning";
              const iconBg = isApprove ? "bg-green-100/50" : "bg-warning/10";

              return (
                <div
                  key={index}
                  className={`flex bg-yellow-500/15 relative items-start gap-4 pb-4 last:pb-0 border-b last:border-0 transition-all hover:bg-muted/50 rounded-lg p-2`}
                >
                  <div className={`p-2 ${iconBg} rounded-lg`}>
                    <BookOpen className={`h-4 w-4 ${iconColor}`} />
                  </div>
                  <div className="flex-1 text-start">
                    <h4 className="font-semibold text-sm mb-1 capitalize">
                      {exam.subject.name || "Unknown Subject"}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 capitalize">
                      {exam.class.className || "Class not specified"}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2 capitalize">
                      Venue: {exam.venue || "Venue not specified"}
                    </p>
                    <div className="flex flex-col text-start gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 capitalize">
                        <Calendar className="h-3 w-3" />
                        Exam Date:
                        {`${format(new Date(exam.examDate), "MMM d, yyyy")}` ||
                          "TBA"}
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <Clock className="h-3 w-3" />
                        Time:
                        {` ${format(new Date(exam.startTime), "h:mm a")}` ||
                          "TBA"}
                      </span>
                    </div>
                  </div>
                  {isApprove && (
                    <span className=" absolute right-0 text-xs font-medium text-green-600 bg-green-100/60 rounded-full px-2 py-0.5 self-start">
                      Approved
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
