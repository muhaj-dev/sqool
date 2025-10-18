import React, { Fragment, useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import { RiArrowDownSFill } from "react-icons/ri";
import { IParent, IStudent } from "@/types";

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
  renderCell?: (item: any) => React.ReactNode; // Explicitly type item as any
  width?: string;
}

const AdminTable = ({
  title = "Students",
  columns = [],
  data = [],
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pagination = { hasPreviousPage: false, hasNextPage: false },
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
    const initialCheckedState = data.reduce((acc, item) => {
      acc[item._id || ""] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setCheckedItems(initialCheckedState);
  }, [data]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    e.stopPropagation();
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const allChecked = Object.values(checkedItems).every(Boolean);
    const newCheckedItems = data.reduce((acc, item) => {
      acc[item._id || ""] = !allChecked;
      return acc;
    }, {} as Record<string, boolean>);
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

  // Default render function for cases where renderCell is not provided
  const defaultRenderCell = (item: any, key: string): React.ReactNode => {
    const value = item[key as keyof any];
    if (typeof value === "object" && value !== null) {
      // Handle nested objects (e.g., parent, class) by extracting a string representation
      if (key === "parent") {
        return `${item.parent.userId.firstName} ${item.parent.userId.lastName} (Active: ${item.parent.isActive})`;
      } else if (key === "class") {
        return item.class.className || "N/A";
      }
      return JSON.stringify(value); // Fallback for other objects
    }
    return value ?? "N/A"; // Handle undefined/null with a default string
  };

  return (
    <div className="bg-white relative w-full font-inter px-6 py-4">
        <p className="font-medium text-[22px]">{title}</p>
      <div className="flex flex-wrap justify-between ml-auto w-fit gap-4 mt-0 md:mt-4 mb-8">

        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex gap-2 flex-wrap items-center">
            {showFilter && statusOptions.length > 0 && (
              <div className="flex gap-3">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 bg-white text-sm font-medium text-gray-700">
                      Filter by: {selectedLabel}
                      <RiArrowDownSFill
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
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
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {statusOptions?.map((option, idx) => (
                          <Menu.Item key={idx}>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onStatusFilterChange(option.value);
                                  setSelectedLabel(option.label);
                                }}
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                {option.label}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}

            {showSorting && sortOptions.length > 0 && (
              <div className="flex gap-3">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 bg-white text-sm font-medium text-gray-700">
                      Sort by: {selectedLabelDate}
                      <RiArrowDownSFill
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
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
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {sortOptions?.map((option, idx) => (
                          <Menu.Item key={idx}>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onSort(option.value);
                                  setSelectedLabelDate(option.label);
                                }}
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                {option.label}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white ">
        <table className="w-full max-w-[1000px] text-sm text-left text-gray-500">
          <thead className="text-xs h-[70px] capitalize bg-[#F8F8FD] text-[#171D1B]">
            <tr>
              {showItemCheck && (
                  <th scope="col" className="px-3 py-3 text-[14px] font-medium" style={{ width: "5%" }}>
                  <input
                    checked={Object.values(checkedItems).every(Boolean)}
                    onChange={handleToggleAll}
                    type="checkbox"
                    className="w-[18px] h-[18px] accent-[#006b5e]"
                  />
                </th>
              )}
              {columns?.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`py-3 text-[14px] font-medium ${
                    col.width ? `w-[${col.width}]` : ""
                  }`}
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
                className="hover:bg-[#F8F8FD] cursor-pointer"
                onClick={() => onRecordClicked(student)}
              >
                {showItemCheck && (
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] accent-[#006b5e]"
                      checked={checkedItems[student._id] || false}
                      onChange={(e) => handleCheckboxChange(e, student._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className=" py-5">
                    {col.renderCell ? col.renderCell(student) : defaultRenderCell(student, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-muted-foreground">
              Showing {data.length} of {totalItems} students
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50"
              disabled={!pagination.hasPreviousPage}
              onClick={handlePrevPage}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 text-sm rounded-md border border-gray-300 disabled:opacity-50"
              disabled={!pagination.hasNextPage}
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;