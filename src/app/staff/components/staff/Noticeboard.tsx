import { ThreeDotsIcon } from "@/utils/icon";
import React from "react";

const eventsData = [
  {
    date: "13 July, 2021",
    title: "School Management Meeting",
    author: "Mildred Effiong",
    timeAgo: "5 min ago",
    viewText: "View",
    bgColor: "bg-black",
    textColor: "text-white",
  },
  {
    date: "13 July, 2021",
    title: "School Management Meeting",
    author: "Mildred Effiong",
    timeAgo: "5 min ago",
    viewText: "View",
    bgColor: "bg-primary",
    textColor: "text-white",
  },
  {
    date: "13 July, 2021",
    title: "School Management Meeting",
    author: "Mildred Effiong",
    timeAgo: "5 min ago",
    viewText: "View",
    bgColor: "bg-black",
    textColor: "text-white",
  },
  {
    date: "13 July, 2021",
    title: "School Management Meeting",
    author: "Mildred Effiong",
    timeAgo: "5 min ago",
    viewText: "View",
    bgColor: "bg-primary",
    textColor: "text-white",
  },
  {
    date: "13 July, 2021",
    title: "School Management Meeting",
    author: "Mildred Effiong",
    timeAgo: "5 min ago",
    viewText: "View",
    bgColor: "bg-black",
    textColor: "text-white",
  },
];

const Noticeboard = () => {
  return (
    <div className="px-4 py-6 max-h-[600px] h-fit border-2 min-[850px]:border-none border-[#F8F8FD] overflow-y-auto flex flex-col gap-4">
      <h2 className="flex justify-between text-lg font-semibold">
        Notice Board
        <ThreeDotsIcon />
      </h2>

      <div className="space-y-4">
        {eventsData.map((event, index) => (
          <div
            key={index}
            className="py-4 flex border-b-[3px] border-gray justify-between gap-3 items-center"
          >
            <div className="">
              <div
                className={`inline-block px-3 py-1 ${event.bgColor} ${event.textColor} rounded-[20px]`}
              >
                {event.date}
              </div>
              <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {event.author} / {event.timeAgo}
                </span>
              </div>
            </div>
            <a
              href="#"
              className="text-primary text-sm font-semibold underline"
            >
              {event.viewText}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Noticeboard;
