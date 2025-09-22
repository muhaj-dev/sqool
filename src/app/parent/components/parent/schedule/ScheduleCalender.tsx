"use client";

import React, { PropsWithChildren, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  ToolbarProps,
  EventProps,
  NavigateAction,
  SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ChevronDown } from "lucide-react";
import KidsDropdown from "./KidsDropdown";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  teacher: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Physical studies class",
    start: new Date(2024, 1, 16, 9, 0),
    end: new Date(2024, 1, 16, 10, 20),
    teacher: "Mrs Edon",
  },
  {
    id: 2,
    title: "Physical studies class",
    start: new Date(2024, 1, 16, 10, 30),
    end: new Date(2024, 1, 16, 11, 50),
    teacher: "Mrs Edon",
  },
  {
    id: 3,
    title: "Physical studies class",
    start: new Date(2024, 1, 16, 12, 30),
    end: new Date(2024, 1, 16, 13, 50),
    teacher: "Mrs Edon",
  },
  {
    id: 4,
    title: "Physical studies class",
    start: new Date(2024, 1, 16, 14, 30),
    end: new Date(2024, 1, 16, 15, 50),
    teacher: "Mrs Edon",
  },
];

const ColoredDateCellWrapper: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => <div style={{ backgroundColor: "white" }}>{children}</div>;

const CustomToolbar: React.FC<ToolbarProps<Event>> = ({ onNavigate, date }) => {
  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToCurrent = () => {
    onNavigate("TODAY");
  };

  const label = () => {
    return <span>{moment(date).format("MMMM DD YYYY")}</span>;
  };

  return (
    <div className="flex flex-col items-start mb-4">
      <div className="z-10">
        <KidsDropdown />
      </div>
      <div className="w-full flex justify-between flex-wrap gap-5 items-center my-5">
        <div className="text-[1rem] md:text-xl font-bold">{label()}</div>
        <div className="flex items-center">
          {/* <button onClick={goToBack}>{'<'}</button>
                <button onClick={goToCurrent}>Today</button>
                <button onClick={goToNext}>{'>'}</button> */}
          <span className="ml-4 mr-2">{moment(date).format("MMMM")}</span>
          <ChevronDown size={20} />
          <button className="ml-4 bg-primaryColor text-white px-4 py-2 rounded">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

const EventComponent: React.FC<EventProps<Event>> = ({ event }) => (
  <div className="bg-purple-200 p-1 rounded text-xs">
    <div className="font-bold">{event.title}</div>
    <div>Teacher: {event.teacher}</div>
    <div>
      {moment(event.start).format("HH:mm")} -{" "}
      {moment(event.end).format("HH:mm")}
    </div>
  </div>
);

const ScheduleCalendar: React.FC = () => {
  const [date] = useState<Date>(new Date(2024, 1, 16));

  return (
    <div className="container mx-auto p-1 overflow-auto">
      <div className="min-w-[600px] ">
        <Calendar<Event, object>
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultDate={date}
          defaultView="week"
          views={["week"]}
          min={new Date(2024, 1, 16, 9, 0)}
          max={new Date(2024, 1, 16, 18, 0)}
          timeslots={2}
          step={30}
          toolbar={true}
          components={{
            toolbar: CustomToolbar,
            timeSlotWrapper: ColoredDateCellWrapper,
            event: EventComponent,
          }}
          className="h-screen"
        />
      </div>
    </div>
  );
};

export default ScheduleCalendar;
