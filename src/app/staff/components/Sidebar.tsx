"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Landmark, Settings } from "lucide-react";
import Link from "next/link";
import {
  DashboardIcon,
  NoticeboardIcon,
  StudentIcon,
  ClassIcon,
  ExamIcon,
} from "@/utils/icon";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/zustand/authStore";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore.getState(); //@dev note : isLoading here is not applicable since its state does not change or has already changed during login or auth related functions
  // console.log(user); // Use school name in your project
  const [hydrated, setHydrated] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className=" py-8 bg-white">
      <div className="flex flex-col min-h-[120vh] bg-white max-[700px]:w-full w-[25%] max-w-[280px] fixed  gap-6">
        <div>
          <h2
            onClick={() => router.push("/")}
            className="text-primaryColor text-center text-2xl font-bold cursor-pointer pb-4"
          >
            SQOOLIFY
          </h2>
          <Separator />
        </div>
        <div className="flex gap-4 justify-start w-[90%] pl-4 ">
          <Avatar className="">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {!hydrated ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-100 rounded w-24" />
                <div className="h-3 bg-slate-100 rounded w-16" />
              </div>
            ) : (
              <div>
                <h3>{user?.school?.name} School</h3>
                <p className="text-muted-foreground mb-4 border-b-0">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            )}
          </div>
        </div>
        <Separator />

        <div className="flex flex-col gap-10 w-[90%] mx-auto">
          {/* Student */}

          <Link href="/staff" className={`flex items-center gap-3 pl-4`}>
            <DashboardIcon
              color={`${pathname === "/staff" ? "#E5B80B" : "#515B6F"}`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/staff" ? "text-primaryColor" : ""
              }`}
            >
              Dashboard
            </p>
          </Link>
          {/* <Accordion type="multiple" className="w-[100%] -my-6 hover:outline-none">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger>
                <div className="flex items-center gap-3 pl-4">
                  <ClassIcon
                    color={`${pathname === "/staff/class*" ? "#E5B80B" : "#515B6F"}`}
                  />
                  <p
                    className={`text-[#515B6F] ${
                      pathname === "/staff/class*" ? "text-primaryColor" : ""
                    }`}
                  >
                    Class
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-gray ">
                <div className="flex flex-col gap-4 w-[50%] pt-3 mx-auto">
                 
                 
                  <Link
                    href="/staff/class/attendance"
                    className={`hover:text-primaryColor text-[#515B6F] cursor-pointer ${
                      pathname === "/staff/class/attendance" ? "text-primaryColor" : ""
                    }`}
                  >
                    Attendance
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion> */}

          <Link
            href="/staff/attendance"
            className={`flex items-center gap-3 pl-4`}
          >
            <ClassIcon
              color={`${
                pathname === "/staff/attendance" ? "#E5B80B" : "#515B6F"
              }`}
            />

            <p
              className={`text-[#515B6F] ${
                pathname.startsWith("/staff/attendance")
                  ? "text-primaryColor"
                  : ""
              }`}
            >
              Attendance
            </p>
          </Link>
          {/* <Link href="/staff/student" className={`flex items-center gap-3 pl-4`}>
            <StudentIcon
              color={`${pathname === "/staff/student" ? "#E5B80B" : "#515B6F"}`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname.startsWith("/staff/student") ? "text-primaryColor" : ""
              }`}
            >
              Student
            </p>
          </Link> */}
          <Link
            href="/staff/timetable"
            className={`flex items-center gap-3 pl-4`}
          >
            <StudentIcon
              color={`${
                pathname === "/staff/timetable" ? "#E5B80B" : "#515B6F"
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname.startsWith("/staff/timetable")
                  ? "text-primaryColor"
                  : ""
              }`}
            >
              Time Table
            </p>
          </Link>

          <Link
            href="/staff/noticeboard"
            className={`flex items-center gap-3 pl-4`}
          >
            <NoticeboardIcon
              color={`${
                pathname === "/staff/noticeboard" ? "#E5B80B" : "#515B6F"
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/staff/noticeboard" ? "text-primaryColor" : ""
              }`}
            >
              Notice Board
            </p>
          </Link>
          <Link href="/staff/exams" className={`flex items-center gap-3 pl-4`}>
            <ExamIcon
              size={24}
              color={`${pathname === "/staff/exams" ? "#E5B80B" : "#515B6F"}`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/staff/exams" ? "text-primaryColor" : ""
              }`}
            >
              Examinations
            </p>
          </Link>

          <Link
            href="/staff/students"
            className={`flex items-center gap-3 pl-4 ${pathname === ""}`}
          >
            <ClassIcon
              color={`${
                pathname === "/staff/students" ? "#E5B80B" : "#515B6F"
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/staff/students" ? "text-primaryColor" : ""
              }`}
            >
              My Students
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
