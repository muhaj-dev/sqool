'use client';
import { useState,
    useRef,
  useEffect
 } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Download, Printer, Filter, Loader2 } from "lucide-react";
import { useTimetable } from "@/hooks/useTimeTable";
import { ClassSchedule } from "@/types";
import html2pdf from "html2pdf.js";
import { getSubjectsForStaff } from "@/utils/api";


const Timetable = () => {
  const { schedules, loading, error, refetch } = useTimetable();
  const [filter, setFilter] = useState("all");
const timetableRef = useRef<HTMLDivElement>(null);

  const [staffSubjects, setStaffSubjects] = useState<any[]>([]);
  const [subjectLoading, setSubjectLoading] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectLoading(true);
      try {
        const res = await getSubjectsForStaff(1, "");
        setStaffSubjects(res.data || []);
      } catch {
        setStaffSubjects([]);
      } finally {
        setSubjectLoading(false);
      }
    };
    fetchSubjects();
  }, []);


  const handleDownloadPDF = () => {
    if (timetableRef.current) {
      html2pdf().from(timetableRef.current).save("timetable.pdf");
    }
  };

  const handlePrint = () => {
    if (timetableRef.current) {
      const printContents = timetableRef.current.innerHTML;
      const printWindow = window.open("", "", "height=600,width=800");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Print Timetable</title></head><body>");
        printWindow.document.write(printContents);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };
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
          {/* <div className="flex items-center gap-2">
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
          </div> */}
          {/* <Button 
          
          onClick={handlePrint}
          variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
           onClick={handleDownloadPDF}
          variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button> */}
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
      <Card>
  <CardHeader>
    <CardTitle>Weekly Timetable</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      {Object.entries(schedulesByDay).map(([day, periods]) => (
        <div key={day} className="space-y-3">
          <h3 className="font-semibold text-lg border-b pb-2">{day}</h3>
          {periods.length === 0 ? (
            <div className="p-4 rounded-lg border border-dashed bg-muted/50 text-center text-muted-foreground">
              No classes scheduled for {day}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {periods.map((period) => (
                <div
                  key={period._id}
                  className={`p-4 rounded-lg border bg-card hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium capitalize">{period.subject.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {period.teacher?.userId?.firstName} {period.teacher?.userId?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {formatTime(period.startTime)} - {formatTime(period.endTime)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </CardContent>
</Card>

       {/* Subject Legend */}
       <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Subject </h3>
          {subjectLoading ? (
            <div className="text-muted-foreground">Loading subjects...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {staffSubjects.map((subject) => (
                <div
                  key={subject._id}
                  className={`px-2 py-1 rounded text-xs font-medium border text-center ${getSubjectColor(subject.name)}`}
                >
                  <div className="font-semibold capitalize">{subject.name}</div>
                  {/* <div className="text-muted-foreground text-xs">{subject.code}</div> */}
                  {/* <div className="text-muted-foreground text-xs">{subject.category}</div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Timetable;