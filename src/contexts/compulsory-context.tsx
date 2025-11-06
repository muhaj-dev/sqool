'use client'
import { BankInfoForm } from '@/components/admin/compulsory/BankInfoForm'
import ClassConfiguration from '@/components/admin/compulsory/ClassConfiguration'
import { TermAndSessionForm } from '@/components/admin/compulsory/TermAndSessionForm'
import { ReactNode, createContext, useContext } from 'react'
import { useState } from 'react'

export const CompulsoryContext = createContext({
  updateIndex: (index: number): void => {},
  step: () => <></>,
  activeIndex: 0,
  goNextStep: (index: number): void => {},
})

const CompulsoryContextProvider = ({ children }: { children: ReactNode }) => {
  const Elements = [ClassConfiguration, TermAndSessionForm, BankInfoForm]
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const updateIndex = (index: number) => {
    setActiveIndex(index)
  }

  function goNextStep(activeIndex: number) {
    activeIndex + 1
  }
  const step = activeIndex < 3 ? activeIndex : 0
  const value = { updateIndex, step: Elements[step], activeIndex, goNextStep }
  return <CompulsoryContext.Provider value={value}>{children}</CompulsoryContext.Provider>
}
export function useCompulsory() {
  const { step, updateIndex, activeIndex, goNextStep } = useContext(CompulsoryContext)
  return { step, updateIndex, activeIndex, goNextStep }
}
export default CompulsoryContextProvider
