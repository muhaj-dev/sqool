"use client";

import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, isAfter, isWeekend } from "date-fns";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { type AcademicSessionTerms, type Frequency, type Term, type TermDateRange } from "@/types";
import { generateBusinessDayDates } from "@/utils/lib";
import { type DateRange } from "react-day-picker";

export interface AttendanceRangeSelectorProps {
  frequency: Frequency;
  termRange?: AcademicSessionTerms | null;
  currentRange: {
    from: Date | string | null;
    to: Date | string | null;
    validDays?: Date[];
  } | null;
  selectedTerm: TermDateRange;
  selectedSession: string;

  onFrequencyChange: (frequency: Frequency) => void;
  onSelectRange: (range: { from: Date; to: Date; validDays: Date[] }) => void;
}

export function AttendanceRangeSelector({
  frequency,
  currentRange,
  onFrequencyChange,
  onSelectRange,
  termRange,
  selectedTerm,
  selectedSession,
}: AttendanceRangeSelectorProps) {
  const [customRange, setCustomRange] = useState<
    AttendanceRangeSelectorProps["currentRange"] | null
  >(null);
  const today = new Date();
  const term = Object.keys(selectedTerm.termDates)[0] as Term;
  const range = termRange?.[selectedSession]?.termDates?.[term];
  const sessionRange = {
    from: new Date(range?.start ?? new Date()),
    to: new Date(range?.end ?? new Date()),
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
    if (!termRange || !range) return;
    const { start, end } = range;
    selectRange(new Date(start), new Date(end));
  };

  const computeHalfTerm = () => {
    if (!termRange || !term) return;
    const { start, end } = range!;
    const mid = addDays(
      start,
      Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 2)),
    );
    selectRange(new Date(start), new Date(mid));
  };

  const computeSession = () => {
    if (!sessionRange) return;
    const { from, to } = sessionRange;
    selectRange(from, to);
  };

  const computeCustom = () => {
    // No-op, handled by calendar
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
    { key: "custom", label: "Custom", handler: computeCustom },
  ];

  const selectPreset = (presetKey: string) => {
    onFrequencyChange(presetKey as Frequency);
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

      {currentRange?.from && currentRange?.to ? (
        <div className="border bg-muted/20 rounded-md p-3">
          <p className="text-sm font-medium">Selected:</p>
          <p className="text-sm text-muted-foreground mt-1">
            {(currentRange.from as Date).toDateString()} →{" "}
            {(currentRange.to as Date).toDateString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Valid school days: {currentRange?.validDays?.length}
          </p>
        </div>
      ) : null}

      {frequency === "custom" && (
        <div className="border rounded-md">
          <ScrollArea className="max-w-[53rem] overflow-x-auto overflow-y-hidden whitespace-nowrap">
            <Calendar
              mode="range"
              numberOfMonths={12}
              selected={customRange as DateRange}
              disabled={{ before: today }}
              onSelect={(range: DateRange | undefined) => {
                setCustomRange(range as AttendanceRangeSelectorProps["currentRange"]);

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
