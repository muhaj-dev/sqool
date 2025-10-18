"use client";

import StudentLeftBar from "@/components/student/StudentLeftBar";
import StudentSteps from "@/components/student/StudentSteps";
import StudentTopBar from "@/components/student/StudentTopBar";
import { Separator } from "@/components/ui/separator";
import StudentContextProvider from "@/contexts/student-context";
import React from "react";
import { useStudent } from "@/contexts/student-context";

interface PageProps {
  params: { studentId: string };
}

// Create a component that uses the context (inside the provider)
const StudentContent = ({ studentId }: { studentId: string }) => {
  const { StepComponent, studentData, loading, error } = useStudent();

  console.log(studentData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <StudentTopBar />
        <Separator className="mt-4 mb-8" />
      </div>
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        <StudentLeftBar studentId={studentId} />
        <div className="bg-white flex-1 rounded-md">
          <StudentSteps />
          {StepComponent}
        </div>
      </div>
    </>
  );
};

const Page = ({ params }: PageProps) => {
  const { studentId } = params;
  console.log("studentId:", studentId);

  return (
    <StudentContextProvider studentId={studentId}>
      <StudentContent studentId={studentId} />
    </StudentContextProvider>
  );
};

export default Page;