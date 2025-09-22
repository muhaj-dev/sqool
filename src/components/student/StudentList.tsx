'use client';
import React, { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import AdminTable from '../Constant/Table/AdminTable';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { IStudent, StudentPaginationResponse } from '@/types';
import { getAllStudents } from '@/utils/api';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const StudentList = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [pagination, setPagination] = useState<StudentPaginationResponse['data']['pagination']>({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null,
    previousPage: null,
  });
  const router = useRouter(); // Initialize useRouter

  const fetchStudents = async (limit: number = 10, searchQuery?: string, filter?: string) => {
    try {
      setLoading(true);
      console.log('Fetching students with params:', { limit, searchQuery, filter });
      const response = await getAllStudents(limit, searchQuery, filter);
      setStudents(response.data.result);
      console.log(response.data.result);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterValue = activeIndex === 1 ? 'male' : activeIndex === 2 ? 'female' : undefined;
    fetchStudents(10, search, filterValue);
  }, [activeIndex, search]);

  const handlePageChange = (newPage: number) => {
    const filterValue = activeIndex === 1 ? 'male' : activeIndex === 2 ? 'female' : undefined;
    fetchStudents(pagination.pageSize, search, filterValue);
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages && pagination.hasNextPage) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1 && pagination.hasPreviousPage) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const filteredStudents = () => students;

  const RenderStudentName = ({ student }: { student: IStudent }) => {
    return (
      <div className="flex gap-4 items-center">
         <Avatar className="h-12 w-12">
          <AvatarImage src={student?.photo || "/images/user.png"} />
          <AvatarFallback>{`${student?.firstName[0]}${student?.lastName[0]}`}</AvatarFallback>
        </Avatar>
        <p className="text-[16px] font-medium text-[#3F4946]">{`${student?.firstName} ${student?.lastName}`}</p>
      </div>
    );
  };

  const RenderClass = ({ classInfo }: { classInfo: string }) => {
    return <p className="text-[14px] text-[#3F4946] font-medium">{classInfo}</p>;
  };

  const RenderStatus = ({ status }: { status: boolean }) => {
    return <p className="text-[14px] text-[#3F4946] font-medium">{status}</p>;
  };

  const RenderGender = ({ gender }: { gender: string }) => {
    return <p className="capitalize text-[14px] text-[#3F4946] font-medium">{gender}</p>;
  };

  const RenderAction = ({ student }: { student: IStudent }) => { // Pass student as a prop
    const handleViewDetails = () => {
      router.push(`/admin/student/${student._id}`); // Navigate to student details page
    };

    return (
      <div>
        <button
          onClick={handleViewDetails}
          className="text-[14px] border-[#E9EBEB] border-[1px] text-primaryColor font-medium py-[10px] px-[16px]"
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
      renderCell: (student: IStudent) => <RenderAction student={student} />, // Pass student to RenderAction
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

  if (loading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Dialog>
      <section className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 flex-row my-4">
          <div className="w-full md:w-[50%]">
            <h3 className="text-xl font-bold">Student</h3>
            <p className="text-muted-foreground w-full max-w-[490px] text-sm">
              Showing {filteredStudents().length} of {pagination.total} students
            </p>
          </div>

          <section className="w-fit ml-auto mb-2">
            {/* <Dialog>
              <DialogTrigger className="flex items-center text-white tex-sm rounded-md bg-primaryColor cursor-pointer py-2 px-6">
                <Plus />
                <span>Add New Student</span>
              </DialogTrigger>
              <AddNewStudentModal />
            </Dialog> */}

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
          <AdminTable
            title={tabs[activeIndex]}
            columns={columns}
            data={filteredStudents()}
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
        </div>
      </section>
    </Dialog>
  );
};

export default StudentList;

