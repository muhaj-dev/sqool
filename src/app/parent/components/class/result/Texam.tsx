"use client";

import React, { useState } from "react";
import ExameTable from "./Exam";
import TestTable from "./Test";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface TexamProps {
    toggleTexam: () => void;
  }
  
  const Texam: React.FC<TexamProps> = ({ toggleTexam }) => {
  const [activeTab, setActiveTab] = useState<"exam" | "test">("exam"); // Manage which tab is active

  // Function to switch between tabs
  const handleTabSwitch = (tab: "exam" | "test") => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      <div className="flex justify-between">
        <Input
          type="text"
          placeholder="Search..."
          icon={<Search />} // Icon passed as prop
          className="my-2 w-[250px]"
        />
        <Button
          //  onClick={toggleTexam}
          className=" px-3 text-white"
        >
          Upload New
        </Button>
      </div>

      <div className="flex justify-between gap-5 border-b-2  border-[#D6DDEB] ">
        <div className="space-x-3">
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === "exam"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("exam")}
          >
            Exam
          </button>
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === "test"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("test")}
          >
            Test
          </button>
        </div>
        <div className="mt-2.5">
          <select className="text-[#828282] px-2 rounded">
            <option value="10">Session</option>
            <option value="20">1st</option>
            <option value="20">2nd</option>
            <option value="20">3rd</option>
          </select>
          <select className="text-[#828282] px-2 rounded">
            <option value="10">Type</option>
            <option value="20">View 20</option>
          </select>
        </div>
      </div>

      <div className="py-4 ">
        {activeTab === "exam" && <ExameTable />}
        {activeTab === "test" && <TestTable />}
      </div>
    </div>
  );
};

export default Texam;

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
