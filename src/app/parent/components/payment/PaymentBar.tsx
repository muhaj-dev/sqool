'use client'

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GreaterThan } from "@/utils/icon";

const PaymentBar = () => {
  return (
    <>
      <div className="flex items-center justify-between my-4  ">
        <div
        //   href="/staff"
          className="space-y-2 cursor-pointer hover:bg-slate-100 rounded-md"
        >
          <h2 className="text-[18px] sm:text-2xl font-semibold">Paymnents</h2>
          <div className="flex items-center gap-3 text-[#84818A] text-sm">
            Home
            <GreaterThan />
            Paymnents
          </div>
        </div>
        <Select>
          <SelectTrigger className="w-[120px] text-[#84818A]">
            <SelectValue placeholder="Show stats: " />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PaymentBar;
