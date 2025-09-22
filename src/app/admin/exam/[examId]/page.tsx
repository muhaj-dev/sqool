"use client";

import SelectedExam from "@/components/exams/SelectedExam";
import React from "react";

const ExamListPage = ({ params }: { params: { examId: string } }) => {



  return (
    <div>
      <SelectedExam />
    </div>
  );
};

export default ExamListPage;
