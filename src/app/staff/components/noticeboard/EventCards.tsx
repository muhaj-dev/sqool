import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { LibraryModal } from "../class/library/LibraryModal";
import { EventModal } from "./EventModal";


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

const eventCards: EventCard[] = [
  {
    id: 1,
    time: "01:52PM",
    date: "06-20-2024",
    title: "STUDENTS OPEN DAY",
    description:
      "Lorem ipsum dolor sit amet consectetur. Adipiscing accumsan pulvinar porttitor non et eget sed.",
    participants: [{ name: "Mrs Jumoke", role: "Principal" }],
    attachments: ["Requirements.pdf"],
    eventDate: "May 20th, 2024",
    eventTime: "09:00 AM",
    isNew: true,
  },
  {
    id: 2,
    time: "01:52PM",
    date: "06-20-2024",
    title: "STUDENTS OPEN DAY",
    description:
      "Lorem ipsum dolor sit amet consectetur. Adipiscing accumsan pulvinar porttitor non et eget sed.",
    participants: [{ name: "Mrs Jumoke", role: "Principal" }],
    attachments: ["Requirements.pdf"],
    eventDate: "May 20th, 2024",
    eventTime: "09:00 AM",
    isNew: true,
  },
  {
    id: 3,
    time: "01:52PM",
    date: "06-20-2024",
    title: "STUDENTS OPEN DAY",
    description:
      "Lorem ipsum dolor sit amet consectetur. Adipiscing accumsan pulvinar porttitor non et eget sed.",
    participants: [{ name: "Mrs Jumoke", role: "Principal" }],
    attachments: ["Requirements.pdf"],
    eventDate: "May 20th, 2024",
    eventTime: "09:00 AM",
    isNew: false,
  },
  {
    id: 4,
    time: "01:52PM",
    date: "06-20-2024",
    title: "STUDENTS OPEN DAY",
    description:
      "Lorem ipsum dolor sit amet consectetur. Adipiscing accumsan pulvinar porttitor non et eget sed.",
    participants: [{ name: "Mrs Jumoke", role: "Principal" }],
    attachments: ["Requirements.pdf"],
    eventDate: "May 20th, 2024",
    eventTime: "09:00 AM",
    isNew: true,
  },
  {
    id: 5,
    time: "01:52PM",
    date: "06-20-2024",
    title: "STUDENTS OPEN DAY",
    description:
      "Lorem ipsum dolor sit amet consectetur. Adipiscing accumsan pulvinar porttitor non et eget sed.",
    participants: [{ name: "Mrs Jumoke", role: "Principal" }],
    attachments: ["Requirements.pdf"],
    eventDate: "May 20th, 2024",
    eventTime: "09:00 AM",
    isNew: true,
  },
  {
    id: 6,
    time: "01:52PM",
    date: "06-20-2024",
    title: "STUDENTS OPEN DAY",
    description:
      "Lorem ipsum dolor sit amet consectetur. Adipiscing accumsan pulvinar porttitor non et eget sed.",
    participants: [{ name: "Mrs Jumoke", role: "Principal" }],
    attachments: ["Requirements.pdf"],
    eventDate: "May 20th, 2024",
    eventTime: "09:00 AM",
    isNew: false,
  },
  // Add more cards as necessary
];

const Card = ({ event }: { event: EventCard }) => (
  <div className="border border-[#E4E4E4] p-4 hover:border-[#E5B80B] hover:shadow-lg hover:shadow-[#E5B80B] rounded-lg max-w-sm">
    <div className="flex gap-3 justify-between">
      <div className="flex gap-2.5">
        <div className="bg-[#E5CFFF] h-fit py-2.5 px-3.5 w-fit rounded-md">
          <File />
        </div>
        <div>
          <div className="text-[#A7A9AD] text-sm flex justify-between items-center">
            <span>{event.time}</span>
            <span>{event.date}</span>
          </div>
          <h2 className="font-bold ">{event.title}</h2>
        </div>
      </div>
      {event.isNew && (
        <span className="h-fit text-[8px] bg-green-500 text-white px-1 py-[0.95px] rounded">
          NEW
        </span>
      )}
    </div>

    <p className="mt-5 text-sm ">{event.description}</p>
    <div className="mt-4 border-b-2 border-[#A7A9AD] pb-3">
      {event.participants.map((participant, index) => (
        <p key={index}
        className="flex justify-between"
         >
          <span>{participant.name}</span>  <span>{participant.role}</span>
        </p>
      ))}
    </div>
    <div className="mt-4 text-sm ">
      <a href="#" className="text-blue-500">
        {event.attachments[0]}
      </a>
    </div>
    <div className="mt-4 text-sm flex justify-between">
      <span>{event.eventDate}</span>
      <span>{event.eventTime}</span>
    </div>
  </div>
);

const EventCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {eventCards.map((event) => (
      <Dialog key={event.id} >
      <DialogTrigger className="text-left">
        <Card key={event.id} event={event} />
       
      </DialogTrigger>

    <EventModal event={event} />
    </Dialog>
    ))}
  </div>
);

export default EventCards;

const File = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.2145 26.25H11.25C8.89298 26.25 7.71447 26.25 6.98223 25.5178C6.25 24.7855 6.25 23.607 6.25 21.25V8.75C6.25 6.39298 6.25 5.21447 6.98223 4.48223C7.71447 3.75 8.89298 3.75 11.25 3.75H18.75C21.107 3.75 22.2855 3.75 23.0178 4.48223C23.75 5.21447 23.75 6.39298 23.75 8.75V17.7145C23.75 18.2254 23.75 18.4809 23.6548 18.7106C23.5597 18.9403 23.3791 19.1209 23.0178 19.4822L16.9822 25.5178C16.6209 25.8791 16.4403 26.0597 16.2106 26.1548C15.9809 26.25 15.7254 26.25 15.2145 26.25Z"
      stroke="#9530AE"
    />
    <path
      d="M15 26.25V20.4167C15 19.0417 15 18.3543 15.4271 17.9271C15.8543 17.5 16.5417 17.5 17.9167 17.5H23.75"
      stroke="#9530AE"
    />
  </svg>
);

