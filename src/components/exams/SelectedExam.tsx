"use client"
import React from "react"
import ExamData from "../../data/exams.json"
import ExamCard from "./ExamCard"
import avatar from "../../assets/avatar.png"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronsUpDown, MoreHorizontal } from "lucide-react";


const SelectedExam = () => {
  const examData = ExamData.slice(0, 3) // Assuming we're using the first 3 items for this class

  return (
    <section className="">
      <Examination level="SSS3" data={examData} approved={false} />
    </section>
  )
}

export default SelectedExam

interface ExaminationProps {
  level: string
  approved: boolean
  data: {
    id: number
    fullname: string
    email: string
    subject: string
  }[]
}

const Examination: React.FC<ExaminationProps> = ({ level, data, approved }) => {
  return (
    <>
      <div className="flex items-center justify-between">
      <div className="flex items-center bg-white py-2 px-4 h-fit rounded-md w-fit md:w-fit border-[#B8C9C9]">
          <p className="text-muted-foreground flex-1  ">Subject</p>
          <Select>
            <SelectTrigger className=" p-0 ml-1.5 pr-3 border-0 w-fit bg-white ">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">1st</SelectItem>
              <SelectItem value="dark">2nd</SelectItem>
              <SelectItem value="system">3rd</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              filter <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
           tryr
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
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
  )
}