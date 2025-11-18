import { create } from "zustand";

interface SchoolState {
  schoolData: {
    upload: string;
    schoolShortName: string;
    schoolMoto: string;
    schoolPhoneNumber: string;
    lga: string;
    foundingDate: string;
    website: string;
    country: string;
    state: string;
    schoolAddress: string;
    schoolEmail: string;
  };
  setSchoolData: (data: Partial<SchoolState["schoolData"]>) => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  schoolData: {
    upload: "",
    schoolShortName: "",
    schoolMoto: "",
    schoolPhoneNumber: "",
    lga: "",
    foundingDate: new Date().toLocaleString(),
    website: "",
    country: "",
    state: "",
    schoolAddress: "",
    schoolEmail: "",
  },
  setSchoolData: (data) =>
    set((state) => ({
      schoolData: { ...state.schoolData, ...data },
    })),
}));
