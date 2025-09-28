'use client';
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Download, Printer, Filter, Loader2 } from "lucide-react";
import { useTimetable } from "@/hooks/useTimeTable";
import { ClassSchedule } from "@/types";

const Timetable = () => {
  const { schedules, loading, error, refetch } = useTimetable();
  const [filter, setFilter] = useState("all");

  // Define standard time slots for the school day
  const timeSlots = [
    "8:00 - 8:45 AM",
    "8:45 - 9:30 AM", 
    "9:30 - 10:15 AM",
    "10:15 - 10:30 AM", // Break
    "10:30 - 11:15 AM",
    "11:15 - 12:00 PM",
    "12:00 - 12:45 PM",
    "12:45 - 1:30 PM", // Lunch
    "1:30 - 2:15 PM",
    "2:15 - 3:00 PM",
  ];

  // Convert time slot string to Date objects for comparison
  const parseTimeSlot = (timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split(' - ');
    const now = new Date();
    
    // Parse start time
    const [startHourMin, startPeriod] = startTime.split(' ');
    const [startHour, startMin] = startHourMin.split(':').map(Number);
    let startHour24 = startHour;
    if (startPeriod === 'PM' && startHour !== 12) startHour24 += 12;
    if (startPeriod === 'AM' && startHour === 12) startHour24 = 0;
    
    // Parse end time
    const [endHourMin, endPeriod] = endTime.split(' ');
    const [endHour, endMin] = endHourMin.split(':').map(Number);
    let endHour24 = endHour;
    if (endPeriod === 'PM' && endHour !== 12) endHour24 += 12;
    if (endPeriod === 'AM' && endHour === 12) endHour24 = 0;
    
    const startDate = new Date(now);
    startDate.setHours(startHour24, startMin, 0, 0);
    
    const endDate = new Date(now);
    endDate.setHours(endHour24, endMin, 0, 0);
    
    return { start: startDate, end: endDate };
  };

  // Group schedules by day
  const groupSchedulesByDay = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const grouped: { [key: string]: ClassSchedule[] } = {};
    
    days.forEach(day => {
      grouped[day] = schedules.filter(schedule => 
        schedule.day.toLowerCase() === day.toLowerCase()
      );
    });
    
    return grouped;
  };

  // Find current and next classes
  const getCurrentClassesInfo = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    const todaySchedules = schedules.filter(schedule => 
      schedule.day.toLowerCase() === currentDay.toLowerCase()
    );
    
    const currentClass = todaySchedules.find(schedule => {
      const start = new Date(schedule.startTime);
      const end = new Date(schedule.endTime);
      return now >= start && now <= end;
    });
    
    const nextClass = todaySchedules.find(schedule => {
      const start = new Date(schedule.startTime);
      return start > now;
    });
    
    const completedClasses = todaySchedules.filter(schedule => {
      const end = new Date(schedule.endTime);
      return end < now;
    }).length;
    
    return { currentClass, nextClass, completedClasses, totalToday: todaySchedules.length };
  };

  const schedulesByDay = groupSchedulesByDay();
  const { currentClass, nextClass, completedClasses, totalToday } = getCurrentClassesInfo();

  // Check if a schedule falls within a time slot
  const getScheduleForTimeSlot = (schedules: ClassSchedule[], timeSlot: string) => {
    const slot = parseTimeSlot(timeSlot);
    
    return schedules.find(schedule => {
      const scheduleStart = new Date(schedule.startTime);
      const scheduleEnd = new Date(schedule.endTime);
      
      // Check if schedule overlaps with the time slot
      return scheduleStart < slot.end && scheduleEnd > slot.start;
    });
  };

  const getSubjectColor = (subjectName: string) => {
    const colorMap: { [key: string]: string } = {
      arabic: "bg-blue-100 text-blue-800 border-blue-200",
      mathematics: "bg-green-100 text-green-800 border-green-200",
      physics: "bg-purple-100 text-purple-800 border-purple-200",
      chemistry: "bg-yellow-100 text-yellow-800 border-yellow-200",
      english: "bg-red-100 text-red-800 border-red-200",
      biology: "bg-emerald-100 text-emerald-800 border-emerald-200",
      science: "bg-orange-100 text-orange-800 border-orange-200",
      history: "bg-indigo-100 text-indigo-800 border-indigo-200",
      geography: "bg-pink-100 text-pink-800 border-pink-200",
    };
    
    return colorMap[subjectName.toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Timetable</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>Home</span>
              <span>›</span>
              <span>Timetable</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading timetable...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Timetable</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>Home</span>
              <span>›</span>
              <span>Timetable</span>
            </div>
          </div>
        </div>
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Timetable</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>Home</span>
            <span>›</span>
            <span>Timetable</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label>Filter by:</Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="subject">Subject</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Current Class Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Class</p>
              <p className="text-lg font-semibold">
                {currentClass ? currentClass.subject.name : 'No class'}
              </p>
              <p className="text-sm text-primary">
                {currentClass ? `${formatTime(currentClass.startTime)} - ${formatTime(currentClass.endTime)}` : 'Free period'}
              </p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Next Class</p>
              <p className="text-lg font-semibold">
                {nextClass ? nextClass.subject.name : 'No more classes'}
              </p>
              <p className="text-sm text-orange-500">
                {nextClass ? `Starts at ${formatTime(nextClass.startTime)}` : 'Day ended'}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Classes Today</p>
              <p className="text-2xl font-bold">{totalToday}</p>
              <p className="text-sm text-green-500">{completedClasses} Completed</p>
            </div>
            <Badge variant={currentClass ? "default" : "outline"}>
              {currentClass ? "Active" : "Inactive"}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Weekly Timetable */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Weekly Schedule</h3>
          
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No schedule data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 border-b font-medium text-sm bg-muted/50 w-32">Time</th>
                    {Object.keys(schedulesByDay).map((day) => (
                      <th key={day} className="text-center p-3 border-b font-medium text-sm bg-muted/50 min-w-32">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((timeSlot, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/20">
                        {timeSlot}
                      </td>
                      {Object.entries(schedulesByDay).map(([day, daySchedules]) => {
                        const schedule = getScheduleForTimeSlot(daySchedules, timeSlot);
                        
                        return (
                          <td key={day} className="p-2 text-center">
                            {schedule ? (
                              <div className={`
                                px-2 py-1 rounded text-xs font-medium border transition-all
                                ${getSubjectColor(schedule.subject.name)}
                                hover:shadow-sm cursor-pointer
                              `}>
                                <div className="font-semibold">{schedule.subject.name}</div>
                                <div className="text-xs opacity-75 mt-0.5">
                                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                </div>
                                <div className="text-xs opacity-75">
                                  Class {schedule.class}
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground py-2">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Subject Legend */}
      {schedules.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subject Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Array.from(new Set(schedules.map(s => s.subject.name))).map((subject) => (
                <div key={subject} className={`px-2 py-1 rounded text-xs font-medium border text-center ${getSubjectColor(subject)}`}>
                  {subject}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Timetable;