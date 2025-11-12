import { create } from "zustand";
import type { IClassConfigurationResponse } from "@/types";

type StaffCards = {
  totalClass: number; //total class assigned to staff
  totalStudents: number; //total student assigned to staff
  totalSubjects: number; //total subject assigned to staff
  totalLessonsToday: number; // total lessons to be handled by the staff today
  attendanceStat: number; // percentage performance of student in class attendance
};
interface StaffClassesStore {
  classes: IClassConfigurationResponse[];
  selectedClassId: string | null;
  staffCards: StaffCards;

  // Actions
  setStaffCards: (item: StaffCards) => void;
  setClasses: (classes: IClassConfigurationResponse[]) => void;
  setSelectedClass: (classId: string | null) => void;
  clearClasses: () => void;
}

export const useStaffClassesStore = create<StaffClassesStore>((set) => ({
  staffCards: {
    totalClass: 0,
    totalLessonsToday: 0,
    totalStudents: 0,
    totalSubjects: 0,
    attendanceStat: 0,
  },
  classes: [],
  selectedClassId: null,

  setStaffCards: (staffCards) => set({ staffCards }),
  setClasses: (classes) => set({ classes }),

  setSelectedClass: (classId) =>
    set({
      selectedClassId: classId,
    }),

  clearClasses: () =>
    set({
      classes: [],
      selectedClassId: null,
    }),
}));
