"use client";

import React from "react";
import Details, { DetailsSkeleton } from "../../components/student/Details";
import LearningActivity, {
  LearningActivitySkeleton,
} from "../../components/student/LearningActivity";
import SResult from "../../components/student/SResult";
import SCalender from "../../components/student/SCalender";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getStudentById } from "@/utils/api/index";
import { useAuthStore } from "@/zustand/authStore";
import ErrorState from "@/components/ErrorState";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const page = () => {
  const { id: studentId } = useParams();
  console.log("studentId", studentId);
  useAuthRedirect();
  const { user } = useAuthStore();
  const studentDetailsQuery = useQuery({
    queryKey: ["student-details", studentId],
    queryFn: async () => {
      const res = await getStudentById(studentId! as string);
      return res.data;
    },
    enabled: !!studentId,
    staleTime: 0,
  });

  if (studentDetailsQuery.isError) {
    return (
      <ErrorState
        error={studentDetailsQuery.error}
        description="Error occured while fetching student data."
        onRetry={studentDetailsQuery.refetch}
      />
    );
  }

  console.log({ studentDetailsQuery: studentDetailsQuery.data });

  return (
    <div>
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6 mb-6">
        <div className="tablet:col-span-1">
          {studentDetailsQuery.isPending ? (
            <DetailsSkeleton />
          ) : (
            <Details
              user={user!}
              student={studentDetailsQuery.data?.student!}
            />
          )}
        </div>

        <div className="tablet:col-span-2 flex">
          <div className="w-full flex-1">
            {studentDetailsQuery.isPending ? (
              <LearningActivitySkeleton />
            ) : (
              <LearningActivity />
            )}
          </div>
        </div>
      </div>
      {!studentDetailsQuery.isPending && (
        <>
          <SResult />
          <SCalender />
        </>
      )}
    </div>
  );
};

export default page;
