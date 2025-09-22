'use client'

import React, { useState } from "react";

import LeftBar from "@/components/staff/LeftBar";
import Staffbar from "./components/staff/Staffbar";
import AgentProfile from "./components/staff/AgentProfile";
import PersonalInfo from "./components/staff/PersonalInfo";
import Noticeboard from "./components/staff/Noticeboard";

const Page = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState<boolean>(true);

  const togglePersonalInfo = () => {
    setShowPersonalInfo(!showPersonalInfo);
  };

  return (
    <div>
      <Staffbar />
      <section className="flex flex-wrap flex-row justify-between gap-8 min-[850px]:gap-[1%] ">
        <div className="bg-white h-fit w-full min-[850px]:w-[48%] min-[1125px]:w-[30%]">
          <AgentProfile togglePersonalInfo={togglePersonalInfo} showPersonalInfo={showPersonalInfo} />
        </div>
        {showPersonalInfo && (
          <div className={`bg-white h-fit w-full min-[850px]:w-[48%] min-[1125px]:w-[38%] transition-all duration-500 ease-in-out 
           ${showPersonalInfo ? 'block' : 'hidden'} 
          `}>
            <PersonalInfo />
          </div>
        )}
        <div className="bg-white h-fit w-full min-[850px]:w-[48%] min-[1125px]:w-[30%]">
          <Noticeboard />
        </div>
      </section>
    </div>
  );
};

export default Page;
