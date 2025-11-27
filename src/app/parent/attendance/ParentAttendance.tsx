"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CalendarIcon,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";

type AttendanceStatus = "present" | "absent" | "late" | "excused" | "early_dismissal";

interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  reason?: string;
  subject?: string;
}

interface Child {
  id: string;
  name: string;
  class: string;
  photo?: string;
}

// Mock data
const mockChildren: Child[] = [
  { id: "1", name: "John Doe", class: "JSS 1A" },
  { id: "2", name: "Jane Doe", class: "Primary 5B" },
];

const generateMockAttendance = (childId: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const startDate = subMonths(today, 2);

  const days = eachDayOfInterval({ start: startDate, end: today });

  days.forEach((day, index) => {
    // Skip weekends
    if (day.getDay() === 0 || day.getDay() === 6) return;

    const random = Math.random();
    let status: AttendanceStatus;
    let checkInTime: string | undefined;
    let checkOutTime: string | undefined;
    let reason: string | undefined;

    if (random < 0.75) {
      status = "present";
      checkInTime = "07:45 AM";
      checkOutTime = "03:30 PM";
    } else if (random < 0.85) {
      status = "late";
      checkInTime = "08:15 AM";
      checkOutTime = "03:30 PM";
      reason = "Traffic delay";
    } else if (random < 0.92) {
      status = "absent";
      reason = "Sick";
    } else if (random < 0.96) {
      status = "excused";
      reason = "Medical appointment";
    } else {
      status = "early_dismissal";
      checkInTime = "07:45 AM";
      checkOutTime = "01:00 PM";
      reason = "Family emergency";
    }

    records.push({
      id: `${childId}-${index}`,
      date: format(day, "yyyy-MM-dd"),
      status,
      checkInTime,
      checkOutTime,
      reason,
    });
  });

  return records.reverse();
};

const getStatusBadge = (status: AttendanceStatus) => {
  const config = {
    present: {
      label: "Present",
      variant: "default" as const,
      className: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    },
    absent: {
      label: "Absent",
      variant: "destructive" as const,
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    },
    late: {
      label: "Late",
      variant: "secondary" as const,
      className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
    },
    excused: {
      label: "Excused",
      variant: "outline" as const,
      className: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    },
    early_dismissal: {
      label: "Early Dismissal",
      variant: "outline" as const,
      className: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    },
  };

  const { label, className } = config[status];
  return <Badge className={className}>{label}</Badge>;
};

const getStatusIcon = (status: AttendanceStatus) => {
  const config = {
    present: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    absent: <XCircle className="h-4 w-4 text-destructive" />,
    late: <Clock className="h-4 w-4 text-amber-600" />,
    excused: <AlertTriangle className="h-4 w-4 text-blue-600" />,
    early_dismissal: <Clock className="h-4 w-4 text-purple-600" />,
  };
  return config[status];
};

const ParentAttendance = () => {
  const [selectedChild, setSelectedChild] = useState<string>(mockChildren[0].id);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const attendanceRecords = useMemo(() => generateMockAttendance(selectedChild), [selectedChild]);

  const currentChild = mockChildren.find((c) => c.id === selectedChild);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r) => r.status === "present").length;
    const absent = attendanceRecords.filter((r) => r.status === "absent").length;
    const late = attendanceRecords.filter((r) => r.status === "late").length;
    const excused = attendanceRecords.filter((r) => r.status === "excused").length;
    const earlyDismissal = attendanceRecords.filter((r) => r.status === "early_dismissal").length;

    return {
      total,
      present,
      absent,
      late,
      excused,
      earlyDismissal,
      attendanceRate:
        total > 0 ? (((present + late + earlyDismissal) / total) * 100).toFixed(1) : "0",
      punctualityRate: total > 0 ? ((present / total) * 100).toFixed(1) : "0",
    };
  }, [attendanceRecords]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      const matchesStatus = filterStatus === "all" || record.status === filterStatus;
      const matchesDateRange =
        (!dateRange.from || recordDate >= dateRange.from) &&
        (!dateRange.to || recordDate <= dateRange.to);
      return matchesStatus && matchesDateRange;
    });
  }, [attendanceRecords, filterStatus, dateRange]);

  // Calendar data for the month view
  const monthDays = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start, end });
  }, [selectedMonth]);

  const getAttendanceForDate = (date: Date) => {
    return attendanceRecords.find((r) => isSameDay(new Date(r.date), date));
  };

  const handleExportReport = () => {
    // Placeholder for export functionality
    console.log("Exporting attendance report...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Child Attendance</h1>
          <p className="text-muted-foreground">
            Monitor your child's attendance records and statistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[200px]">
              <User className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {mockChildren.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name} - {child.class}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Overall attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
            <p className="text-xs text-muted-foreground">Days on time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">Days missed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground">Late arrivals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excused</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
            <p className="text-xs text-muted-foreground">Excused absences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Early Dismissal</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.earlyDismissal}</div>
            <p className="text-xs text-muted-foreground">Left early</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Visual attendance calendar for {currentChild?.name}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[140px] text-center">
                {format(selectedMonth, "MMMM yyyy")}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Add empty cells for days before the first of the month */}
            {Array.from({ length: startOfMonth(selectedMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 h-16" />
            ))}
            {monthDays.map((day) => {
              const attendance = getAttendanceForDate(day);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 h-16 rounded-lg border text-center flex flex-col items-center justify-center gap-1 ${
                    isWeekend
                      ? "bg-muted/30 text-muted-foreground"
                      : attendance
                        ? "bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                        : "bg-card"
                  }`}
                >
                  <span className="text-sm">{format(day, "d")}</span>
                  {attendance && !isWeekend ? (
                    <div className="flex items-center justify-center">
                      {getStatusIcon(attendance.status)}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-sm">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Excused</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Early Dismissal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Records Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Detailed attendance records</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                  <SelectItem value="early_dismissal">Early Dismissal</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Reason/Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.slice(0, 20).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {format(new Date(record.date), "EEE, MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.checkInTime || "-"}</TableCell>
                    <TableCell>{record.checkOutTime || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{record.reason || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No attendance records found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredRecords.length > 20 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing 20 of {filteredRecords.length} records
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentAttendance;
