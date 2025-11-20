"use client";
import { type ReactNode, createContext, useContext, useState } from "react";

import CompanySetting from "@/components/settings/CompanySetting";
import PasswordSetting from "@/components/settings/PasswordSetting";
import PersonDetail from "@/components/settings/PersonDetail";

export const ExamContext = createContext({
  updateIndex: (index: number): void => {},
  step: () => <span />,
  activeIndex: 0,
});

const ExamContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [PersonDetail, CompanySetting, PasswordSetting];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const updateIndex = (index: number) => {
    setActiveIndex(index);
  };
  const step = activeIndex < 3 ? activeIndex : 0;
  const value = { updateIndex, step: Elements[step], activeIndex };
  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};
export function useSetting() {
  const { step, updateIndex, activeIndex } = useContext(ExamContext);
  return { step, updateIndex, activeIndex };
}
export default ExamContextProvider;
