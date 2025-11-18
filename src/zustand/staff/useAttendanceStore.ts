import { create } from "zustand";

import { ATTENDANCE_STORAGE_KEY } from "@/constants";
import { type AttendanceStatus, type StudentAttendance, type TermDateRange } from "@/types";
import { generateBusinessDayDates, getDefaultSchoolSession } from "@/utils/lib";

interface AttendanceRecord {
  status: AttendanceStatus;
  remarks: string;
}

export interface AttendanceStore {
  startDate: Date;
  endDate: Date;
  selectedClass: string;
  selectedSession: string;
  selectedTerm: TermDateRange;
  attendance: Record<string, AttendanceRecord>;
  students: StudentAttendance[];

  // setters
  setDate: (startDate?: Date, endDate?: Date) => void;
  setClass: (classId: string) => void;
  setSession: (session: string) => void;
  setTerm: (term: TermDateRange) => void;
  setStudent: (students: StudentAttendance[]) => void;

  // attendance
  initializeAttendance: (studentIds: string[]) => void;
  updateAttendance: (studentId: string, record: Partial<AttendanceRecord>) => void;
  markAllPresent: () => void;
  resetAttendance: () => void;

  // persistence
  clearLocalStorage: () => void;
}

/* -----------------------------
    Load from localStorage
----------------------------- */
const loadInitialState = (): Partial<AttendanceStore> => {
  try {
    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored) as AttendanceStore;

    // revive date objects if they exist
    if (parsed.startDate) parsed.startDate = new Date(parsed.startDate);
    if (parsed.endDate) parsed.endDate = new Date(parsed.endDate);

    return parsed;
  } catch {
    return {};
  }
};

/* -----------------------------
    Persist to localStorage
----------------------------- */
const persist = (state: AttendanceStore) => {
  const toStore = {
    startDate: state.startDate,
    endDate: state.endDate,
    selectedClass: state.selectedClass,
    selectedSession: state.selectedSession,
    selectedTerm: state.selectedTerm,
    attendance: state.attendance,
    students: state.students,
  };

  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(toStore));
};

/* -----------------------------
    Zustand Store
----------------------------- */
export const useAttendanceStore = create<AttendanceStore>((set, get) => {
  const defaultState = {
    startDate: new Date(),
    endDate: new Date(),
    selectedClass: "",
    selectedSession: getDefaultSchoolSession(),
    selectedTerm: { termDates: { first: generateBusinessDayDates(7) } },
    attendance: {},
    students: [],
  };

  const initialState =
    typeof window !== "undefined" ? { ...defaultState, ...loadInitialState() } : defaultState;

  return {
    ...initialState,

    // Updates both start + end dates
    setDate: (startDate, endDate) => {
      const safeStart = startDate ?? new Date();
      const safeEnd = endDate ?? safeStart;
      set({ startDate: safeStart, endDate: safeEnd });
      persist(get());
    },

    setClass: (classId) => {
      set({ selectedClass: classId });
      persist(get());
    },

    setSession: (session) => {
      set({ selectedSession: session });
      persist(get());
    },

    setTerm: (term) => {
      set({ selectedTerm: term });
      persist(get());
    },

    setStudent: (students) => {
      set({ students });
      persist(get());
    },

    initializeAttendance: (studentIds) =>
      set((state) => {
        const updated = { ...state.attendance };

        studentIds.forEach((id) => {
          if (!updated[id]) {
            updated[id] = { status: "absent", remarks: "" };
          }
        });

        const newState = { attendance: updated };
        persist({ ...get(), ...newState });
        return newState;
      }),

    updateAttendance: (studentId, record) =>
      set((state) => {
        const newAttendance = {
          ...state.attendance,
          [studentId]: {
            status: state.attendance[studentId]?.status || "absent",
            remarks: state.attendance[studentId]?.remarks || "",
            ...record,
          },
        };

        const newState = { attendance: newAttendance };
        persist({ ...get(), ...newState });
        return newState;
      }),

    markAllPresent: () =>
      set((state) => {
        const updated: Record<string, AttendanceRecord> = {};

        Object.keys(state.attendance).forEach((id) => {
          updated[id] = { ...state.attendance[id], status: "present" };
        });

        const newState = { attendance: updated };
        persist({ ...get(), ...newState });
        return newState;
      }),

    resetAttendance: () => {
      set({ attendance: {} });
      persist(get());
    },

    clearLocalStorage: () => {
      localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
    },
  };
});
