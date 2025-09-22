"use client";
import React, { useState } from "react";
import ExamData from "../../data/exams.json";
import ExamCard from "./ExamCard";
import avatar from "../../assets/avatar.png";
import { ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";
import FilterBar from "./Filterbar";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { SchoolSession } from "./SchoolSession";

const Department = [
  "Chemistry",
  "Physics",
  "Art",
  "Engineering",
  "Mathematics",
];
const Class = ["SSS1", "SSS2", "SSS3"];
const STEPS = ["Approved", "Pending Approval", "Rejected"];

const Exam = () => {
  const [data, setData] = useState([...ExamData]);
  const SSS3 = data.slice(0, 3);
  const SSS2 = data.slice(5, 8);
  const SSS1 = data.slice(10, 13);
  const SSS3Approved = data.slice(14, 16);
  const SSS2Approved = data.slice(16, 17);
  const SSS1Approved = data.slice(17, 19);

  const [activeIndex, setActiveIndex] = useState(0);

  const renderExaminations = () => {
    switch (STEPS[activeIndex]) {
      case "Approved":
        return (
          <>
            <Examination level="SSS3" data={SSS3Approved} approved={true} />
            <Examination level="SSS2" data={SSS2Approved} approved={true} />
            <Examination level="SSS1" data={SSS1Approved} approved={true} />
          </>
        );
      case "Pending Approval":
      case "Rejected":
        return (
          <>
            <Examination level="SSS3" data={SSS3} approved={false} />
            <Examination level="SSS2" data={SSS2} approved={false} />
            <Examination level="SSS1" data={SSS1} approved={false} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section className="">
      <div
      className="flex justify-end"
      >

     <SchoolSession />
      </div>
      <FilterBar department={Department} level={Class} setData={setData} />
      <div className="flex items-center gap-8">
        {STEPS.map((item, ind) => (
          <div
            key={ind}
            className={`cursor-pointer ${
              activeIndex === ind &&
              "text-primaryColor border-b-[2px] border-b-primaryColor "
            }`}
            onClick={() => setActiveIndex(ind)}
          >
            {item}
          </div>
        ))}
      </div>
      <Separator className="mb-4 mt-0" />
      {renderExaminations()}
    </section>
  );
};

export default Exam;

const Examination = ({
  level,
  data,
  approved,
}: {
  level: string;
  approved: boolean;
  data: {
    id: number;
    fullname: string;
    email: string;
    subject: string;
  }[];
}) => {

  const router = useRouter();

  const handleViewList = () => {
    if (!approved) {
      router.push(`/admin/exam/pending/${level}`);
    } else {
      router.push(`/admin/exam/${level}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[.9rem] md:text-xl font-bold">{`${level.toUpperCase()} Exam question List`}</p>
        <div
           onClick={handleViewList}
        >
          <div className="text-sm flex items-center text-primaryColor cursor-pointer underline">
            View List <ChevronRight size={20} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {data.map((item) => (
          <ExamCard
            key={item.id}
            fullname={item.fullname}
            email={item.email}
            subject={item.subject}
            total={data.length}
            photo={avatar}
            approved={approved}
          />
        ))}
      </div>
    </>
  );
};
