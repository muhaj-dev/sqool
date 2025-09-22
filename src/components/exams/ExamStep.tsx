"use client"
import React, { useState } from "react"
import { Separator } from "../ui/separator"
import { useSetting } from "@/contexts/setting-context"
const tabs = ["Pending Approval", "Approved"]
const ExamSteps = () => {
  const { activeIndex, updateIndex } = useSetting()
  return (
    <div className="mb-4">
      <section className=" flex items-center justify-between max-w-[60%]">
        {tabs.map((item, ind) => (
          <p
            onClick={() => updateIndex(ind)}
            key={ind}
            className={`cursor-pointer transition  ${
              activeIndex === ind
                ? "border-b-[2px] border-primaryColor text-black"
                : "text-muted-foreground"
            }`}
          >
            {item}
          </p>
        ))}
      </section>
      <Separator />
    </div>
  )
}

export default ExamSteps
