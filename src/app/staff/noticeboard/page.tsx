"use client";

import React, { useState } from "react";
import Noticebar from "../components/noticeboard/Noticbar";
import EventCards from "../components/noticeboard/EventCards";
import SchoolEvents from "../components/noticeboard/SchoolEvents";

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
      <div className="w-full mt-0 md:mt-8 bg-white py-0 md:py-5 px-0 md:px-9">
        <EventCards />
        <SchoolEvents />
      </div>
    </div>
  );
};

export default Page;
