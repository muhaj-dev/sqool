"use client";

import React, { useState } from "react";
import Details from "./Details";



  
  const KidsDetails = () => {
  const [activeTab, setActiveTab] = useState<"kid1" | "kid2">("kid1"); // Manage which tab is active

  // Function to switch between tabs
  const handleTabSwitch = (tab: "kid1" | "kid2") => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      <div className="flex justify-between gap-5 border-b-2  border-[#D6DDEB] ">
        <div className="space-x-3">
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === "kid1"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("kid1")}
          >
            Kid1
          </button>
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === "kid2"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("kid2")}
          >
            Kid2
          </button>
        </div>
      </div>

      <div className="py-4 ">
        {activeTab === "kid1" && <Details />}
        {activeTab === "kid2" && <Details />}
      </div>
    </div>
  );
};

export default KidsDetails;

export const Search = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="6" stroke="#222222" />
    <path d="M20 20L17 17" stroke="#222222" strokeLinecap="round" />
  </svg>
);
