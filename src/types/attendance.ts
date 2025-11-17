export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface Student {
  id: string
  name: string
  rollNumber: string
  avatar?: string
  class?: string
  gender?: string
  age?: number
  guardianName?: string
  attendanceRate?: number
}

export interface AttendanceRecord {
  studentId: string
  status: AttendanceStatus
  date: Date
  remarks?: string
}

export type StatusColorKey = AttendanceStatus;

export type StatusFilter = "all" | StatusColorKey;
export type GenderFilter = "male" | "female" | "all";

export interface CreateAttendancePayload {
  classId: string;
  startDate: string;
  endDate: string;
  frequency: "week" | "month" | "term" | "custom";
}

export type Term = "first" | "second" | "third";

export interface TermDateRange {
  termDates: Partial<Record<Term, { start: string; end: string }>>;
}

export interface AcademicSessionTerms {
  [academicYear: string]: {
    session: string;
    termDates: Partial<Record<Term, { start: string; end: string }>>;
  };
}