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
import { DashboardIcon, NoticeboardIcon, StudentIcon, ClassIcon } from "@/utils/icon";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className=" py-8 bg-white">
      <div className="flex flex-col min-h-[120vh] bg-white max-[700px]:w-full w-[25%] max-w-[280px] fixed  gap-6">
        <div>
          <h2 className="text-primary text-center text-2xl font-bold cursor-pointer pb-4">
            SQOOLIFY
          </h2>
          <Separator />
        </div>
        <div className="flex gap-4 justify-start w-[90%] pl-4 ">
          <Avatar className="">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3>John Doe</h3>
            <p className="text-muted-foreground mb-4 border-b-0">John Doe</p>
          </div>
        </div>
        <Separator />

        <div className="flex flex-col gap-10 w-[90%] mx-auto">
          {/* Student */}

          <Link href="/student" className={`flex items-center gap-3 pl-4`}>
            <DashboardIcon
              color={`${pathname === "/student" ? "#E5B80B" : "#515B6F"}`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/student" ? "text-primary" : ""
              }`}
            >
              Dashboard
            </p>
          </Link>
          <Accordion
            type="multiple"
            className="w-[100%] -my-6 hover:outline-none"
          >
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger>
                <div className="flex items-center gap-3 pl-4">
                  <ClassIcon
                    color={`${
                      pathname === "/student/class*" ? "#E5B80B" : "#515B6F"
                    }`}
                  />
                  <p
                    className={`text-[#515B6F] ${
                      pathname === "/student/class*" ? "text-primary" : ""
                    }`}
                  >
                    Class
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-gray ">
                <div className="flex flex-col gap-4 w-[50%] pt-3 mx-auto">
                  <Link
                    href="/student/class/timetable"
                    className={`hover:text-primary text-[#515B6F] cursor-pointer ${
                      pathname === "/student/class/timetable"
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    Time Table
                  </Link>
                  <Link
                    href="/student/class/results"
                    className={`hover:text-primary text-[#515B6F] cursor-pointer ${
                      pathname === "/student/class/results"
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    Results
                  </Link>
                  <Link
                    href="/student/class/library"
                    className={`hover:text-primary text-[#515B6F] cursor-pointer ${
                      pathname === "/student/class/library"
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    Library
                  </Link>
                  <Link
                    href="/student/class/attendance"
                    className={`hover:text-primary text-[#515B6F] cursor-pointer ${
                      pathname === "/student/class/attendance"
                        ? "text-primary"
                        : ""
                    }`}
                  >
                    Attendance
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            href="/student/payment"
            className={`flex items-center gap-3 pl-4`}
          >
            <StudentIcon
              color={`${
                pathname === "/student/payment" ? "#E5B80B" : "#515B6F"
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname.startsWith("/student/payment") ? "text-primary" : ""
              }`}
            >
              Payments
            </p>
          </Link>
          <Link
            href="/student/noticeboard"
            className={`flex items-center gap-3 pl-4`}
          >
            <NoticeboardIcon
              color={`${
                pathname === "/student/noticeboard" ? "#E5B80B" : "#515B6F"
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/student/noticeboard" ? "text-primary" : ""
              }`}
            >
              Notice Board
            </p>
          </Link>

          <Link
            href="/student/settings"
            className={`flex items-center gap-3 pl-4 ${pathname === ""}`}
          >
            <Settings
              className={`text-[#515B6F] ${
                pathname === "/student/settings" ? "text-primary" : ""
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/student/settings" ? "text-primary" : ""
              }`}
            >
              Setting
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
