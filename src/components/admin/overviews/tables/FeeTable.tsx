"use client";
import { MoveDown } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import User from "../../../../assets/User.png";

interface Student {
  name: string;
  class: string;
  photo: StaticImageData;
}
interface TableRowProps {
  id: string;
  student: Student;
  feeType: string;
  feeAmount: string;
  status: string;
}
const payments: TableRowProps[] = [
  {
    id: "INV001",
    student: {
      name: "Melitensis Roselia",
      class: "SS3 B",
      photo: User,
    },
    feeType: "First term",
    feeAmount: "25,000",
    status: "Outstanding",
  },
  {
    id: "INV002",
    student: {
      name: "Barakat Johnson",
      class: "SS3 B",
      photo: User,
    },
    feeType: "First term",
    feeAmount: "25,000",
    status: "Outstanding",
  },
  {
    id: "INV003",
    student: {
      name: "Zaphira Condolense",
      class: "SS3 B",
      photo: User,
    },
    feeType: "First term",
    feeAmount: "25,000",
    status: "Outstanding",
  },
  {
    id: "INV004",
    student: {
      name: "Kyne Wessem",
      class: "SS3 B",
      photo: User,
    },
    feeType: "First term",
    feeAmount: "25,000",
    status: "Outstanding",
  },
  {
    id: "INV005",
    student: {
      name: "Adedas Blessed",
      class: "SS3 B",
      photo: User,
    },
    feeType: "First term",
    feeAmount: "25,000",
    status: "Outstanding",
  },
];

export function FeeTable() {
  const [data, setData] = useState<TableRowProps[] | []>(payments);

  const sortData = (key: keyof TableRowProps) => {
    // const sortedData = [...data].sort((a, b) => {
    //   if (a[key] < b[key]) return -1
    //   if (a[key] > b[key]) return 1
    //   return 0

    // Sorting the items based on the 'name' property
    const sortedData = [...data]
      .slice()
      .sort((a, b) => a.student.name.localeCompare(b.student.name));
    console.log(sortData);
    setData(sortedData);
  };

  return (
    <Table>
      <TableCaption className="text-left text-lg text-black">Outstanding Fee</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead className="flex items-center cursor-pointer" onClick={() => sortData("id")}>
            <p>Name</p> <MoveDown className="h-4" />
          </TableHead>
          <TableHead>Fee Type</TableHead>
          <TableHead>Fee Amount</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((person) => (
          <TableRow key={person.id}>
            <TableCell className="font-medium">{person.id}</TableCell>
            <TableCell className="flex items-center gap-4">
              <Image src={person.student.photo} alt="" />
              <div>
                <p>{person.student.name}</p>
                <p>
                  <span className="text-muted-foreground pr-1">Class</span>
                  {person.student.class}
                </p>
              </div>
            </TableCell>
            <TableCell>{person.feeType}</TableCell>
            <TableCell>{person.feeAmount}</TableCell>
            <TableCell className="text-right text-[#FC3400] ">
              <span className="bg-[rgba(252,52,0,0.10)] py-[10px] px-6 rounded-md">
                {person.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
