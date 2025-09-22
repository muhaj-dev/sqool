"use client";

import React, { useState } from "react";
import EventCards from "@/app/staff/components/noticeboard/EventCards";
import Noticebar from "@/app/staff/components/noticeboard/Noticbar";
import SchoolEvents from "@/app/staff/components/noticeboard/SchoolEvents";


interface EventCard {
  id: number;
  time: string;
  date: string;
  title: string;
  description: string;
  participants: {
    name: string;
    role: string;
  }[];
  attachments: string[];
  eventDate: string;
  eventTime: string;
  isNew: boolean;
}

const Page = () => {
  return (
    <div>
      <Noticebar />
      <div className="w-full mt-8 bg-white py-5 px-0 md:px-9">
        <EventCards />
        <SchoolEvents />
      </div>
    </div>
  );
};

export default Page;
