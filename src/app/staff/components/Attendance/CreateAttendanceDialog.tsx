"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { Users2, CalendarRange, CalendarCheck } from "lucide-react";

import { AttendanceRangeSelector } from "./AttendanceRangeSelector";
import { AttendanceClassSelector } from "./AttendanceClassSelector";
import { AttendancePreviewTable } from "./AttendancePreviewTable";

import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { Term, TermDateRange } from "@/types";
import { CancelAttendanceButton } from "./CreateAttendanceButton";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import LoadingStateAttendance from "./LoadingStateAttendance";

interface CreateAttendanceDialogProps {
  controller: any;
  classOptions: any[];
  students: any[];
  academicSessions: string[];
  termRanges: TermDateRange;
}

const termOptions = [
  { value: "first", label: "1st Term" },
  { value: "second", label: "2nd Term" },
  { value: "third", label: "3rd Term" },
];

export default function CreateAttendanceDialog({
  controller,
  classOptions,
  students,
  termRanges,
  academicSessions,
}: CreateAttendanceDialogProps) {
  const {
    open,
    setOpen,
    selectedClass,
    setSelectedClass,
    selectedSession,
    setSelectedSession,
    selectedTerm,
    setSelectedTerm,
    frequency,
    setFrequency,
    range,
    setRange,
    submit,
    loading,
    reset
  } = controller;

  const [tab, setTab] = React.useState("step1");

  const canGoStep2 = selectedClass && selectedSession && selectedTerm;
  const canGoStep3 = canGoStep2 && range;

  const handleTermSelection = (term: Term) => {
    setSelectedTerm(term);

    const tr = termRanges.termDates[term];
    if (!tr) return;

    const today = new Date();
    const start = parseISO(tr.start);
    const end = parseISO(tr.end);

    // If today is inside the term, start from today.
    const computedStart = isWithinInterval(today, { start, end })
      ? today
      : start;

    setRange({
      from: computedStart,
      to: end,
    });
  };

  const handleFrequencyChange = (freq: string, date?: Date) => {
    setFrequency(freq);

    if (!date) return;

    if (freq === "week") {
      setRange({
        from: startOfWeek(date),
        to: endOfWeek(date),
      });
    }

    if (freq === "month") {
      setRange({
        from: startOfMonth(date),
        to: endOfMonth(date),
      });
    }

    if (freq === "term" && selectedTerm) {
      const tr = termRanges.termDates[selectedTerm as Term];
      if (!tr) return;
      const start = parseISO(tr.start);
      const end = parseISO(tr.end);
      setRange({ from: start, to: end });
    }
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogContent className="max-w-4xl min-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Attendance</DialogTitle>
          <DialogDescription>
            Mark attendance for a class over a selected time period.
          </DialogDescription>
        </DialogHeader>

        {loading && <LoadingStateAttendance />}

        <Tabs
          value={tab}
          onValueChange={setTab}
          className="w-full mt-4 flex flex-col"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="step1">
              <Users2 className="w-4 h-4 mr-2" />
              Select Details
            </TabsTrigger>

            <TabsTrigger value="step2" disabled={!canGoStep2}>
              <CalendarRange className="w-4 h-4 mr-2" />
              Select Range
            </TabsTrigger>

            <TabsTrigger value="step3" disabled={!canGoStep3}>
              <CalendarCheck className="w-4 h-4 mr-2" />
              Preview & Create
            </TabsTrigger>
          </TabsList>

          {/* -----------------------------STEP 1: Select Class / Session / Term------------------------------ */}
          <TabsContent value="step1" className="h-[50vh]">
            <ScrollArea className="h-full pr-4">
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1 space-y-6">
                  {/* Select Class */}
                  <AttendanceClassSelector
                    value={selectedClass}
                    classes={classOptions}
                    onChange={(v: string) => setSelectedClass(v)}
                  />

                  {/* Select Academic Session */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Academic Session
                    </label>
                    <select
                      className="border rounded-md p-2 w-full bg-background"
                      value={selectedSession || ""}
                      onChange={(e) => setSelectedSession(e.target.value)}
                    >
                      <option value="">Select Session</option>
                      {academicSessions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Term */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Term</label>
                    <select
                      className="border rounded-md p-2 w-full bg-background"
                      value={selectedTerm || ""}
                      onChange={(e) =>
                        handleTermSelection(e.target.value as Term)
                      }
                    >
                      <option value="">Select Term</option>
                      {termOptions.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={() => canGoStep2 && setTab("step2")}
                    disabled={!canGoStep2}
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>

                {/* Right Side Illustration */}
                <div className="hidden md:flex flex-1 items-center justify-center bg-muted/30 rounded-xl p-6">
                  <div className="text-center space-y-3">
                    <Users2 className="w-20 h-20 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-semibold">Choose Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Select the class, academic session, and term. Attendance
                      range will be generated automatically from your chosen
                      term.
                    </p>
                  </div>
                </div>
              </div>
              <ScrollBar orientation="vertical" hidden />
            </ScrollArea>
          </TabsContent>

          {/* -----------------------------STEP 2 — Range Selection------------------------ */}
          <TabsContent value="step2" className="h-[50vh]">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-6 h-full">
                <AttendanceRangeSelector
                  frequency={frequency}
                  onFrequencyChange={handleFrequencyChange}
                  onSelectRange={(r: any) => {
                    setRange(r);
                  }}
                  currentRange={range}
                  termRange={termRanges}
                  selectedTerm={selectedTerm}
                />

                <Button
                  onClick={() => canGoStep3 && setTab("step3")}
                  disabled={!range}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* ----------------------------- STEP 3 — Preview & Create------------------------------ */}
          <TabsContent value="step3" className="h-[50vh]">
            <ScrollArea className="h-full rounded-lg pr-4">
              <div className="space-y-6 pb-10">
                <AttendancePreviewTable students={students} />

                <Button onClick={submit} className="w-full">
                  Create Attendance
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="max-h-5 ">
          <CancelAttendanceButton onClick={() => {setOpen(false);reset}} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
