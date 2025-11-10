import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Instagram,
  Mail,
  Smartphone,
  Star,
  Twitter,
  LocateIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ISingleStudent } from "@/types";
import { formatDate, getInitials } from "@/utils/lib";
import { AuthUser } from "@/zustand/authStore";

interface DetailsProps {
  student: ISingleStudent;
  user: AuthUser;
}
const Details: React.FC<DetailsProps> = ({ student, user }) => {
  return (
    <div className="min-w-[25%] flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={student.photo} />
          <AvatarFallback>
            {getInitials(`${student.lastName} ${student.firstName}`) ?? "N/A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center items-baseline">
          <p className="text-2xl font-semibold">
            {student.firstName} {student.lastName}
          </p>
          <p className="uppercase">ID: {student._id?.slice(7) ?? "N/A"}</p>
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400" size={20} />
            <span className="text-[18px]">4.0</span>
            {/* TODO: revisit this for stars, should come from db/ average performance overall activity in school */}
          </div>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Admission Date</p>
          <p className="">{formatDate(student.enrolmentDate) ?? "N/A"}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">Gender</p>
          <span className="bg-[#5542F61A] text-sm px-2 py-1 rounded-sm text-[#5542F6]">
            {student.gender ?? "N/A"}
          </span>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Class</p>
          {/* @ts-ignore */}
          <p className="">{student.class.className ?? "N/A"}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Section</p>
          {/* @ts-ignore */}
          <p className="">{student.class.classSection}</p>
        </div>
      </div>
      {/* @ts-ignore */}
      {user.role && user.role !== "teacher" && (
        <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Class Teacher</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground capitalize">
              {/* @ts-ignore */}
              {user.gender && user.gender == "male" ? "Mr." : "Mrs."}{" "}
              {user.lastName} {user.lastName}
            </p>
          </div>
        </div>
      )}

      <Separator />

      <div className="flex flex-col gap-4">
        <p className="text-xl">Contact</p>
        <div className="flex gap-6">
          <Mail className="text-muted-foreground" size={20} />
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="text-[14px]">
              {/* @ts-ignore */}
              {student.parent?.userId?.email ?? "N/A"}
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <Smartphone className="text-muted-foreground" size={23} />
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="text-[14px]">
              {/* @ts-ignore */}
              {student.parent?.userId?.phone ?? "N/A"}
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <LocateIcon className="text-muted-foreground " size={22} />
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="text-[14px]">{student.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;

///********************** SKELETON FOR DETAILS ****************************/

const DetailsSkeleton = () => {
  return (
    <div className="min-w-[25%] flex flex-col gap-4 animate-pulse">
      {/* Avatar + Name Section */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />

        <div className="flex flex-col justify-center items-baseline gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-10" />
          </div>
        </div>
      </div>

      {/* Card 1 */}
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-16 rounded-sm" />
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <Separator />

      {/* Contact Section */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-24" />

        {/* Contact item 1 */}
        <div className="flex gap-6">
          <Skeleton className="h-5 w-5 rounded" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Contact item 2 */}
        <div className="flex gap-6">
          <Skeleton className="h-6 w-6 rounded" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Contact item 3 */}
        <div className="flex gap-6">
          <Skeleton className="h-5 w-5 rounded" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Contact item 4 */}
        <div className="flex gap-6">
          <Skeleton className="h-6 w-6 rounded" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { DetailsSkeleton };

