"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import KidRList from "./KidRList";

// Types for results and kids
interface Result {
  session: string;
  class: string;
  description: string;
  result: string;
}

interface Kid {
  id: number;
  name: string;
  results: Result[];
}

// Dummy data for kids and their results
const kidsResultsData: Kid[] = [
  {
    id: 1,
    name: "Kid 1",
    results: [
      {
        session: "1st Session 2024",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
      {
        session: "2nd Session 2034",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
      {
        session: "3rd Session 2024",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
    ],
  },
  {
    id: 2,
    name: "Kid 2",
    results: [
      {
        session: "1st Session 2023",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
      {
        session: "2nd Session 2023",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
      {
        session: "3rd Session 2023",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
    ],
  },
  {
    id: 3,
    name: "Kid 3",
    results: [
      {
        session: "1st Session 2024",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
      {
        session: "2nd Session 2034",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
      {
        session: "3rd Session 2024",
        class: "Class 5A",
        description: "Lorem ipsum dolor sit amet consectetur.",
        result: "Download Result",
      },
    ],
  },
];

const KidsResult = () => {
  // Set the first kid as the default selection
  const [selectedKid, setSelectedKid] = useState<Kid | null>(
    kidsResultsData.length > 0 ? kidsResultsData[0] : null,
  );

  // Function to handle the kid selection
  const handleKidSelect = (kidId: number) => {
    const kid = kidsResultsData.find((k) => k.id === kidId);
    setSelectedKid(kid || null);
  };

  return (
    <div>
      {/* Search bar and Upload button */}
      <div className="flex justify-between flex-wrap gap-2">
        <Input type="text" placeholder="Search..." icon={<Search />} className="my-2 w-[250px]" />
        <Button className="px-3 bg-white border border-[#E9EBEB]">Export</Button>
      </div>

      {/* Kid selection buttons */}
      <div className="flex justify-start px-2 space-x-3 my-4">
        {kidsResultsData.map((kid) => (
          <button
            key={kid.id}
            className={`px-1 py-2 text-[.9rem] md:text-[1.125rem] font-semibold ${
              selectedKid?.id === kid.id
                ? "border-b-primary border-b-2 text-[#2E2C34]"
                : "text-[#84818A]"
            }`}
            onClick={() => handleKidSelect(kid.id)}
          >
            {kid.name}
          </button>
        ))}
      </div>

      {/* Display selected kid's results */}
      <div className="py-1 md:py-4">
        {selectedKid ? (
          <KidRList resultsData={selectedKid.results} />
        ) : (
          <p>Please select a kid to view their results.</p>
        )}
      </div>
    </div>
  );
};

export default KidsResult;

// Search icon as a functional component
export const Search = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="6" stroke="#222222" />
    <path d="M20 20L17 17" stroke="#222222" strokeLinecap="round" />
  </svg>
);
