import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";

interface AdminTableProps {
  title?: string;
  columns: ColumnDef[];
  data: any[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pagination: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    currentPage: number;
    totalPages: number;
  };
  showFilter?: boolean;
  showSorting?: boolean;
  showPagination?: boolean;
  showItemCheck?: boolean;
  onPageChange?: (page: number) => void;
  onRecordClicked?: (student: any) => void;
  sortOptions?: { label: string; value: string }[];
  statusOptions?: { label: string; value: string }[];
  onSort?: (sortValue: string) => void;
  onStatusFilterChange?: (status: string) => void;
}

interface ColumnDef {
  key: string;
  label: string;
  renderCell?: (item: any) => React.ReactNode;
  width?: string;
}

const AdminTable = ({
  title = "Students",
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pagination = {
    hasPreviousPage: false,
    hasNextPage: false,
    currentPage: 1,
    totalPages: 1,
  },
  showFilter = true,
  showSorting = true,
  showPagination = true,
  showItemCheck = false,
  onPageChange = () => {},
  onRecordClicked = () => {},
  sortOptions = [],
  statusOptions = [],
  onSort = () => {},
  onStatusFilterChange = () => {},
}: AdminTableProps) => {
  const [selectedLabel, setSelectedLabel] = useState("All");
  const [selectedLabelDate, setSelectedLabelDate] = useState("Date");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialCheckedState = data.reduce(
      (acc, item) => {
        acc[item._id || ""] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setCheckedItems(initialCheckedState);
  }, [data]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    e.stopPropagation();
    setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const allChecked = Object.values(checkedItems).every(Boolean);
    const newCheckedItems = data.reduce(
      (acc, item) => {
        acc[item._id || ""] = !allChecked;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setCheckedItems(newCheckedItems);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && pagination.hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && pagination.hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const defaultRenderCell = (item: any, key: string): React.ReactNode => {
    const value = item[key as keyof any];
    if (typeof value === "object" && value !== null) {
      if (key === "parent") {
        return `${item.parent.userId.firstName} ${item.parent.userId.lastName} (Active: ${item.parent.isActive})`;
      } else if (key === "class") {
        return item.class.className || "N/A";
      }
      return JSON.stringify(value);
    }
    return value ?? "N/A";
  };

  return (
    <div className="bg-white relative w-full font-inter px-6 py-4">
      <p className="font-medium text-[22px]">{title}</p>

      <div className="flex flex-wrap justify-between ml-auto w-fit gap-4 mt-0 md:mt-4 mb-8">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex gap-2 flex-wrap items-center">
            {showFilter && statusOptions.length > 0 ? (
              <div className="flex gap-3">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-md">
                      Filter by: {selectedLabel}
                      <RiArrowDownSFill className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        {statusOptions?.map((option, idx) => (
                          <Menu.Item key={idx}>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  onStatusFilterChange(option.value);
                                  setSelectedLabel(option.label);
                                }}
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                              >
                                {option.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : null}

            {showSorting && sortOptions.length > 0 ? (
              <div className="flex gap-3">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-md">
                      Sort by: {selectedLabelDate}
                      <RiArrowDownSFill className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        {sortOptions?.map((option, idx) => (
                          <Menu.Item key={idx}>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  onSort(option.value);
                                  setSelectedLabelDate(option.label);
                                }}
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                              >
                                {option.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="w-full max-w-[1000px] text-sm text-left text-gray-500">
          <thead className="text-xs h-[70px] capitalize bg-[#F8F8FD] text-[#171D1B]">
            <tr>
              {showItemCheck ? (
                <th
                  scope="col"
                  className="px-3 py-3 text-[14px] font-medium"
                  style={{ width: "5%" }}
                >
                  <input
                    checked={Object.values(checkedItems).every(Boolean)}
                    onChange={handleToggleAll}
                    type="checkbox"
                    className="w-[18px] h-[18px] accent-[#006b5e]"
                  />
                </th>
              ) : null}
              {columns?.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`py-3 text-[14px] font-medium ${col.width ? `w-[${col.width}]` : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((student) => (
              <tr
                key={student._id}
                className="hover:bg-[#F8F8FD] cursor-pointer border-b border-gray-200"
                onClick={() => onRecordClicked(student)}
              >
                {showItemCheck ? (
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] accent-[#006b5e]"
                      checked={checkedItems[student._id] || false}
                      onChange={(e) => handleCheckboxChange(e, student._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                ) : null}
                {columns.map((col) => (
                  <td key={col.key} className="py-5">
                    {col.renderCell ? col.renderCell(student) : defaultRenderCell(student, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 ? (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">
              Showing {data.length} of {totalItems} items (Page {currentPage} of {totalPages})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              disabled={!pagination.hasPreviousPage}
              onClick={handlePrevPage}
            >
              Previous
            </button>

            {/* Page numbers */}
            {generatePageNumbers().map((page) => (
              <button
                key={page}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  page === currentPage
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-3 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              disabled={!pagination.hasNextPage}
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminTable;
