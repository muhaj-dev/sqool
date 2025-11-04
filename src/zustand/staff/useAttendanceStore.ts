import { create } from "zustand";
import { AttendanceStatus,StatusFilter,Student } from "@/types";

interface AttendanceRecord {
  status: AttendanceStatus;
  remarks: string;
}

interface AttendanceStore {
  selectedDate: Date;
  selectedClass: string;
  attendance: Record<string, AttendanceRecord>;
  students: (Student&{status:StatusFilter})[],
  setDate: (date: Date) => void;
  setClass: (classId: string) => void;
  setStudent: (students: (Student&{status:StatusFilter})[]) => void;
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
  attendance: {},
  students:[],

  setDate: (date) => set({ selectedDate: date }),

  setClass: (classId) =>
    set({
      selectedClass: classId,
      attendance: {},
    }),
  setStudent: (students) =>
    set({
      students
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

  updateAttendance: (studentId, record) =>
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
