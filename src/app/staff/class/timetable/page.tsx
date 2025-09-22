"use client";

import React, { useState } from "react";

import Timetablebar from "../../components/class/timetable/Timetablebar";
import { UploadTimetable } from "../../components/class/timetable/UploadTimetable";
import { TimeTable } from "@/components/staff/tables/timetable";
import Tabletime from "../../components/class/timetable/Tabletime";
import { StaffTimeTable } from "../../components/class/timetable/StaffTimeTale";
import { DownloadTimeTable } from "../../components/class/timetable/DownloadTimeTable";
import { TimetableView } from "@/types";
// Define a type for the different views
// type TimetableView = 'result' | 'upload' | 'download';

const Page = () => {
  const [currentView, setCurrentView] = useState<TimetableView>("result");

  const renderCurrentView = () => {
    switch (currentView) {
      case "result":
        return <StaffTimeTable toggleView={setCurrentView} />;
      case "upload":
        return <UploadTimetable toggleView={setCurrentView} />;
      case "download":
        return <DownloadTimeTable toggleView={setCurrentView} />;
    }
  };

  return (
    <div>
      <Timetablebar />
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Page;