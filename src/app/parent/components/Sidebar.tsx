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
} from "@/utils/icon";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/zustand/authStore";
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const router = useRouter();
  const { user } = useAuthStore.getState();
console.log(user); // Use school name in your project

  const pathname = usePathname();
  return (
    <div className=" py-8 bg-white">
      <div className="flex flex-col min-h-[120vh] bg-white max-[700px]:w-full w-[25%] max-w-[280px] fixed  gap-6">
        <div>
          <h2 
            onClick={() => router.push("/")}
          className="text-primaryColor text-center text-2xl font-bold cursor-pointer pb-4">
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
            <h3>{user?.school?.name} School</h3>
            <p className="text-muted-foreground mb-4 border-b-0">{user?.firstName} {user?.lastName}</p>
          </div>
        </div>
        <Separator />

        <div className="flex flex-col gap-10 w-[90%] mx-auto">
          {/* Student */}

          <Link
            href="/parent"
            className={`flex items-center gap-3 pl-4 ${
              pathname.startsWith("/parent") ? "" : ""
            }`}
          >
            <DashboardIcon
              color={`${
                pathname.startsWith("/parent") ? "#E5B80B" : "#515B6F"
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname.startsWith("/parent") ? "text-primaryColor" : ""
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
                       pathname.startsWith("/parent/kid") ? "#E5B80B" : "#515B6F"
                    }`}
                  />
                  <p
                    className={`text-[#515B6F] ${
                       pathname.startsWith("/parent/kid") ? "text-primaryColor" : ""
                    }`}
                  >
                    My Kids
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-gray ">
                <div className="flex flex-col gap-4 w-[50%] pt-3 mx-auto">
                  <Link
                    href="/parent/kid/schedule"
                    className={`hover:text-primaryColor text-[#515B6F] cursor-pointer ${
                      pathname === "/parent/kid/schedule" ? "text-primaryColor" : ""
                    }`}
                  >
                    Schedule
                  </Link>
                  <Link
                    href="/parent/kid/results"
                    className={`hover:text-primaryColor text-[#515B6F] cursor-pointer ${
                      pathname === "/parent/kid/results" ? "text-primaryColor" : ""
                    }`}
                  >
                    Results
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            href="/parent/payment"
            className={`flex items-center gap-3 pl-4`}
          >
            <StudentIcon
              color={`${
                pathname === "/parent/payment" ? "#E5B80B" : "#515B6F"
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/parent/payment"
                  ? "text-primaryColor"
                  : ""
              }`}
            >
              Payment
            </p>
          </Link>
          <Link
            href="/parent/noticeboard"
            className={`flex items-center gap-3 pl-4`}
          >
            <NoticeboardIcon
              color={`${
                pathname === "/parent/noticeboard" ? "#E5B80B" : "#515B6F"
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/parent/noticeboard" ? "text-primaryColor" : ""
              }`}
            >
              Notice Board
            </p>
          </Link>

          <Link
            href="/parent/settings"
            className={`flex items-center gap-3 pl-4 ${pathname === ""}`}
          >
            <Settings
              className={`text-[#515B6F] ${
                pathname === "/parent/settings" ? "text-primaryColor" : ""
              }`}
            />
            <p
              className={`text-[#515B6F] ${
                pathname === "/parent/settings" ? "text-primaryColor" : ""
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
