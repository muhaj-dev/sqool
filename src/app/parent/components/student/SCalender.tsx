"use client";

import React, { useState } from "react";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const resultsData = [
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

  // Add more items if needed
];

const SCalender: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null); // State to manage the active dropdown
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resultsData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Toggle dropdown visibility for specific row
  const toggleDropdown = (index: number) => {
    if (activeDropdown === index) {
      setActiveDropdown(null); // Close the dropdown if it's already open
    } else {
      setActiveDropdown(index); // Open the clicked dropdown
    }
  };

  return (
    <div className="w-full mx-auto my-20">
      <div className="flex justify-between gap-5 items-center mb-4">
        <p className="font-bold text-xl ">Scheduls</p>
        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Feburary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex gap-3 text-white">
            <Upload /> Export
          </Button>
        </div>
      </div>
      <div className="max-w-[950px] overflow-x-auto w-full">
        <div className="grid gap-3 w-full min-w-[870px]">
          {currentItems.map((result, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 bg-[#F8F8FD] px-4 rounded-md min-w-[900px]"
            >
              <div className="flex items-center">
                <input type="checkbox" className="mr-4" />
                <div>
                  <div className="font-semibold">{result.session}</div>
                </div>
              </div>
              <div className="ml-4 w-fit px-6 ">{result.class}</div>
              <div className="ml-4">{result.description}</div>
              <button className="bg-primaryColor text-white px-4 py-2 ml-4 rounded-[80px]">
                Download Result
              </button>
              <div className="relative ml-6">
                <button onClick={() => toggleDropdown(index)}>
                  <span className="text-gray-500">•••</span>
                </button>
                {activeDropdown === index && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg">
                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Replace
                    </button>
                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination component */}
      <Pagination
        totalItems={resultsData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default SCalender;

const Upload = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.23852 14.8117C5.63734 16.3002 6.51616 17.6154 7.73867 18.5535C8.96118 19.4915 10.4591 20 12 20C13.5409 20 15.0388 19.4915 16.2613 18.5535C17.4838 17.6154 18.3627 16.3002 18.7615 14.8117"
      stroke="white"
    />
    <path
      d="M12 4L11.6877 3.60957L12 3.35969L12.3123 3.60957L12 4ZM12.5 13C12.5 13.2761 12.2761 13.5 12 13.5C11.7239 13.5 11.5 13.2761 11.5 13L12.5 13ZM6.68765 7.60957L11.6877 3.60957L12.3123 4.39043L7.31235 8.39043L6.68765 7.60957ZM12.3123 3.60957L17.3123 7.60957L16.6877 8.39043L11.6877 4.39043L12.3123 3.60957ZM12.5 4L12.5 13L11.5 13L11.5 4L12.5 4Z"
      fill="white"
    />
  </svg>
);
