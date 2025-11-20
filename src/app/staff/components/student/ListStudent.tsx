"use client";
import { Dialog } from "@radix-ui/react-dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { PAGE_SIZE } from "@/constants";
import { type IStudent } from "@/types";
import { getAllStudentsStaff } from "@/utils/api/index";

import StudentsCard, { StudentsCardSkeleton } from "./StudentsCard";

interface ListStudentProps {
  staffId: string;
}
const ListStudent: React.FC<ListStudentProps> = ({ staffId }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const query = useInfiniteQuery({
    queryKey: ["staffs-students", staffId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getAllStudentsStaff(pageParam, PAGE_SIZE, searchQuery);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasNextPage) {
        return lastPage.pagination.nextPage;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!staffId,
  });

  // Flatten pages
  const students = useMemo(
    () =>
      (query.data?.pages
        .flatMap((page) => page.result)
        .filter((item, index, self) => index === self.findIndex((t) => t._id === item._id)) ??
        []) as unknown as (IStudent & {
        address: string;
        enrolmentDate: string;
      })[],
    [query.data],
  );

  return (
    <Dialog>
      <Separator />
      <div className="bg-white min-h-[100vh]">
        <div className="w-[98%] mx-auto py-4">
          <h3 className="text-xl font-semibold">My Students</h3>
          <div className="flex items-center justify-between my-4 " />
          {
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {query.isPending
                ? Array.from({ length: 6 }).map((_, i) => <StudentsCardSkeleton key={i} />)
                : students.map((student) => <StudentsCard key={student._id} item={student} />)}
            </div>
          }
        </div>
      </div>
    </Dialog>
  );
};

export default ListStudent;
