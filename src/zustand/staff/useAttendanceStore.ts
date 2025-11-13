import { create } from "zustand";
import { AttendanceStatus, StudentAttendance, TermDateRange } from "@/types";
import { generateBusinessDayDates, getDefaultSchoolSession } from "@/utils/lib";
import { ATTENDANCE_STORAGE_KEY } from "@/constants";

interface AttendanceRecord {
  status: AttendanceStatus;
  remarks: string;
}

interface AttendanceStore {
  selectedDate: Date;
  selectedClass: string;
  selectedSession: string;
  selectedTerm: TermDateRange;
  attendance: Record<string, AttendanceRecord>;
  students: StudentAttendance[];

  // setters
  setDate: (date: Date) => void;
  setClass: (classId: string) => void;
  setSession: (session: string) => void;
  setTerm: (term: TermDateRange) => void;
  setStudent: (students: StudentAttendance[]) => void;

  // attendance
  initializeAttendance: (studentIds: string[]) => void;
  updateAttendance: (
    studentId: string,
    record: Partial<AttendanceRecord>
  ) => void;
  markAllPresent: () => void;
  resetAttendance: () => void;

  // persistence
  clearLocalStorage: () => void;
}

// --- Load from localStorage --- //
const loadInitialState = (): Partial<AttendanceStore> => {
  try {
    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);

    // revive Date type
    if (parsed.selectedDate) {
      parsed.selectedDate = new Date(parsed.selectedDate);
    }

    return parsed;
  } catch {
    return {};
  }
};

// --- Persist to localStorage --- //
const persist = (state: AttendanceStore) => {
  const toStore = {
    selectedDate: state.selectedDate,
    selectedClass: state.selectedClass,
    selectedSession: state.selectedSession,
    selectedTerm: state.selectedTerm,
    attendance: state.attendance,
    students: state.students,
  };

  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(toStore));
};

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  // DEFAULT STATE + HYDRATED STATE
  selectedDate: new Date(),
  selectedClass: "",
  selectedSession: getDefaultSchoolSession(),
  selectedTerm: { termDates: { first: generateBusinessDayDates(7) } },
  attendance: {},
  students: [],

  // overwrite defaults with stored values
  ...(typeof window !== "undefined" ? loadInitialState() : {}),

  // SETTERS
  setDate: (date) => {
    set({ selectedDate: date });
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

  // ATTENDANCE
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

  // CLEAR LOCAL STORAGE ONLY AFTER API SUCCESS
  clearLocalStorage: () => {
    localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
  },
}));
