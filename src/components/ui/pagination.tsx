// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  handlePageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, handlePageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-between items-center py-4">
      <select className="border border-gray-300 px-2 py-1 rounded">
        <option value="10">View 10</option>
        <option value="20">View 20</option>
      </select>
      <div className="flex space-x-2">
        {Array(totalPages)
          .fill(0)
          .map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-gray-200' : ''}`}
            >
              {index + 1}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Pagination;
