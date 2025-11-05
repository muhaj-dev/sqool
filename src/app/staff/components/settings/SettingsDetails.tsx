"use client";

import React, { useState } from "react";
import PersonalDetails from "./PersonalDetails";
import Password from "./Password";



  const SettingsDetails = () => {
  const [activeTab, setActiveTab] = useState<"personalDetails" | "password">("personalDetails"); // Manage which tab is active

  // Function to switch between tabs
  const handleTabSwitch = (tab: "personalDetails" | "password") => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      <div className="flex justify-between gap-5 border-b-2  border-[#D6DDEB] ">
        <div className="space-x-3">
          <button
            className={`px-1 py-2 text-[.8rem] md:text-[1.1rem] font-semibold ${
              activeTab === "personalDetails"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("personalDetails")}
          >
            Personal Details
          </button>
          <button
            className={`px-1 py-2 text-[.8rem] md:text-[1.1rem] font-semibold ${
              activeTab === "password"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("password")}
          >
            Password
          </button>
        </div>
      </div>

      <div className="py-0 md:py-4 ">
        {activeTab === "personalDetails" && <PersonalDetails />}
        {activeTab === "password" && <Password />}
      </div>
    </div>
  );
};

export default SettingsDetails;

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
