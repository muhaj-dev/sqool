import CompulsorySteps from "@/components/admin/compulsory/CompulsorySteps"
import CompulsorySubBar from "@/components/admin/compulsory/CompulsorySubBar"
import { Separator } from "@/components/ui/separator"
import CompulsoryContextProvider from "@/contexts/compulsory-context"
import React, { ReactNode } from "react"

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <CompulsoryContextProvider>
      <section className="flex flex-col ">
        <Separator />
        <CompulsorySubBar />
        <Separator />
        <CompulsorySteps />
        <div>{children}</div>
      </section>
    </CompulsoryContextProvider>
  )
}

export default layout
