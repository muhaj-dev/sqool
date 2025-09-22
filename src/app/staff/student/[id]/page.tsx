import React from "react";
import Details from "../../components/student/Details";
import LearningActivity from "../../components/student/LearningActivity";
import SResult from "../../components/student/SResult";
import SCalender from "../../components/student/SCalender";

const page = () => {
  return (
    <div>
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 mb-6">
        <div className="tablet:col-span-1">
          <Details />
        </div>

        <div className="tablet:col-span-2 flex">
          <div className="w-full flex-1">
            <LearningActivity />
          </div>
        </div>
      </div>
      <SResult />
    <SCalender />
    </div>
  );
};

export default page;
