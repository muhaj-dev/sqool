"use client";

import StudentLeftBar from "@/components/student/StudentLeftBar";
import StudentSteps from "@/components/student/StudentSteps";
import StudentTopBar from "@/components/student/StudentTopBar";
import { Separator } from "@/components/ui/separator";
import StudentContextProvider from "@/contexts/student-context";
import React, { useState, useEffect } from "react";
import { useStudent } from "@/contexts/student-context";

interface PageProps {
  params: { studentId: string };
}

const Page = ({ params }: PageProps) => {
  const { studentId } = params;
  console.log("studentId:", studentId);

  const { step: Component, studentId: contextStudentId, studentData, loading, error } = useStudent();

  const resolvedStudentId = studentId || contextStudentId;
console.log(studentData)
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <StudentContextProvider studentId={resolvedStudentId}>
      <div className="flex flex-col gap-4">
        <StudentTopBar />
        <Separator className="mt-4 mb-8" />
      </div>
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        <StudentLeftBar studentId={resolvedStudentId} />
        <div className="bg-white flex-1 rounded-md">
          <StudentSteps />
          <Component studentId={resolvedStudentId} studentData={studentData} />
        </div>
      </div>
    </StudentContextProvider>
  );
};

export default Page;