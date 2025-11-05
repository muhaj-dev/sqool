"use client"
import React from "react"
import { Separator } from "../ui/separator"
import { useStudent } from "@/contexts/student-context"
const tabs = ["Student Profile", "Study Progress", "Attendance", "Fee History"]
const StudentSteps = () => {
  const { activeIndex, updateIndex } = useStudent()
  return (
    <div className="mb-4 overflow-auto ">
      <section className=" flex items-center justify-between px-1 md:px-1 pt-4 pb-3 max-w-[fit] w-[500px]">
        {tabs.map((item, ind) => (
          <p
            onClick={() => updateIndex(ind)}
            key={ind}
            className={`cursor-pointer transition pb-2  ${
              activeIndex === ind
                ? "border-b-[2px] border-primary text-black"
                : "text-muted-foreground"
            }`}
          >
            {item}
          </p>
        ))}
      </section>
      {/* <Separator /> */}
    </div>
  );
}

export default StudentSteps
