"use client";
import { useState } from "react";

import { type StaffResult, type StaffSchedule } from "@/types";

import { Separator } from "../ui/separator";
import TeacherSettings from "./TeacherSettings";
import { TeacherTimeTable } from "./TeacherTimeTable";
import TeacherProfile from "./TecherProfile";

const tabs = ["Teacher profile", "Timetable", "Setting"] as const;

type TabIndex = 0 | 1 | 2 | 3;

interface StaffContentProps {
  activeIndex: TabIndex;
  staffId: string;
  staff: StaffResult | null;
  staffSchedules: StaffSchedule[];
  refreshStaff?: () => Promise<void>; // ✅ Add refreshStaff prop
}

interface StaffStepsProps {
  staffId: string;
  staff: StaffResult | null;
  staffSchedules: StaffSchedule[];
  refreshStaff?: () => Promise<void>; // ✅ Add refreshStaff prop
}

const StaffSteps = ({ staffId, staff, staffSchedules, refreshStaff }: StaffStepsProps) => {
  const [activeIndex, setActiveIndex] = useState<TabIndex>(0);

  const StaffContent = ({
    activeIndex,
    staffId,
    staff,
    staffSchedules,
    refreshStaff,
  }: StaffContentProps) => {
    switch (activeIndex) {
      case 0:
        return <TeacherProfile staffId={staffId} staff={staff} />;
      case 1:
        return <TeacherTimeTable staffId={staffId} staffSchedules={staffSchedules} />;
      case 2:
        return <TeacherSettings staffId={staffId} staff={staff} refreshStaff={refreshStaff} />; // ✅ Pass refreshStaff
      default:
        return null;
    }
  };

  const handleTabClick = (index: number) => {
    if (index >= 0 && index <= 3) {
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
              activeIndex === ind ? "border-b-2 border-primary text-black" : "text-muted-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="p-4">
        <StaffContent
          activeIndex={activeIndex}
          staffId={staffId}
          staff={staff}
          staffSchedules={staffSchedules}
          refreshStaff={refreshStaff} // ✅ Pass the refresh function
        />
      </div>
    </div>
  );
};

export default StaffSteps;
