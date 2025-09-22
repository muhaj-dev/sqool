"use client"
import React, { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ListFilter } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import student from "../../../../data/student.json"
// import StaffSubbar from "./StaffSubbar"
import { Dialog } from "@radix-ui/react-dialog"
import StudentsCard from "./StudentsCard"
// import { Separator } from "../ui/separator"

type TStudent = {
  _id: number
  first_name: string
  last_name: string
  email: string
  ID: string
  class: string
  phone: string
  addmissin_date: string
  contact: string
}
const ListStudent = () => {
  const [data, setData] = useState<TStudent[]>(student)

  return (
    <Dialog>
      <Separator />
      <div className="bg-white min-h-[100vh]">
        <div className="w-[98%] mx-auto py-4">
          <h3 className="text-xl font-semibold">My Students</h3>
          <div className="flex items-center justify-between my-4 ">
          
           
          </div>
          <div className="grid grid-cols-3 gap-4 ">
            {data.map(student => (
              <StudentsCard key={student._id} item={student} />
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ListStudent
