export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar?: string;
  class?: string;
  gender?: string;
  age?: number;
  guardianName?: string;
  attendanceRate?: number;
}

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  date: Date;
  remarks?: string;
}

export type StatusColorKey = 'present'|'absent'|'late'|'excused';

export type StatusFilter = "all"| StatusColorKey
export type GenderFilter = "male"|"female"|"all"