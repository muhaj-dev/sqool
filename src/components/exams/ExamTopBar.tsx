import React from "react"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ExamTopBar = () => {
  return (
    <section className="my-4">
      <div className="flex items-center justify-between flex-wrap flex-row ">
      <div className="w-full md:w-[50%]">
        <h3 className="text-xl font-bold">
        Examination
        </h3>
        <p className="text-muted-foreground w-full  max-w-[490px] text-sm">
          Showing your Account metrics for July 19, 2021 - July 25, 2021
        </p>
      </div>
   
      <div className="flex items-center bg-white py-2 px-4 h-fit rounded-md w-fit md:w-fit">
          <p className="text-muted-foreground flex-1  ">What term:</p>
          <Select>
            <SelectTrigger className=" p-0 ml-1.5 pr-3 border-0 w-fit bg-white ">
              <SelectValue placeholder="current term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">1st</SelectItem>
              <SelectItem value="dark">2nd</SelectItem>
              <SelectItem value="system">3rd</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}

export default ExamTopBar
