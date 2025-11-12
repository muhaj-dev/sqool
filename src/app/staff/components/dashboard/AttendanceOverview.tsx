"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AttendanceOverviewProps {
  attendanceRate: number;
}

export function AttendanceOverview({
  attendanceRate,
}: AttendanceOverviewProps) {
  // Determine color gradient based on attendance rate
  const getColorClass = (rate: number) => {
    if (rate >= 90) return "text-green-500"; // Excellent
    if (rate >= 75) return "text-emerald-400"; // Good
    if (rate >= 50) return "text-yellow-400"; // Average
    if (rate >= 30) return "text-orange-400"; // Below average
    return "text-red-500"; // Poor
  };

  const colorClass = getColorClass(attendanceRate);

  // Background gradient to subtly reflect state
  const gradientBg = cn(
    "flex flex-col items-center justify-center py-6 transition-colors duration-500 rounded-lg",
    attendanceRate >= 90
      ? "bg-gradient-to-b from-green-50 to-transparent"
      : attendanceRate >= 50
      ? "bg-gradient-to-b from-yellow-50 to-transparent"
      : "bg-gradient-to-b from-red-50 to-transparent"
  );

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg">Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={gradientBg}>
          {/* Circular Progress */}
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted transition-colors duration-300"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${
                  2 * Math.PI * 56 * (1 - attendanceRate / 100)
                }`}
                className={cn(colorClass, "transition-all duration-700")}
                strokeLinecap="round"
              />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={cn(
                  "text-3xl font-bold transition-colors duration-500",
                  colorClass
                )}
              >
                {attendanceRate}%
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground mb-4">This week</p>

          {/* Button */}
          <Button className="w-full">
            <Link href="/staff/attendance" className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Attendance
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
