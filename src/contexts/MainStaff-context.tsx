"use client";
import { type ReactNode, createContext, useContext, useState } from "react";

import { LessonTable } from "@/components/staff/tables/lesson-table";
import { TimeTable } from "@/components/staff/tables/timetable";
import TeacherDetail from "@/components/staff/TeacherDetail";

export const MainStaffContext = createContext({
  updateIndex: (index: number): void => {},
  step: ({ staffId }: { staffId: string }) => <span />,
  activeIndex: 0,
});

const MainStaffContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [TeacherDetail, LessonTable, TimeTable];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const updateIndex = (index: number) => {
    setActiveIndex(index);
  };
  const step = activeIndex < 3 ? activeIndex : 2;
  const value = { updateIndex, step: Elements[step], activeIndex };
  return <MainStaffContext.Provider value={value}>{children}</MainStaffContext.Provider>;
};
export function useMainStaff() {
  const { step, updateIndex, activeIndex } = useContext(MainStaffContext);
  return { step, updateIndex, activeIndex };
}
export default MainStaffContextProvider;
