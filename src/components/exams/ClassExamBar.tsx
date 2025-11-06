'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '../ui/separator'
import { usePathname } from 'next/navigation'

interface ClassExamBarProps {
  level: string
}

const ClassExamBar: React.FC<ClassExamBarProps> = ({ level }) => {
  const pathname = usePathname()

  let statusText = 'Approved' // Default status text

  // If-else statement to check the current route
  if (pathname.includes('/admin/exam/pending')) {
    statusText = 'Pending Approve'
  } else if (pathname.includes('/admin/exam/completed')) {
    statusText = 'Completed'
  } else if (pathname.includes('/admin/exam/rejected')) {
    statusText = 'Rejected'
  }

  return (
    <section className="my-4">
      <div className="flex items-center justify-between flex-wrap flex-row pb-6 ">
        <div className="w-full md:w-[50%]">
          <h3 className="text-xl font-bold">{level} Exam question List</h3>
          <p className="text-muted-foreground w-full  max-w-[490px] text-sm">{statusText}</p>
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
      <Separator />
    </section>
  )
}

export default ClassExamBar
