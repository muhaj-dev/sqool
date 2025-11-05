"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { HiMenu, HiX } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { GreaterThan } from "@/utils/icon";


const Navbar = ({
  toggleSidebar,
  isOpen,
}: {
  toggleSidebar: () => void;
  isOpen: boolean;
}) => {
  return (
    <div className="bg-primary md:bg-[#fafafa] w-full flex flex-wrap justify-between mb-4 px-5 py-4">
      <div className="">
        {/* Hamburger button - toggles sidebar */}
        <button
          className="max-[700px]:block hidden text-3xl focus:outline-none"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <HiX className="text-white" />
          ) : (
            <HiMenu className="text-white" />
          )}
        </button>
      </div>
      <div className="hidden md:block w-[45%] relative">
        <Search className="absolute top-2 left-1 text-muted-foreground " />
        <Input
          type="search"
          placeholder="Search for payment, invoices, transactions"
          className="bg-transparent  outline-none border-[#E9EBEB] shadow-sm px-4 pl-10 py-2 text-lg"
        />
      </div>
      <div className="hidden md:flex items-center gap-8 ">
        <div className="flex items-center gap-4 border rounded-full  px-4 py-2 w-fit shadow-sm cursor-pointer">
          <span className="bg-[#19B257] w-2 h-2 rounded-full"></span>{" "}
          <span>New update</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Select>
        <SelectTrigger className="w-[120px] flex md:hidden text-white bg-primary border-none">
          <SelectValue placeholder="Show stats: " />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default Navbar
