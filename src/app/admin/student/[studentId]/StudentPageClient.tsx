"use client";

import StudentLeftBar from "@/components/student/StudentLeftBar";
import StudentSteps from "@/components/student/StudentSteps";
import StudentTopBar from "@/components/student/StudentTopBar";
import { Separator } from "@/components/ui/separator";
import StudentContextProvider from "@/contexts/student-context";
import React from "react";
import { useStudent } from "@/contexts/student-context";

const StudentContent = ({ studentId }: { studentId: string }) => {
  const { StepComponent, studentData, loading, error } = useStudent();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col gap-1">
        <StudentTopBar />
        <Separator className="mt-4 " />
      </div>
      <div className="w-full bg-white py-4 md:py-6 px-0 md:px-7">
        <div className="bg-white flex-1 rounded-md">
          <StudentSteps />
          {StepComponent}
        </div>
      </div>
    </>
  );
};

const StudentPageClient = ({ studentId }: { studentId: string }) => {
  return (
    <StudentContextProvider studentId={studentId}>
      <StudentContent studentId={studentId} />
    </StudentContextProvider>
  );
};

export default StudentPageClient;