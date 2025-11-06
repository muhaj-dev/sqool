'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Select, SelectGroup, SelectItem, SelectValue } from '../ui/select'
import { SelectContent, SelectTrigger } from '@radix-ui/react-select'
import { MoveLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
// import { CircularProgressbar } from "react-circular-progressbar"
import CircularProgress from '../CircularProgress'
import Link from 'next/link'

// Select Data

const SELECTDATA = [
  {
    value: 'suspend-student',
    title: 'Suspend Student',
    id: 1,
  },
  {
    value: 'expel-student',
    title: 'Expel Student',
    id: 2,
  },
  {
    value: 'messaging',
    title: 'Messaging',
    id: 3,
  },
  {
    value: 'report',
    title: 'Report',
    id: 4,
  },
  {
    value: 'remove',
    title: 'Remove',
    id: 5,
  },
]

const StudentTopBar = () => {
  return (
    <div className="flex items-center justify-between">
      <Link href="/admin/student" className="border-none flex items-center gap-2">
        <MoveLeft />
        <span className="text-[.9rem] md:text-xl">Student Detail</span>
      </Link>
      <div className="w-fit ">
        <Select>
          <SelectTrigger className="border text-primary py-2 px-4 text-sm w-fit rounded-md outline-none">
            <SelectValue placeholder="More Action" />
          </SelectTrigger>
          <SelectContent className="bg-white w-full rounded-md py-3 px-4 flex flex-col gap-4  shadow-md">
            {SELECTDATA.map(item => (
              <SelectItem value={item.value} key={item.id} className="text-muted-foreground ">
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default StudentTopBar
