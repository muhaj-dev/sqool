"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StudentAttendance } from "@/types";
import { User, Phone, Calendar, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface StudentInfoDialogProps {
  student: StudentAttendance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentInfoDialog({
  student,
  open,
  onOpenChange,
}: StudentInfoDialogProps) {
  if (!student) return null;

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Student Information</DialogTitle>
          <DialogDescription>
            Detailed information about {student.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.photo} alt={student.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground">
                {student.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {student.rollNumber}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Class</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {student.class || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Gender</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {student.gender || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Age</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {student.age ? `${student.age} years` : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Guardian</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {student.guardianName || "N/A"}
              </p>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Attendance Rate
                </span>
              </div>
              <span className="text-lg font-bold text-primary">
                {student.attendanceRate || 0}%
              </span>
            </div>
            <Progress value={student.attendanceRate || 0} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Overall attendance performance this term
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline">
              <Link href={`/staff/students/${student.id}`}>
                View Full Profile
              </Link>
            </Button>
            <Button
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
