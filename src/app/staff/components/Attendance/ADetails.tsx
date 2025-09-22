"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Instagram, Mail, Smartphone, Star, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { format } from "date-fns";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const ADetails = () => {
  const [selected, setSelected] = useState<Date>();

  let footer = <p>Please pick a day.</p>;
  if (selected) {
    footer = <p>You picked {format(selected, "PP")}.</p>;
  }

  return (
    <div className="min-w-[25%] flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
        //   footer={footer}
        />
      </div>

      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Class</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="font-medium">5A</p>
        </div>
      </div>
      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Instructor</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="font-medium">Mrs Smith Rose</p>
        </div>
      </div>

      <div className="bg-[#F8F8FD] rounded-md px-2 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Session</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="font-medium">1st Term</p>
        </div>
      </div>
    </div>
  );
};

export default ADetails;
