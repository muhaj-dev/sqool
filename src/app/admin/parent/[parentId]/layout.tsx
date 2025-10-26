'use client'


import React, { ReactNode } from "react"

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
     {/* <StudentContextProvider> */}
      
      <div className="w-full  px-0 md:px-4">
        {/* <StudentLeftBar /> */}
        <div className=" flex-1 rounded-md">
          {/* <StudentSteps /> */}
          {children}
        </div>
      </div>
     {/* </StudentContextProvider> */}
    </>
  )
}

export default layout