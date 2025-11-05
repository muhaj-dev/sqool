'use client'

import React, { useState } from 'react'
import { PaginationControls } from '@/components/PaginationControl'
const resultsData = [
  {
    session: '1st Session 2024',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '2nd Session 2034',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '3rd Session 2024',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '1st Session 2023',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '2nd Session 2023',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '3rd Session 2023',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '1st Session 2024',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '2nd Session 2034',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '3rd Session 2024',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '1st Session 2023',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '2nd Session 2023',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  {
    session: '3rd Session 2023',
    class: 'Class 5A',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    result: 'Download Result',
  },
  // Add more items if needed
]

const TestTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null) // State to manage the active dropdown
  const itemsPerPage = 6

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = resultsData.slice(indexOfFirstItem, indexOfLastItem)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Toggle dropdown visibility for specific row
  const toggleDropdown = (index: number) => {
    if (activeDropdown === index) {
      setActiveDropdown(null) // Close the dropdown if it's already open
    } else {
      setActiveDropdown(index) // Open the clicked dropdown
    }
  }

  return (
    <div className="w-full mx-auto ">
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
              <button className="bg-primary text-white px-4 py-2 ml-4 rounded-[80px]">Download Result</button>
              <div className="relative ml-6">
                <button onClick={() => toggleDropdown(index)}>
                  <span className="text-gray-500">•••</span>
                </button>
                {activeDropdown === index && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg">
                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Replace</button>
                    <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination component */}
      <PaginationControls totalPages={resultsData.length} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  )
}

export default TestTable
