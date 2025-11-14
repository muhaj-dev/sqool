import { create } from "zustand";
import type { IClassConfigurationResponse } from "@/types";

interface StaffClassesStore {
  classes: IClassConfigurationResponse[];
  selectedClassId: string | null;

  // Actions
  setClasses: (classes: IClassConfigurationResponse[]) => void;
  setSelectedClass: (classId: string | null) => void;
  clearClasses: () => void;
}

export const useStaffClassesStore = create<StaffClassesStore>((set) => ({
  classes: [],
  selectedClassId: null,

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
