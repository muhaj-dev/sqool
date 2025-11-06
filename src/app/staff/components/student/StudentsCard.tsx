import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { Separator } from "../ui/separator"
import { Phone } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

type TStudent = {
  item: {
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
}
const StudentsCard = ({ item }: TStudent) => {
  return (
    <Link
      href="/staff/students/1"
      className="bg-white text-[.9rem] border border-[#EBEAED] rounded-md p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition "
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p>{`${item.first_name} ${item.last_name}`} </p>
            <p className="text-muted-foreground max-w-40 text-[14px] break-words ">{item.email}</p>
          </div>
        </div>
        <span className=" text-[#5542F6] text-[12px] rounded-sm px-4 py-2 bg-[#5542F61A]">View More</span>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">ID</p>
          <p>{item.ID}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">class</p>
          <p>{item.class}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">ADDMISSION DATE</p>
          <p className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-600 rounded-sm"></span> <span>{item.addmissin_date}</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">CONTACT</p>
          <p className="flex items-center gap-1">
            <Phone />
            <span>{item.contact}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default StudentsCard
