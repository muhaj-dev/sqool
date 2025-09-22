"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
// import StaffContextProvider from "@/contexts/staff-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <section className="relative flex max-w-[1740px] w-[100%] mx-auto gap-3 align-baseline ">
      <div
        className={`min-[700px]:block hidden max-[700px]:w-[0%] w-[25%] max-w-[280px]`}
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>
      {isOpen && (
        <div className="fixed bg-black z-30 bg-opacity-70 max-[700px]:block hidden w-screen h-screen">
          <div
            onClick={toggleSidebar}
            className="  absolute top-0 bg-transparent w-screen h-screen"
          />
          <div className="absolute top-0 left-0 max-[360px]:w-[100%] w-[280px]">
            <Sidebar toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}
      <main className="bg-white min-[850px]:bg-transparent max-[700px]:w-full w-[75%] ">
        <Navbar toggleSidebar={toggleSidebar} isOpen={isOpen} />
        <div className="px-2 md:px-8">{children}</div>
      </main>
    </section>
  );
}
