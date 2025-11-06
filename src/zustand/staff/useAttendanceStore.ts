import { create } from 'zustand'
import { AttendanceStatus, StudentAttendance, TermDateRange } from "@/types";
import { generateBusinessDayDates } from "@/utils/lib";

interface AttendanceRecord {
  status: AttendanceStatus
  remarks: string
}

interface AttendanceStore {
  selectedDate: Date;
  selectedClass: string;
  selectedSession: string;
  selectedTerm: TermDateRange;
  attendance: Record<string, AttendanceRecord>;
  students: StudentAttendance[];
  setDate: (date: Date) => void;
  setClass: (classId: string) => void;
  setSession: (session: string) => void;
  setTerm: (term: TermDateRange) => void;
  setStudent: (students: StudentAttendance[]) => void;
  initializeAttendance: (studentIds: string[]) => void;
  updateAttendance: (
    studentId: string,
    record: Partial<AttendanceRecord>
  ) => void;
  markAllPresent: () => void;
  resetAttendance: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  selectedDate: new Date(),
  selectedClass: "p3-math",
  selectedSession: "2024/2025",
  selectedTerm: { termDates: { first: generateBusinessDayDates(7) } },
  attendance: {},
  students: [],

  setDate: (date: Date) => set({ selectedDate: date }),

  setClass: (classId: string) =>
    set({
      selectedClass: classId,
      attendance: {},
    }),

  setSession: (session: string) =>
    set({
      selectedSession: session,
    }),

  setTerm: (term: TermDateRange) =>
    set({
      selectedTerm: term,
    }),

  setStudent: (students: StudentAttendance[]) =>
    set({
      students,
    }),

  initializeAttendance: (studentIds: string[]) =>
    set((state) => {
      const newAttendance = { ...state.attendance };
      studentIds.forEach((id) => {
        if (!newAttendance[id]) {
          newAttendance[id] = { status: "absent", remarks: "" };
        }
      });
      return { attendance: newAttendance };
    }),

  updateAttendance: (studentId: string, record: Partial<AttendanceRecord>) =>
    set((state) => ({
      attendance: {
        ...state.attendance,
        [studentId]: {
          ...state.attendance[studentId],
          status: state.attendance[studentId]?.status || "absent",
          remarks: state.attendance[studentId]?.remarks || "",
          ...record,
        },
      },
    })),

  markAllPresent: () =>
    set((state) => {
      const updatedAttendance: Record<string, AttendanceRecord> = {};
      Object.keys(state.attendance).forEach((studentId) => {
        updatedAttendance[studentId] = {
          ...state.attendance[studentId],
          status: "present",
        };
      });
      return { attendance: updatedAttendance };
    }),

  resetAttendance: () => set({ attendance: {} }),
}));
