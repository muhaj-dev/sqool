"use client";
import { type ReactNode, createContext, useContext, useState } from "react";

import { BankInfoForm } from "@/components/admin/compulsory/BankInfoForm";
import ClassConfiguration from "@/components/admin/compulsory/ClassConfiguration";
import { TermAndSessionForm } from "@/components/admin/compulsory/TermAndSessionForm";

export const CompulsoryContext = createContext({
  updateIndex: (index: number): void => {},
  step: () => <span />,
  activeIndex: 0,
  goNextStep: (index: number): void => {},
});

const CompulsoryContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [ClassConfiguration, TermAndSessionForm, BankInfoForm];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const updateIndex = (index: number) => {
    setActiveIndex(index);
  };

  function goNextStep(activeIndex: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    activeIndex + 1;
  }
  const step = activeIndex < 3 ? activeIndex : 0;
  const value = { updateIndex, step: Elements[step], activeIndex, goNextStep };
  return <CompulsoryContext.Provider value={value}>{children}</CompulsoryContext.Provider>;
};
export function useCompulsory() {
  const { step, updateIndex, activeIndex, goNextStep } = useContext(CompulsoryContext);
  return { step, updateIndex, activeIndex, goNextStep };
}
export default CompulsoryContextProvider;
