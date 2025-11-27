"use client";
import { ClipboardCheck, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ClassIcon, DashboardIcon, NoticeboardIcon, StudentIcon } from "@/utils/icon";
import { useAuthStore } from "@/zustand/authStore";
import { getParentDashboard } from "@/utils/api";

interface Child {
  _id: string;
  firstName: string;
  lastName: string;
  class?: {
    className: string;
  };
}

const Sidebar = () => {
  const router = useRouter();
  const { user } = useAuthStore.getState();
  const pathname = usePathname();

  // State management
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getParentDashboard();
        const childrenData = response?.data?.children || [];

        // Validate and set children data
        if (Array.isArray(childrenData)) {
          setChildren(childrenData);
        } else {
          console.warn("Unexpected children data format:", childrenData);
          setChildren([]);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load children data");
        setChildren([]); // Reset children on error
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  // Helper to format last name
  const formatLastName = (lastName: string) =>
    lastName.length > 4 ? `${lastName.slice(0, 6)}...` : lastName;

  // Render loading state
  const renderLoadingState = () => (
    <div className="pl-4 flex flex-col gap-4 w-[90%] pt-3 mx-auto">
      {[1, 2].map((item) => (
        <div key={item} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className="pl-4 flex flex-col gap-4 w-[90%] pt-3 mx-auto">
      <div className="text-sm text-red-500 bg-red-50 p-2 rounded">Failed to load children</div>
    </div>
  );

  // Render children list
  const renderChildrenList = () => (
    <div className="pl-4 flex flex-col gap-4 w-[90%] pt-3 mx-auto">
      {children.map((child) => (
        <div key={child._id} className="flex items-center justify-between">
          <button
            className={`hover:text-primary text-[#515B6F] cursor-pointer transition-colors duration-200`}
            onClick={() => router.push(`/parent/kid/${child._id}`)}
          >
            {child.firstName}{" "}
            <span className="ml-1 hover:text-primary text-muted-foreground">
              {formatLastName(child.lastName)}
            </span>
          </button>
        </div>
      ))}
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="pl-4 flex flex-col gap-4 w-[90%] pt-3 mx-auto">
      <div className="text-muted-foreground text-sm">No children found</div>
    </div>
  );

  return (
    <div className="py-8 bg-white">
      <div className="flex flex-col min-h-[120vh] bg-white max-[700px]:w-full w-[25%] max-w-[280px] fixed gap-6">
        {/* Header */}
        <div>
          <h2
            onClick={() => router.push("/")}
            className="text-primary text-center text-2xl font-bold cursor-pointer pb-4 hover:opacity-80 transition-opacity"
          >
            SQOOLIFY
          </h2>
          <Separator />
        </div>

        {/* User Info */}
        <div className="flex gap-4 justify-start w-[90%] pl-4">
          <Avatar className="">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-medium text-sm">{user?.school?.name} School</h3>
            <p className="text-muted-foreground mb-4 border-b-0 text-sm">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>
        <Separator />

        {/* Navigation */}
        <div className="flex flex-col gap-10 w-[90%] mx-auto">
          {/* Dashboard */}
          <Link
            href="/parent"
            className={`flex items-center gap-3 pl-4 transition-colors duration-200 ${
              pathname.startsWith("/parent") ? "text-primary" : "text-[#515B6F] hover:text-primary"
            }`}
          >
            <DashboardIcon color={pathname.startsWith("/parent") ? "#E5B80B" : "#515B6F"} />
            <p>Dashboard</p>
          </Link>

          {/* My Kids Accordion */}
          <Accordion type="multiple" className="w-[100%] -my-6 hover:outline-none">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 pl-4">
                  <ClassIcon color={pathname.startsWith("/parent/kid") ? "#E5B80B" : "#515B6F"} />
                  <p
                    className={
                      pathname.startsWith("/parent/kid") ? "text-primary" : "text-[#515B6F]"
                    }
                  >
                    My Kids
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-gray">
                {isLoading
                  ? renderLoadingState()
                  : error
                    ? renderErrorState()
                    : children.length > 0
                      ? renderChildrenList()
                      : renderEmptyState()}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link
            href="/parent/attendance"
            className={`flex items-center gap-3 pl-4 transition-colors duration-200 ${
              pathname === "/parent/attendance"
                ? "text-primary"
                : "text-[#515B6F] hover:text-primary"
            }`}
          >
            <ClipboardCheck color={pathname === "/parent/attendance" ? "#E5B80B" : "#515B6F"} />
            <p>Attendance</p>
          </Link>

          {/* Fees */}
          <Link
            href="/parent/fees"
            className={`flex items-center gap-3 pl-4 transition-colors duration-200 ${
              pathname === "/parent/fees" ? "text-primary" : "text-[#515B6F] hover:text-primary"
            }`}
          >
            <StudentIcon color={pathname === "/parent/fees" ? "#E5B80B" : "#515B6F"} />
            <p>Fees</p>
          </Link>

          {/* Notice Board */}
          <Link
            href="/parent/noticeboard"
            className={`flex items-center gap-3 pl-4 transition-colors duration-200 ${
              pathname === "/parent/noticeboard"
                ? "text-primary"
                : "text-[#515B6F] hover:text-primary"
            }`}
          >
            <NoticeboardIcon color={pathname === "/parent/noticeboard" ? "#E5B80B" : "#515B6F"} />
            <p>Notice Board</p>
          </Link>

          {/* Settings */}
          <Link
            href="/parent/settings"
            className={`flex items-center gap-3 pl-4 transition-colors duration-200 ${
              pathname === "/parent/settings" ? "text-primary" : "text-[#515B6F] hover:text-primary"
            }`}
          >
            <Settings
              className={pathname === "/parent/settings" ? "text-primary" : "text-[#515B6F]"}
            />
            <p>Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
