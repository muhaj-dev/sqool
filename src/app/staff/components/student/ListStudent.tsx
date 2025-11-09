"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import student from "../../../../data/student.json";
// import StaffSubbar from "./StaffSubbar"
import { Dialog } from "@radix-ui/react-dialog";
import StudentsCard from "./StudentsCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllStudents } from "@/utils/api/index";
import { PAGE_SIZE } from "@/constants";
// import { Separator } from "../ui/separator"

type TStudent = {
  _id: number;
  first_name: string;
  last_name: string;
  email: string;
  ID: string;
  class: string;
  phone: string;
  addmissin_date: string;
  contact: string;
};

interface ListStudentProps {
  staffId: string;
}
const ListStudent: React.FC<ListStudentProps> = ({ staffId }) => {
  const [data, setData] = useState<TStudent[]>(student);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const query = useInfiniteQuery({
    queryKey: ["staffs-students", staffId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getAllStudents(pageParam, PAGE_SIZE, searchQuery);
      console.log({ dataItem: res.data });
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
      query.data?.pages
        .flatMap((page) => page.result)
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t._id === item._id)
        ) ?? [],
    [query.data]
  );
  console.log({ students }); //TODO: expect paginated object response from server and continue

  return (
    <Dialog>
      <Separator />
      <div className="bg-white min-h-[100vh]">
        <div className="w-[98%] mx-auto py-4">
          <h3 className="text-xl font-semibold">My Students</h3>
          <div className="flex items-center justify-between my-4 "></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 ">
            {data.map((student) => (
              <StudentsCard key={student._id} item={student} />
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ListStudent;
