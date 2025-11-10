import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from "@/components/ui/skeleton";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { IStudent } from "@/types";
import { formatDate, getInitials } from "@/utils/lib";

const StudentsCard = ({
  item,
}: {
  item: IStudent & { address: string; enrolmentDate: string };
}) => {
  return (
    <Link
      href={`/staff/students/${item._id}`}
      className="bg-white text-[.9rem] border border-[#EBEAED] rounded-md p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition "
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={item.photo} alt="@shadcn" />
            <AvatarFallback>
              {getInitials(`${item.lastName} ${item.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{`${item.firstName} ${item.lastName}`} </p>
            <p className="text-muted-foreground max-w-40 text-[14px] break-words ">
              {item.address}
            </p>
          </div>
        </div>
        <span className=" text-[#5542F6] text-[12px] rounded-sm px-4 py-2 bg-[#5542F61A]">
          View More
        </span>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">ID</p>
          <p className="uppercase">{item._id.slice(7)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">class</p>
          <p>{item.class.className}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">ADDMISSION DATE</p>
          <p className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-600 rounded-sm"></span>{" "}
            <span>{formatDate(item.enrolmentDate)}</span>
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground uppercase">Parent's CONTACT</p>
          <p className="flex items-center gap-1">
            <Mail />
            <span>{item.parent.userId.email}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default StudentsCard;

const StudentsCardSkeleton = () => {
  return (
    <div className="bg-white text-[.9rem] border border-[#EBEAED] rounded-md p-4 shadow-sm animate-pulse">
      {/* Top section */}
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          {/* Avatar */}
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" /> {/* Name */}
            <Skeleton className="h-4 w-40" /> {/* Address */}
          </div>
        </div>

        {/* "View more" button */}
        <Skeleton className="h-6 w-20 rounded-sm" />
      </div>

      <Separator className="my-4" />

      {/* Bottom info rows */}
      <div className="flex flex-col gap-4 text-sm">
        {/* ID */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Class */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Admission Date */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-sm" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Parent Contact */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { StudentsCardSkeleton };
