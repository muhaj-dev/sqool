import { type ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface EventCard {
  id: number;
  time: string;
  date: string;
  title: string;
  description: string;
  participants: {
    name: string;
    role: string;
  }[];
  attachments: ReactNode;
  eventDate: string;
  eventTime: string;
  isNew: boolean;
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
            <p className="text-muted-foreground max-w-40 break-words ">{event?.title}</p>
          </div>
        </div>
        {/* <span className=" text-[#5542F6] rounded-sm px-4 py-2 bg-[#5542F61A]">
          {event?.description}
        </span> */}
      </div>
      <Separator className="my-4" />
      {/* <div className="flex flex-col gap-4 ">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">ID</p>
          <p>ADM221-10</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Role</p>
          <p>{event?.role}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Department</p>
          <p className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-600 rounded-sm"></span>{" "}
            <span>{event?.department}</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Phone Number</p>
          <p className="flex items-center gap-1">
            <Phone />
            <span>{event?.phone}</span>
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default NoticeCard;
