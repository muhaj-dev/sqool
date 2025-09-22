"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClassManagement from "../componenets/ClassManagement";
import { Class, Subject, Teacher } from "../componenets/types";

// Sample data
const initialTeachers: Teacher[] = [
  {
    id: "t1",
    firstName: "Adunni",
    lastName: "Okafor",
    email: "adunni.okafor@school.edu.ng",
    phone: "+234 801 234 5678",
    specialization: "Mathematics",
    qualification: "B.Ed Mathematics",
  },
  {
    id: "t2",
    firstName: "Emeka",
    lastName: "Chukwu",
    email: "emeka.chukwu@school.edu.ng",
    phone: "+234 802 345 6789",
    specialization: "Physics",
    qualification: "M.Sc Physics",
  },
  {
    id: "t3",
    firstName: "Fatima",
    lastName: "Abdullahi",
    email: "fatima.abdullahi@school.edu.ng",
    phone: "+234 803 456 7890",
    specialization: "English Language",
    qualification: "B.A English",
  },
  {
    id: "t4",
    firstName: "Kemi",
    lastName: "Adebayo",
    email: "kemi.adebayo@school.edu.ng",
    phone: "+234 804 567 8901",
    specialization: "Biology",
    qualification: "B.Sc Biology",
  },
];

const initialSubjects: Subject[] = [
  // Basic Education Subjects
  {
    id: "s1",
    name: "Mathematics",
    code: "MTH101",
    description: "Basic Mathematics",
    credits: 4,
    level: "basic",
    streams: [],
  },
  {
    id: "s2",
    name: "English Language",
    code: "ENG101",
    description: "English Language and Literature",
    credits: 4,
    level: "basic",
    streams: [],
  },
  {
    id: "s3",
    name: "Basic Science",
    code: "BSC101",
    description: "Integrated Science",
    credits: 3,
    level: "basic",
    streams: [],
  },
  // Secondary Science Subjects
  {
    id: "s4",
    name: "Physics",
    code: "PHY201",
    description: "Advanced Physics",
    credits: 4,
    level: "secondary",
    streams: ["science"],
  },
  {
    id: "s5",
    name: "Chemistry",
    code: "CHM201",
    description: "Advanced Chemistry",
    credits: 4,
    level: "secondary",
    streams: ["science"],
  },
  {
    id: "s6",
    name: "Biology",
    code: "BIO201",
    description: "Advanced Biology",
    credits: 4,
    level: "secondary",
    streams: ["science"],
  },
  // Secondary Arts Subjects
  {
    id: "s7",
    name: "Literature",
    code: "LIT201",
    description: "Literature in English",
    credits: 3,
    level: "secondary",
    streams: ["arts"],
  },
  {
    id: "s8",
    name: "Government",
    code: "GOV201",
    description: "Government Studies",
    credits: 3,
    level: "secondary",
    streams: ["arts", "commerce"],
  },
  // Secondary Commerce Subjects
  {
    id: "s9",
    name: "Economics",
    code: "ECO201",
    description: "Economics",
    credits: 3,
    level: "secondary",
    streams: ["commerce"],
  },
  {
    id: "s10",
    name: "Accounting",
    code: "ACC201",
    description: "Financial Accounting",
    credits: 3,
    level: "secondary",
    streams: ["commerce"],
  },
];

// const initialClasses: Class[] = [
//   {
//     id: "c1",
//     name: "JSS 1A",
//     level: "basic",
//     description: "Junior Secondary School 1A",
//     capacity: 30,
//     classTeacher: initialTeachers[0],
//     subjects: [
//       {
//         id: "sa1",
//         subject: initialSubjects[0], // Mathematics
//         teacher: initialTeachers[0],
//         classId: "c1",
//       },
//       {
//         id: "sa2",
//         subject: initialSubjects[1], // English
//         teacher: initialTeachers[2],
//         classId: "c1",
//       },
//     ],
//     schedules: [],
//     resources: [
//       {
//         id: "r1",
//         title: "JSS 1 Mathematics Syllabus",
//         description: "Complete syllabus for JSS 1 Mathematics",
//         url: "https://example.com/jss1-math-syllabus.pdf",
//         type: "syllabus",
//       },
//     ],
//     createdAt: "2024-01-15",
//   },
// ];

const Page = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const classId = params.clasId as string; // <-- get the classId from the route

  // You can now use classId as needed, e.g., pass to ClassManagement or fetch data

  return (
    <>
      <ClassManagement
      classId={classId}
        initialTeachers={initialTeachers}
        initialSubjects={initialSubjects}
        // initialClasses={initialClasses}
        // You can also pass classId as a prop if needed
        // classId={classId}
      />
    </>
  );
};

export default Page;