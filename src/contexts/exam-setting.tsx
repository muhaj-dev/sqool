"use client"
import { ReactNode, createContext, useContext } from "react"
import { useState } from "react"
import PersonDetail from "@/components/settings/PersonDetail"
import CompanySetting from "@/components/settings/CompanySetting"
import PasswordSetting from "@/components/settings/PasswordSetting"

export const ExamContext = createContext({
  updateIndex: (index: number): void => {},
  step: () => <></>,
  activeIndex: 0,
})

const ExamContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [PersonDetail, CompanySetting, PasswordSetting]
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const updateIndex = (index: number) => {
    setActiveIndex(index)
  }
  const step = activeIndex < 3 ? activeIndex : 0
  const value = { updateIndex, step: Elements[step], activeIndex }
  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
}
export function useSetting() {
  const { step, updateIndex, activeIndex } = useContext(ExamContext)
  return { step, updateIndex, activeIndex }
}
export default ExamContextProvider
