"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import React, { useState } from "react";

interface CalendarEvent {
  id: number;
  text: string;
  color: string;
}

const CalendarWithCheckboxes: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<CalendarEvent[]>([
    { id: 1, text: "Lorem ipsum dolor sit amet", color: "bg-blue-500" },
    { id: 2, text: "Lorem ipsum dolor sit amet", color: "bg-cyan-500" },
    { id: 3, text: "Lorem ipsum dolor sit amet", color: "bg-orange-500" },
    { id: 4, text: "Lorem ipsum dolor sit amet", color: "bg-red-500" },
    { id: 5, text: "Lorem ipsum dolor sit amet", color: "bg-green-500" },
    { id: 6, text: "Lorem ipsum dolor sit amet", color: "bg-sky-500" },
  ]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();
      days.push(
        <div
          key={day}
          className={`h-8 flex items-center justify-center ${isToday ? "bg-yellow-400 rounded-full" : ""}`}
        >
          {day}
        </div>,
      );
    }
    return days;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-2">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={nextMonth} className="p-2">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="font-medium text-gray-500">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Calendar Details</h2>
            <button className="p-2 bg-yellow-400 rounded-full">
              <Plus size={20} />
            </button>
          </div>
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className={`form-checkbox h-5 w-5 accent-[${event.color}] rounded`}
                />
                <span>{event.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarWithCheckboxes;
