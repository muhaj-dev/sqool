"use client"

import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";
import { StudentAttendance, AttendanceStatus,StatusColorKey, StatusFilter } from "@/types";
import { cn } from "@/lib/utils";
import { Eye, FileText } from "lucide-react";
import { useState } from "react";
import { StudentInfoDialog } from "./StudentInfoDialog";
import { RemarkModal } from "./RemarkModal";

interface AttendanceRowProps {
  student: StudentAttendance
}

const statusColors = {
  present: "text-green-400 border-green-400 /20 bg-green-400/5",
  absent: "text-destructive border-destructive/20 bg-destructive/5",
  late: "text-yellow-600 border-yellow-600/20 bg-yellow-600/5",
  excused: "text-muted-foreground border-muted bg-muted/5",
};

export function AttendanceRow({ student }: AttendanceRowProps) {
  const { attendance, updateAttendance } = useAttendanceStore();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  
  const record = attendance[student.id] || {
    status: student.status as AttendanceStatus,
    remarks: "",
  };
  console.log(record.status,"status")

  const handleStatusChange = (status: AttendanceStatus) => {
    updateAttendance(student.id, { status });
  };

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <TableRow className="hover:bg-muted/50 transition-colors">
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={student.photo} alt={student.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Select value={record.status} onValueChange={handleStatusChange}>
            <SelectTrigger
              className={cn(
                "w-[140px] capitalize",
                statusColors[record.status as StatusColorKey]
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="excused">Excused</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRemarkModal(true)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              {record.remarks ? "Edit Remark" : "Add Remark"}
            </Button>
            {record.remarks && (
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {record.remarks}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfoDialog(true)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View Info
          </Button>
        </TableCell>
      </TableRow>

      <StudentInfoDialog
        student={student}
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
      />

      <RemarkModal
        student={student}
        open={showRemarkModal}
        onOpenChange={setShowRemarkModal}
      />
    </>
  );
}
