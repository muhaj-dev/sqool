"use client"
import { ReactNode, createContext, useContext } from "react"
import { useState } from "react"
import PersonDetail from "@/components/settings/PersonDetail"
import CompanySetting from "@/components/settings/CompanySetting"
import PasswordSetting from "@/components/settings/PasswordSetting"

export const SettingContext = createContext({
  goNextStep: () => {},
  updateIndex: (index: number): void => {},
  step: () => <></>,
  activeIndex: 0,
})

const SettingContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [PersonDetail, CompanySetting, PasswordSetting]
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const updateIndex = (index: number) => {
    setActiveIndex(index)
  }

  const goNextStep = () => {
    setActiveIndex(prev => {
      if (prev < 3) {
        return prev + 1
      }
      return 3
    })
  }
  const step = activeIndex < 3 ? activeIndex : 0
  const value = { updateIndex, step: Elements[step], activeIndex, goNextStep }
  return (
    <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
  )
}
export function useSetting() {
  const { step, updateIndex, activeIndex, goNextStep } =
    useContext(SettingContext)
  return { step, updateIndex, activeIndex, goNextStep }
}
export default SettingContextProvider
