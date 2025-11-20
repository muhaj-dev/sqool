"use client";

import React from "react";

import {
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarCheck, CalendarRange, Users2 } from "lucide-react";

import { AttendanceClassSelector } from "@/app/staff/components/attendance/AttendanceClassSelector";
import { AttendancePreviewTable } from "@/app/staff/components/attendance/AttendancePreviewTable";
import {
  AttendanceRangeSelector,
  type AttendanceRangeSelectorProps,
} from "@/app/staff/components/attendance/AttendanceRangeSelector";
import LoadingStateAttendance from "@/components/LoadingState";
import MessageDialog from "@/components/message-dialog";
import { ReusableSelect } from "@/components/select-resuable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type AcademicSessionTerms,
  type Frequency,
  type StudentAttendance,
  type Term,
  type TermDateRange,
} from "@/types";
import { type useAttendanceStore } from "@/zustand/staff/useAttendanceStore";

import { type useAttendanceCreate } from "../../hooks/useAttendanceCreate";
import { CancelAttendanceButton } from "./CreateAttendanceButton";

type Controller = ReturnType<typeof useAttendanceCreate> &
  Omit<
    ReturnType<typeof useAttendanceStore>,
    | "selectedClass"
    | "setSelectedClass"
    | "selectedSession"
    | "setSelectedSession"
    | "selectedTerm"
    | "setSelectedTerm"
  > & {
    selectedClass: string;
    setSelectedClass: (classId: string) => void;
    selectedSession: string;
    setSelectedSession: (session: string) => void;
    selectedTerm: TermDateRange;
    setSelectedTerm: (term: TermDateRange) => void;
  };

interface CreateAttendanceDialogProps {
  controller: Controller;
  classOptions: { id: string; name: string }[];
  students: StudentAttendance[];
  academicSessions: string[];
  termRanges: AcademicSessionTerms;
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
  academicSessions, //1st item in the array is the current session
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
    reset,
  } = controller;

  const [tab, setTab] = React.useState("step1");

  const canGoStep2 = selectedClass && selectedSession && selectedTerm;
  const canGoStep3 = canGoStep2 && range;

  const handleTermSelection = (term: Term) => {
    const currentSession = selectedSession || academicSessions[0];

    const tr = termRanges?.[currentSession]?.termDates?.[term];

    if (!tr) return;

    setSelectedTerm({
      termDates: { [term]: tr },
    });

    const today = new Date();
    const start = parseISO(tr.start);
    const end = parseISO(tr.end);

    // If today is inside the term, start from today.
    const computedStart = isWithinInterval(today, { start, end }) ? today : start;

    setRange({
      from: computedStart,
      to: end,
    });
  };

  const handleFrequencyChange = (freq: Frequency, date?: Date) => {
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
      const currentSession = selectedSession || academicSessions[0];
      const term = (Object.keys(selectedTerm.termDates)[0] ?? null) as Term | null;
      if (!term) return;
      const tr = termRanges?.[currentSession]?.termDates?.[term];

      if (!tr) return;
      const start = parseISO(tr.start);
      const end = parseISO(tr.end);
      setRange({ from: start, to: end });
    }
  };

  if (students.length === 0 && selectedTerm && selectedSession && selectedClass) {
    //configuration of school error, no students present for attendance in that class
    return (
      <MessageDialog
        open={open}
        onOpenChange={setOpen}
        type="warning"
        title="Critical Warning"
        message="There are no students currently present in this class. Refer to your admin and retify assigning students to you."
      />
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        !loading
          ? setOpen
          : () => {
              return 2;
            }
      }
    >
      <DialogContent className="max-w-4xl min-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Attendance</DialogTitle>
          <DialogDescription>
            Mark attendance for a class over a selected time period.
          </DialogDescription>
        </DialogHeader>

        {loading ? <LoadingStateAttendance title="Creating attendance..." /> : null}

        <Tabs value={tab} onValueChange={setTab} className="w-full mt-4 flex flex-col">
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
                  <ReusableSelect
                    label="Academic Session"
                    value={selectedSession || ""}
                    onChange={(e) => setSelectedSession(e)}
                    options={academicSessions.map((c) => ({
                      label: c,
                      value: c,
                    }))}
                    placeholder="Select Session..."
                  />

                  {/* Select Term */}
                  <ReusableSelect
                    label="Term"
                    value={Object.keys(selectedTerm.termDates)[0] || ""}
                    onChange={(e) => handleTermSelection(e as Term)}
                    options={termOptions.map((c) => ({
                      label: c.label,
                      value: c.value,
                    }))}
                    placeholder="Select Term..."
                  />

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
                      Select the class, academic session, and term. Attendance range will be
                      generated automatically from your chosen term.
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
                  frequency={frequency as Frequency}
                  onFrequencyChange={handleFrequencyChange}
                  onSelectRange={(r: AttendanceRangeSelectorProps["currentRange"]) => {
                    setRange(r);
                  }}
                  currentRange={range}
                  termRange={termRanges}
                  selectedTerm={selectedTerm}
                  selectedSession={selectedSession}
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

                {}
                {/* <Button onClick={() => submit()} className="w-full">
                  Create Attendance
                </Button> */}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="max-h-5 ">
          <CancelAttendanceButton
            onClick={() => {
              setOpen(false);
              reset();
            }}
            disabled={loading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
