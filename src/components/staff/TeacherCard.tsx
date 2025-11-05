import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '../ui/separator'
import { Phone } from 'lucide-react'
import Link from 'next/link'
import { StaffResult } from '@/types'

type TStaff = {
  item: StaffResult
}

const TeacherCard = ({ item }: TStaff) => {
  const fullName = item.userId ? `${item?.userId?.firstName} ${item?.userId?.lastName}` : 'Unknown Staff'
  const phone = item.address ? `+${item?.address?.split(',')?.[0]?.trim()}` : 'N/A'

  return (
    <Link
      href={`/admin/staff/${item?._id}`}
      className="bg-white border text-sm rounded-md p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
              {item.userId ? `${item.userId?.firstName?.[0]}${item.userId?.lastName?.[0]}` : 'CN'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{fullName}</p>
            <p className="text-muted-foreground max-w-40 break-words">No email provided</p>
          </div>
        </div>
        <span className="text-[#5542F6] rounded-sm px-4 py-2 bg-[#5542F61A]">{item?.level ?? 'Unknown Level'}</span>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">ID</p>
          <p>{item?._id?.slice(0, 6) ?? 'ADM221'}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Role</p>
          <p>{item?.role ?? 'Unknown Role'}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Department</p>
          <p className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-600 rounded-sm"></span>
            <span>{item?.primarySubject ?? 'Unknown Subject'}</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Phone Number</p>
          <p className="flex items-center gap-1">
            <Phone />
            <span>{phone}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default TeacherCard
