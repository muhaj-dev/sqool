"use client";
import { type ReactNode, createContext, useContext, useState } from "react";

import CompanySetting from "@/components/settings/CompanySetting";
import PasswordSetting from "@/components/settings/PasswordSetting";
import PersonDetail from "@/components/settings/PersonDetail";

export const SettingContext = createContext({
  goNextStep: () => {},
  updateIndex: (index: number): void => {},
  step: () => <span />,
  activeIndex: 0,
});

const SettingContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [PersonDetail, CompanySetting, PasswordSetting];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const updateIndex = (index: number) => {
    setActiveIndex(index);
  };

  const goNextStep = () => {
    setActiveIndex((prev) => {
      if (prev < 3) {
        return prev + 1;
      }
      return 3;
    });
  };
  const step = activeIndex < 3 ? activeIndex : 0;
  const value = { updateIndex, step: Elements[step], activeIndex, goNextStep };
  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>;
};
export function useSetting() {
  const { step, updateIndex, activeIndex, goNextStep } = useContext(SettingContext);
  return { step, updateIndex, activeIndex, goNextStep };
}
export default SettingContextProvider;
