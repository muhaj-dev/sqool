'use client';
import React, { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import AdminTable from '../Constant/Table/AdminTable';
import { Dialog } from '@radix-ui/react-dialog';
import { IStudent, StudentPaginationResponse } from '@/types';
import { getAllStudents } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from 'next/link'

const tabs = ['Student', 'Male Student', 'Female Student'];

const Steps = ({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <section className="overflow-auto">
      <section className="flex items-center gap-3 justify-between max-w-[450px] text-[.9rem]">
        {tabs.map((item, ind) => (
          <p
            onClick={() => setActiveIndex(ind)}
            key={ind}
            className={`cursor-pointer transition pb-3 w-fit ${
              activeIndex === ind
                ? 'border-b-[2px] border-primaryColor text-black'
                : 'text-muted-foreground'
            }`}
          >
            {item}
          </p>
        ))}
      </section>
      <Separator />
    </section>
  );
};

// Skeleton component for student rows
const StudentSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-200">
          <td className="px-3 py-4">
            <Skeleton className="w-4 h-4" />
          </td>
          <td className="py-5">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </td>
          <td className="py-5">
            <Skeleton className="h-4 w-20" />
          </td>
          <td className="py-5">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="py-5">
            <Skeleton className="h-10 w-24" />
          </td>
        </tr>
      ))}
    </>
  );
};

const StudentList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>(''); // Local search input state
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const router = useRouter();

  const fetchStudents = async (page: number = 1, limit: number = 10, searchQuery?: string, filter?: string) => {
    try {
      setLoading(true);
      console.log('Fetching students - Page:', page, 'Limit:', limit, 'Search:', searchQuery, 'Filter:', filter);
      
      const response: StudentPaginationResponse = await getAllStudents(page, limit, searchQuery, filter);
      
      if (response.data && response.data.result) {
        setStudents(response.data.result);
        
        if (response.data.pagination) {
          setPagination({
            total: response.data.pagination.total,
            currentPage: response.data.pagination.currentPage,
            pageSize: response.data.pagination.pageSize,
            totalPages: response.data.pagination.totalPages,
            hasNextPage: response.data.pagination.hasNextPage,
            hasPreviousPage: response.data.pagination.hasPreviousPage,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const filterValue = activeIndex === 1 ? 'male' : activeIndex === 2 ? 'female' : undefined;
    fetchStudents(1, 10, search, filterValue);
  }, [activeIndex, search]);

  const handlePageChange = (newPage: number) => {
    const filterValue = activeIndex === 1 ? 'male' : activeIndex === 2 ? 'female' : undefined;
    fetchStudents(newPage, pagination.pageSize, search, filterValue);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const RenderStudentName = ({ student }: { student: IStudent }) => {
    return (
      <div className="flex gap-4 items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={student?.photo || "/images/user.png"} />
          <AvatarFallback>{`${student?.firstName[0]}${student?.lastName[0]}`}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[16px] font-medium text-[#3F4946]">{`${student?.firstName} ${student?.lastName}`}</p>
          {/* <p className="text-sm text-muted-foreground">{student.email || 'No email'}</p> */}
        </div>
      </div>
    );
  };

  const RenderClass = ({ classInfo }: { classInfo: string }) => {
    return <p className="text-[14px] text-[#3F4946] font-medium mx-4">{classInfo}</p>;
  };

  const RenderGender = ({ gender }: { gender: string }) => {
    return <p className="capitalize text-[14px] text-[#3F4946] font-medium">{gender}</p>;
  };

  const RenderAction = ({ student }: { student: IStudent }) => {
    const handleViewDetails = () => {
      router.push(`/admin/student/${student._id}`);
    };

    return (
      <div>
        <button
          onClick={handleViewDetails}
          className="text-[14px] border-[#E9EBEB] border-[1px] text-primaryColor font-medium py-[10px] px-[16px] rounded hover:bg-primaryColor hover:text-white transition-colors"
        >
          View Details
        </button>
      </div>
    );
  };

  const columns = [
    {
      key: "name",
      label: "Student name",
      renderCell: (student: IStudent) => <RenderStudentName student={student} />,
    },
    {
      key: "class",
      label: "Class",
      renderCell: (student: IStudent) => <RenderClass classInfo={student.class.className || "N/A"} />,
    },
    {
      key: "gender",
      label: "Gender",
      renderCell: (student: IStudent) => <RenderGender gender={student.gender || "N/A"} />,
    },
    {
      key: "action",
      label: "Action",
      renderCell: (student: IStudent) => <RenderAction student={student} />,
    },
  ];

  const sortOptions = [
    { label: "Newest First", value: "desc" },
    { label: "Oldest First", value: "asc" },
  ];

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  return (
    <Dialog>
      <section className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 flex-row my-4">
          <div className="w-full md:w-[50%]">
            <h3 className="text-xl font-bold">Student</h3>
            <p className="text-muted-foreground w-full max-w-[490px] text-sm">
              {loading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                `Showing ${((pagination.currentPage - 1) * pagination.pageSize) + 1} - ${Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} of ${pagination.total} students`
              )}
            </p>
          </div>

          <section className="w-fit ml-auto mb-2 flex gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchInput}
                onChange={handleSearch}
                className="pl-10 w-64"
                disabled={loading}
              />
            </div>
            
            <Link 
              href="/admin/student/add"
              className="flex items-center text-white tex-sm rounded-md bg-primaryColor cursor-pointer hover:bg-white hover:text-primaryColor border-[1px] border-primaryColor py-2 px-6 transition-all"
            >
              Add New Student
            </Link>
          </section>
        </div>

        <Steps activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        
        <div className="bg-white p-0 md:p-4 rounded-md">
          {loading ? (
            <div className="bg-white relative w-full font-inter px-6 py-4">
              <Skeleton className="h-7 w-32 mb-8" />
              <div className="overflow-x-auto bg-white">
                <table className="w-full max-w-[1000px] text-sm text-left text-gray-500">
                  <thead className="text-xs h-[70px] capitalize bg-[#F8F8FD] text-[#171D1B]">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-[14px] font-medium">
                        <Skeleton className="w-4 h-4" />
                      </th>
                      {columns.map((col) => (
                        <th key={col.key} scope="col" className="py-3 text-[14px] font-medium">
                          <Skeleton className="h-4 w-24" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <StudentSkeleton />
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-6">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-8" />
                  <Skeleton className="h-10 w-8" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          ) : (
            <AdminTable
              title={tabs[activeIndex]}
              columns={columns}
              data={students}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              pagination={pagination}
              showItemCheck={true}
              onPageChange={handlePageChange}
              sortOptions={sortOptions}
              statusOptions={statusOptions}
              onSort={(sortValue) => {
                console.log("Sort by:", sortValue);
              }}
              onStatusFilterChange={(status) => {
                console.log("Filter by:", status);
              }}
              onRecordClicked={(student) => {
                console.log("Student clicked:", student);
              }}
            />
          )}
        </div>
      </section>
    </Dialog>
  );
};

export default StudentList;