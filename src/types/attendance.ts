import { type IStudent } from ".";

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

export type StatusColorKey = AttendanceStatus;

export type StatusFilter = "all" | StatusColorKey;
export type GenderFilter = "male" | "female" | "all";

export interface CreateAttendancePayload {
  classId: string;
  startDate: string;
  endDate: string;
  frequency: Frequency;
  // attendance: { studentId: string; status: AttendanceStatus; remarks: string }[];
}
export type Frequency = "week" | "month" | "term" | "custom";
export type Term = "first" | "second" | "third";

export interface TermDateRange {
  termDates: Partial<Record<Term, { start: string; end: string }>>;
}

export type AcademicSessionTerms = Record<
  string,
  {
    session: string;
    termDates: Partial<Record<Term, { start: string; end: string }>>;
  }
>;

export interface AttendanceResponse {
  _id: string;
  records: {
    student: IStudent;
    status: AttendanceStatus;
    remarks?: string;
    _id: string;
  }[];
}
