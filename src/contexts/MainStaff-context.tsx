
"use client"
import { ReactNode, createContext, useContext } from "react"
import { useState } from "react"
import PersonDetail from "@/components/settings/PersonDetail"
import CompanySetting from "@/components/settings/CompanySetting"
import PasswordSetting from "@/components/settings/PasswordSetting"
import TeacherDetail from "@/components/staff/TeacherDetail"
import { TimeTable } from "@/components/staff/tables/timetable"
import { LessonTable } from "@/components/staff/tables/lesson-table"

export const MainStaffContext = createContext({
  updateIndex: (index: number): void => {},
  step: ({ staffId }: { staffId: string }) => <></>,
  activeIndex: 0,
})

const MainStaffContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [TeacherDetail, LessonTable, TimeTable]
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const updateIndex = (index: number) => {
    setActiveIndex(index)
  }
  const step = activeIndex < 3 ? activeIndex : 2
  const value = { updateIndex, step: Elements[step], activeIndex }
  return <MainStaffContext.Provider value={value}>{children}</MainStaffContext.Provider>
}
export function useMainStaff() {
  const { step, updateIndex, activeIndex } = useContext(MainStaffContext)
  return { step, updateIndex, activeIndex }
}
export default MainStaffContextProvider
