'use client'

// import StudentLeftBar from "@/components/student/StudentLeftBar"
// import StudentLeftBar from "@/components/student/StudentLeftBar"
import StudentSteps from "@/components/student/StudentSteps"
import StudentTopBar from "@/components/student/StudentTopBar"
import { Separator } from "@/components/ui/separator"
// import StudentContextProvider from "@/contexts/student-context"
import React, { ReactNode } from "react"

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
     {/* <StudentContextProvider> */}
      <div className="flex flex-col gap-4">
        {/* <Separator /> */}
        <StudentTopBar />
        <Separator className="mt-4 mb-8" />
      </div>
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        {/* <StudentLeftBar /> */}
        <div className="bg-white flex-1 rounded-md">
          <StudentSteps />
          {children}
        </div>
      </div>
     {/* </StudentContextProvider> */}
    </>
  )
}

export default layout