"use client";
import { GraduationCap, Landmark, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DashboardIcon, ExamIcon, PersonIcon, StudentIcon } from "@/utils/icon";
import { useAuthStore } from "@/zustand/authStore";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname();

  const router = useRouter();
  const { user } = useAuthStore.getState();
  // console.log(user); // Use school name in your project

  return (
    <div className="fixed py-8 bg-white flex flex-col h-full  gap-6 w-[300px]">
      <div>
        <h2
          onClick={() => router.push("/")}
          className="text-primary text-center text-2xl font-bold cursor-pointer pb-4"
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
          <p className="font-500 text-2xl">{user?.school?.name} School</p>

          <Accordion type="multiple">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </AccordionTrigger>
              <AccordionContent className="w-[50%]">
                <div className="flex flex-col gap-4">
                  <Link
                    href="#"
                    className="hover:text-primary text-muted-foreground cursor-pointer"
                  >
                    Profile
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-primary text-muted-foreground cursor-pointer"
                  >
                    Logout
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Separator />
      <Accordion type="multiple" className="w-[90%] hover:outline-none">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger>
            <div className="flex items-center gap-4 pl-6">
              <DashboardIcon
                color={` #E5B80B
                `}
              />
              <p
                className={`text-[#515B6F] text-xl 
                ]`}
              >
                Dashboard
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="w-[50%] mx-auto">
            <div className="flex flex-col gap-4">
              <Link
                href="/admin/overview"
                onClick={toggleSidebar}
                className={`hover:text-primary text-muted-foreground cursor-pointer ${
                  pathname.startsWith("/admin/overview") ? "text-primary" : ""
                }`}
              >
                Overviews
              </Link>
              <Link
                href="/admin/compulsory"
                onClick={toggleSidebar}
                className={`hover:text-primary text-muted-foreground cursor-pointer ${
                  pathname.startsWith("/admin/compulsory") ? "text-primary" : ""
                }`}
              >
                Compulsory
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator />

      <div className="flex flex-col gap-10 w-[90%] mx-auto">
        {/* Student */}
        <Link href="/admin/student" className={`flex items-center gap-4 pl-4`}>
          <StudentIcon color={`${pathname.startsWith("/admin/student") ? "#E5B80B" : "#515B6F"}`} />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] cursor-pointer ${
              pathname.startsWith("/admin/student") ? "text-primary" : ""
            }`}
          >
            Student
          </p>
        </Link>
        <Link href="/admin/parent" className={`flex items-center gap-4 pl-4`}>
          <StudentIcon color={`${pathname.startsWith("/admin/parent") ? "#E5B80B" : "#515B6F"}`} />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] cursor-pointer ${
              pathname.startsWith("/admin/parent") ? "text-primary" : ""
            }`}
          >
            Parent
          </p>
        </Link>
        <Link href="/admin/staff" className={`flex items-center gap-4 pl-4`}>
          <PersonIcon color={`${pathname.startsWith("/admin/staff") ? "#E5B80B" : "#515B6F"}`} />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] ${
              pathname.startsWith("/admin/staff") ? "text-primary" : ""
            }`}
          >
            Staff
          </p>
        </Link>

        <Link href="/admin/class" className={`flex items-center gap-4 pl-4`}>
          <PersonIcon color={`${pathname.startsWith("/admin/class") ? "#E5B80B" : "#515B6F"}`} />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] ${
              pathname.startsWith("/admin/class") ? "text-primary" : ""
            }`}
          >
            Class/Subject
          </p>
        </Link>

        <Link href="/admin/notice" className={`flex items-center gap-4 pl-4 `}>
          <Landmark
            className={`text-[#515B6F] ${
              pathname.startsWith("/admin/notice") ? "text-primary" : ""
            }`}
          />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] ${
              pathname.startsWith("/admin/notice") ? "text-primary" : ""
            }`}
          >
            Notice
          </p>
        </Link>

        <Link href="/admin/fees" className={`flex items-center gap-4 pl-4 `}>
          <GraduationCap
            className={`text-[#515B6F] ${pathname.startsWith("/admin/fees") ? "text-primary" : ""}`}
          />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] ${pathname.startsWith("/admin/fees") ? "text-primary" : ""}`}
          >
            Fees
          </p>
        </Link>

        <Link href="/admin/account" className={`flex items-center gap-4 pl-4 `}>
          <Landmark
            className={`text-[#515B6F] ${
              pathname.startsWith("/admin/account") ? "text-primary" : ""
            }`}
          />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] ${
              pathname.startsWith("/admin/account") ? "text-primary" : ""
            }`}
          >
            Payment History
          </p>
        </Link>
        <Link
          href="/admin/exam"
          className={`flex items-center gap-4 pl-4 ${pathname.startsWith("/admin/exam")}`}
        >
          <ExamIcon
            size={24}
            color={`${pathname.startsWith("/admin/exam") ? "#E5B80B" : "#515B6F"}`}
          />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] ${pathname.startsWith("/admin/exam") ? "text-primary" : ""}`}
          >
            Examinations
          </p>
        </Link>
        <Link
          href="/admin/settings"
          className={`flex items-center gap-4 pl-4 ${pathname.startsWith("/admin/settings")}`}
        >
          <Settings
            className={`text-[#515B6F] ${
              pathname.startsWith("/admin/settings") ? "text-primary" : ""
            }`}
          />
          <p
            onClick={toggleSidebar}
            className={`text-[#515B6F] ${
              pathname.startsWith("/admin/settings") ? "text-primary" : ""
            }`}
          >
            Setting
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
