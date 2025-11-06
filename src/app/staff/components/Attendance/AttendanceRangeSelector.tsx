"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  isBefore,
  isAfter,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";
import { generateBusinessDayDates } from "@/utils/lib";
import { TermDateRange, Term } from "@/types";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";

interface AttendanceRangeSelectorProps {
  frequency: string;
  termRange?: TermDateRange | null;
  currentRange: {
    from: Date | null;
    to: Date | null;
    validDays?: Date[];
  } | null;
  selectedTerm: Term;

  onFrequencyChange: (frequency: string) => void;
  onSelectRange: (range: { from: Date; to: Date; validDays: Date[] }) => void;
}

export function AttendanceRangeSelector({
  frequency,
  currentRange,
  onFrequencyChange,
  onSelectRange,
  termRange,
  selectedTerm,
}: AttendanceRangeSelectorProps) {
  const [customRange, setCustomRange] = useState<any>(null);
  const today = new Date();

  const term = termRange?.termDates[selectedTerm];
  const sessionRange = {
    from: new Date(termRange?.termDates.first?.start ?? new Date()),
    to: new Date(termRange?.termDates.third?.end ?? new Date()),
  };

  // Sync parent → local
  useEffect(() => {
    if (currentRange) setCustomRange(currentRange);
  }, [currentRange]);

  const removeWeekends = (from: Date, to: Date) => {
    const days = eachDayOfInterval({ start: from, end: to });
    return days.filter((d) => !isWeekend(d));
  };

  const selectRange = (from: Date, to: Date) => {
    const validDays = removeWeekends(from, to);
    onSelectRange({ from, to, validDays });
  };

  const computeWeek = () => {
    const start = today;
    const end = endOfWeek(today);
    selectRange(start, end);
  };

  const computeBusinessWeek = () => {
    const { start, end } = generateBusinessDayDates(5);
    selectRange(new Date(start), new Date(end));
  };

  const computeMonth = () => {
    const start = today;
    const end = endOfMonth(today);
    selectRange(start, end);
  };

  const computeNext7BusinessDays = () => {
    const { start, end } = generateBusinessDayDates(7);
    selectRange(new Date(start), new Date(end));
  };

  const computeNext30BusinessDays = () => {
    const { start, end } = generateBusinessDayDates(30);
    selectRange(new Date(start), new Date(end));
  };

  const computeNextWeek = () => {
    // Start next Monday
    const nextMonday = addDays(today, (8 - today.getDay()) % 7);
    const nextFriday = addDays(nextMonday, 4);
    selectRange(nextMonday, nextFriday);
  };

  const computeTerm = () => {
    if (!termRange || !term) return;
    const { start, end } = term;
    selectRange(new Date(start), new Date(end));
  };

  const computeHalfTerm = () => {
    if (!termRange || !term) return;
    const { start, end } = term;
    const mid = addDays(
      start,
      Math.floor(
        (new Date(end).getTime() - new Date(start).getTime()) /
          (1000 * 60 * 60 * 24 * 2)
      )
    );
    selectRange(new Date(start), new Date(mid));
  };

  const computeSession = () => {
    if (!sessionRange) return;
    const { from, to } = sessionRange;
    selectRange(from, to);
  };

  const PRESETS = [
    { key: "week", label: "Week", handler: computeWeek },
    {
      key: "business-week",
      label: "Business Week",
      handler: computeBusinessWeek,
    },
    { key: "month", label: "Month", handler: computeMonth },
    {
      key: "rolling-7",
      label: "Rolling 7 Business Days",
      handler: computeNext7BusinessDays,
    },
    {
      key: "next-week",
      label: "Next Week (Mon–Fri)",
      handler: computeNextWeek,
    },
    {
      key: "rolling-30",
      label: "Next 30 Business Days",
      handler: computeNext30BusinessDays,
    },
    { key: "term", label: "Full Term", handler: computeTerm },
    { key: "half-term", label: "Half Term", handler: computeHalfTerm },
    { key: "session", label: "Full Session", handler: computeSession },
    { key: "custom", label: "Custom", handler: () => {} },
  ];

  const selectPreset = (presetKey: string) => {
    onFrequencyChange(presetKey);
    const preset = PRESETS.find((p) => p.key === presetKey);
    if (preset && preset.key !== "custom") preset.handler();
  };

  return (
    <div className="space-y-6">
      <p className="font-semibold text-sm">Select Attendance Period</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p.key}
            variant={frequency === p.key ? "default" : "outline"}
            onClick={() => selectPreset(p.key)}
            className="text-xs capitalize"
          >
            {p.label}
          </Button>
        ))}
      </div>

      {currentRange?.from && currentRange?.to && (
        <div className="border bg-muted/20 rounded-md p-3">
          <p className="text-sm font-medium">Selected:</p>
          <p className="text-sm text-muted-foreground mt-1">
            {currentRange.from.toDateString()} →{" "}
            {currentRange.to.toDateString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Valid school days: {currentRange?.validDays?.length}
          </p>
        </div>
      )}

      {frequency === "custom" && (
        <div className="border rounded-md">
          <ScrollArea className="max-w-[53rem] overflow-x-auto overflow-y-hidden whitespace-nowrap">
            <Calendar
              mode="range"
              numberOfMonths={12}
              selected={customRange}
              disabled={{ before: today }}
              onSelect={(range: any) => {
                setCustomRange(range);

                if (range?.from && range?.to) {
                  const from = new Date(range.from);
                  const to = new Date(range.to);

                  if (isAfter(from, to)) return;

                  selectRange(from, to);
                }
              }}
            />
            <Scrollbar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
