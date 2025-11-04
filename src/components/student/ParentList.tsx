'use client';
import React, { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import AdminTable from '../Constant/Table/AdminTable';
import { Dialog } from '@radix-ui/react-dialog';
import { IParent, ParentPaginationResponse } from '@/types';
import { getAllParents } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from 'next/link'

// Skeleton component for parent rows
const ParentSkeleton = () => {
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
            <Skeleton className="h-6 w-16" />
          </td>
          <td className="py-5">
            <Skeleton className="h-10 w-24" />
          </td>
        </tr>
      ))}
    </>
  );
};

const ParentList = () => {
  const [parents, setParents] = useState<IParent[]>([]);
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

  const fetchParents = async (page: number = 1, limit: number = 10, searchQuery?: string) => {
    try {
      setLoading(true);
      console.log('Fetching parents - Page:', page, 'Limit:', limit, 'Search:', searchQuery);
      
      const response: ParentPaginationResponse = await getAllParents(page, limit, searchQuery);
      
      if (response.data && response.data.result) {
        setParents(response.data.result);
        
        if (response.data.pagination) {
          setPagination({
            total: typeof response.data.pagination.total === 'string' 
              ? parseInt(response.data.pagination.total) 
              : response.data.pagination.total,
            currentPage: typeof response.data.pagination.currentPage === 'string'
              ? parseInt(response.data.pagination.currentPage)
              : response.data.pagination.currentPage,
            pageSize: typeof response.data.pagination.pageSize === 'string'
              ? parseInt(response.data.pagination.pageSize)
              : response.data.pagination.pageSize || limit,
            totalPages: typeof response.data.pagination.totalPages === 'string'
              ? parseInt(response.data.pagination.totalPages)
              : response.data.pagination.totalPages,
            hasNextPage: response.data.pagination.hasNextPage,
            hasPreviousPage: response.data.pagination.hasPreviousPage,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching parents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch parents');
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
    fetchParents(1, 10, search);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    fetchParents(newPage, pagination.pageSize, search);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const RenderParentName = ({ parent }: { parent: IParent }) => {
    return (
      <div className="flex gap-4 items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/images/user.png" />
          <AvatarFallback>
            {`${parent.user?.firstName?.[0] || ''}${parent.user?.lastName?.[0] || ''}`}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[16px] font-medium text-[#3F4946]">
            {`${parent.user?.firstName || ''} ${parent.user?.lastName || ''}`}
          </p>
          {/* <p className="text-sm text-muted-foreground">{parent.user?.email || 'No email'}</p> */}
        </div>
      </div>
    );
  };

  const RenderOccupation = ({ occupation }: { occupation: string }) => {
    return <p className="text-[14px] text-[#3F4946] font-medium">{occupation || "N/A"}</p>;
  };

  const RenderChildrenCount = ({ children }: { children: any[] }) => {
    return <p className="text-[14px] text-[#3F4946] font-medium">{children?.length || 0}</p>;
  };

  const RenderStatus = ({ isActive }: { isActive: boolean }) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const RenderAction = ({ parent }: { parent: IParent }) => {
    const handleViewDetails = () => {
      router.push(`/admin/parent/${parent._id}`);
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
      label: "Parent Name",
      renderCell: (parent: IParent) => <RenderParentName parent={parent} />,
    },
    {
      key: "occupation",
      label: "Occupation",
      renderCell: (parent: IParent) => <RenderOccupation occupation={parent.occupation} />,
    },
    {
      key: "children",
      label: "Children",
      renderCell: (parent: IParent) => <RenderChildrenCount children={parent.children} />,
    },
    {
      key: "status",
      label: "Status",
      renderCell: (parent: IParent) => <RenderStatus isActive={parent.isActive} />,
    },
    {
      key: "action",
      label: "Action",
      renderCell: (parent: IParent) => <RenderAction parent={parent} />,
    },
  ];

  const sortOptions = [
    { label: "Newest First", value: "desc" },
    { label: "Oldest First", value: "asc" },
  ];

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  return (
    <Dialog>
      <section className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 flex-row my-4">
          <div className="w-full md:w-[50%]">
            <h3 className="text-xl font-bold">Parents</h3>
            <p className="text-muted-foreground w-full max-w-[490px] text-sm">
              {loading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                `Showing ${((pagination.currentPage - 1) * pagination.pageSize) + 1} - ${Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} of ${pagination.total} parents`
              )}
            </p>
          </div>

          <section className="w-fit ml-auto mb-2 flex gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search parents..."
                value={searchInput}
                onChange={handleSearch}
                className="pl-10 w-64"
                disabled={loading}
              />
            </div>
            
            
          </section>
        </div>

        <Separator />
        
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
                    <ParentSkeleton />
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
              title=""
              columns={columns}
              data={parents}
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
              onRecordClicked={(parent) => {
                console.log("Parent clicked:", parent);
              }}
            />
          )}
        </div>
      </section>
    </Dialog>
  );
};

export default ParentList;