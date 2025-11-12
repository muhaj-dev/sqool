"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, CalendarCheck, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getStaffNotices } from "@/utils/api";
import { AuthUser } from "@/zustand/authStore";
import ErrorState from "@/components/ErrorState";
import { cn } from "@/lib/utils";
import { Notice } from "@/types";
import Link from "next/link";

interface RecentNoticesProps {
  staffId: string | undefined;
  user: AuthUser | null;
}

const TYPE_CONFIG = {
  general: { icon: Info, bg: "bg-blue-100", text: "text-blue-700" },
  urgent: { icon: AlertCircle, bg: "bg-red-100", text: "text-red-700" },
  reminder: {
    icon: CalendarCheck,
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  event: { icon: CalendarCheck, bg: "bg-green-100", text: "text-green-700" },
  announcement: { icon: Bell, bg: "bg-primary/10", text: "text-primary" },
};

export function RecentNotices({ staffId, user }: RecentNoticesProps) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["staff-dashboard-notices", staffId],
    queryFn: async () => {
      const res = await getStaffNotices("", 3); // recent 3 notices
      return res.result as Notice[];
    },
    enabled: !!staffId && user?.role === "teacher",
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const notices = data || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Notices</CardTitle>
        <Link
          className="font-medium text-sm py-1 hover:bg-accent hover:text-accent-foreground relative -top-0.5 px-0.5 rounded-xs"
          href="/staff/noticeboard"
        >
          View All
        </Link>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Skeleton Loading */}
          {isPending &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0 animate-pulse"
              >
                <div className="p-2 rounded-lg h-6 w-6 bg-muted/20" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-2 bg-muted rounded w-3/4" />
                  <div className="h-2 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}

          {/* Error State */}
          {isError && (
            <ErrorState
              variant="compact"
              onRetry={refetch}
              error={error}
              title="Error Fetching Notices"
              description="Failed to load notices. Please try again later."
            />
          )}

          {/* Notices */}
          {!isPending &&
            !isError &&
            notices.map((notice: Notice) => {
              const config =
                TYPE_CONFIG[notice.notificationType] || TYPE_CONFIG.general;
              const Icon = config.icon;

              return (
                <div
                  key={notice._id}
                  className={cn(
                    "flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0",
                    !notice.isActive && "opacity-50"
                  )}
                >
                  {/* Icon with badge color */}
                  <div className={cn("p-2 rounded-lg relative", config.bg)}>
                    <Icon className={cn("h-4 w-4", config.text)} />
                    {notice.isPinned && (
                      <Star className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{notice.title}</h4>
                      <div className="flex flex-col items-end">
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            config.bg,
                            config.text
                          )}
                        >
                          {notice.notificationType.toUpperCase()}
                        </span>
                        {/* Visibility Badge */}
                        <div className="flex gap-1 mt-1">
                          <span
                            className={cn(
                              "text-[9px] font-medium px-1.5 py-0.5 rounded-sm border",
                              notice.visibility === "everyone"
                                ? "bg-green-100 border-green-300 text-green-800"
                                : notice.visibility === "staff"
                                ? "bg-blue-100 border-blue-300 text-blue-800"
                                : "bg-purple-100 border-purple-300 text-purple-800"
                            )}
                          >
                            {notice.visibility.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {notice.content}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
