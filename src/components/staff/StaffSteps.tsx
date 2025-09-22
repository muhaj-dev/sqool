// src/components/staff/StaffSteps.tsx
"use client";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import Review from "./Review";
import TeacherSettings from "./TeacherSettings";
import TeacherProfile from "./TecherProfile";
import { LessonBook } from "./LessonBook";
import { TeacherTimeTable } from "./TeacherTimeTable";
import { StaffResult } from "@/types";

const tabs = [
  "Teacher profile",
  "Lesson books",
  "Timetable",
  "Reviews",
  "Setting",
] as const;

type TabIndex = 0 | 1 | 2 | 3 | 4;

interface StaffContentProps {
  activeIndex: TabIndex;
  staffId: string;
  staff: StaffResult | null; // Add staff prop
}

interface StaffStepsProps {
  staffId: string;
  staff: StaffResult | null; // Add staff prop
}

const StaffSteps = ({ staffId, staff }: StaffStepsProps) => {
  const [activeIndex, setActiveIndex] = useState<TabIndex>(0);

  const StaffContent = ({ activeIndex, staffId, staff }: StaffContentProps) => {
    switch (activeIndex) {
      case 0:
        return <TeacherProfile staffId={staffId} staff={staff} />;
      case 1:
        return <LessonBook staffId={staffId} />;
      case 2:
        return <TeacherTimeTable staffId={staffId} />;
      case 3:
        return <Review staffId={staffId} />;
      case 4:
        return <TeacherSettings staffId={staffId} />;
      default:
        return null;
    }
  };

  const handleTabClick = (index: number) => {
    if (index >= 0 && index <= 4) {
      setActiveIndex(index as TabIndex);
    }
  };

  return (
    <div className="w-full">
      <div className="flex space-x-4 mb-4 pt-3 px-3">
        {tabs.map((item, ind) => (
          <button
            key={ind}
            onClick={() => handleTabClick(ind)}
            className={`cursor-pointer transition pb-2 ${
              activeIndex === ind
                ? "border-b-2 border-primaryColor text-black"
                : "text-muted-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="p-4">
        <StaffContent activeIndex={activeIndex} staffId={staffId} staff={staff} />
      </div>
    </div>
  );
};

export default StaffSteps;
