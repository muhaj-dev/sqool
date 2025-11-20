"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Schoolfees from "./Schoolfees"; // Assuming this component handles all the tabs

const PaymentFee = () => {
  const [activeTab, setActiveTab] = useState<"school" | "transport" | "addition">("school"); // Active tab state
  const [showUploadButton, setShowUploadButton] = useState(false); // State to track button display
  const pathname = usePathname();

  // Check the current path and update the button display state
  useEffect(() => {
    if (pathname.startsWith("/student")) {
      setShowUploadButton(true); // Show upload button if pathname starts with /student
    } else if (pathname.startsWith("/staff")) {
      setShowUploadButton(false); // Otherwise, hide it
    }
  }, [pathname]); // Re-run this effect when the pathname changes

  // Function to switch between tabs
  const handleTabSwitch = (tab: "school" | "transport" | "addition") => {
    setActiveTab(tab);
  };

  return (
    <div className="">
      {/* Tab Buttons */}
      <div className="flex justify-between flex-wrap mt-2 gap-2 md:gap-5 border-b-2 border-[#D6DDEB]">
        <div className="space-x-3">
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === "school"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("school")}
          >
            School Fee Details
          </button>
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === "transport"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("transport")}
          >
            Transport Fee
          </button>
          <button
            className={`px-1 py-2 text-[1.125rem] font-semibold ${
              activeTab === "addition"
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleTabSwitch("addition")}
          >
            Additional Fee
          </button>
        </div>
      </div>

      {/* Tab Content Rendering */}
      <div className="py-4 px-3">
        {activeTab === "school" && <Schoolfees />}
        {activeTab === "transport" && <Schoolfees />}
        {activeTab === "addition" && <Schoolfees />}
      </div>
    </div>
  );
};

export default PaymentFee;

// Assuming the SVG for Search icon is used somewhere in the app
export const Search = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="6" stroke="#222222" />
    <path d="M20 20L17 17" stroke="#222222" strokeLinecap="round" />
  </svg>
);
