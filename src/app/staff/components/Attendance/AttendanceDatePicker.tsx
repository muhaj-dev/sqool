"use client";

import React from "react";
import { Calendar,ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAttendanceStore } from "@/zustand/staff/useAttendanceStore";

export function AttendanceDatePicker() {
  const { startDate, endDate, setDate } = useAttendanceStore();

  // HYDRATION CHECK
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const from = startDate ? new Date(startDate) : undefined;
  const to = endDate ? new Date(endDate) : undefined;
  const hasValidRange =
    from instanceof Date && !isNaN(from.getTime()) &&
    to instanceof Date && !isNaN(to.getTime());
    
  if (!hydrated) {
    return (
      <Button
        variant="outline"
        className="w-[240px] justify-start text-left font-normal text-muted-foreground"
        disabled
      >
        <Calendar className="mr-2 h-4 w-4" />
        Pick a date
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !hasValidRange && "text-muted-foreground"
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {hasValidRange ? (
            <span className="break-words flex items-center gap-1">
              {format(from!, "yyyy-MM-dd")} <ArrowRight size={2}/> {format(to!, "yyyy-MM-dd")}
            </span>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="range"
          selected={{ from: from, to: to }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              setDate(range.from, range.to);
            }
          }}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
