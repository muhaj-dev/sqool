import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface AttendanceOverviewProps{
  attendanceRate:number;
}

export function AttendanceOverview({attendanceRate}:AttendanceOverviewProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - attendanceRate / 100)}`}
                className="text-success"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{attendanceRate}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">This week</p>
          <Button className="w-full">
            <Link href={"/staff/attendance"} className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Attendance
            </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
