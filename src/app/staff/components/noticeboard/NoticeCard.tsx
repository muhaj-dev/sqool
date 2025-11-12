import React, { ReactNode } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from "@/components/ui/separator";

interface EventCard {
  id: number
  time: string
  date: string
  title: string
  description: string
  participants: {
    name: string
    role: string
  }[]
  attachments: ReactNode
  eventDate: string
  eventTime: string
  isNew: boolean
}
const NoticeCard = ({ event }: { event: EventCard }) => {
  return (
    <div
      // href="/admin/staff/1"
      className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition "
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p>{`${event?.time} ${event?.date}`} </p>
            <p className="text-muted-foreground max-w-40 break-words ">
              {event?.title}
            </p>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
    </div>
  );
}

export default NoticeCard
