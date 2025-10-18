"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, MapPin, Heart, Languages, GraduationCap, Clock, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getParentKidById, getStudentSchedule } from "@/utils/api";

interface IStudentClass {
  _id: string;
  className: string;
  levelType: string;
  classTeacher?: string[];
}

interface ISingleStudent {
  _id: string;
  firstName: string;
  lastName: string;
  class: IStudentClass;
  gender: string;
  language: string;
  dateOfBirth: string;
  address: string;
  aboutMe?: string;
  hobbies: string[];
  photo?: string;
  enrolmentDate: string;
  createdAt: string;
}

interface ScheduleItem {
  _id: string;
  class: string;
  day: string;
  subject: {
    _id: string;
    name: string;
    code: string;
    category: string;
    description: string;
    isActive: boolean;
    prerequisites: string[];
    slug: string;
  };
  teacher: {
    _id: string;
    userId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    subjects: any[];
    isActive: boolean;
  };
  startTime: string;
  endTime: string;
}

interface KidsProfileProps {
  kidId: string | string[];
}

const KidsProfile: React.FC<KidsProfileProps> = ({ kidId }) => {
  const [student, setStudent] = useState<ISingleStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  // Mock results data (replace with real API if available)
  const [results] = useState<any[]>([
    // { _id: "1", subject: "Mathematics", score: 85, grade: "A", term: "First Term", session: "2024/2025", remarks: "Excellent performance" },
    // { _id: "2", subject: "English", score: 78, grade: "B+", term: "First Term", session: "2024/2025", remarks: "Good progress" },
    // { _id: "3", subject: "Science", score: 92, grade: "A+", term: "First Term", session: "2024/2025", remarks: "Outstanding" },
    // { _id: "4", subject: "Social Studies", score: 75, grade: "B", term: "First Term", session: "2024/2025", remarks: "Satisfactory" },
    // { _id: "5", subject: "Physical Education", score: 88, grade: "A", term: "First Term", session: "2024/2025", remarks: "Very good" },
  ]);

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const id = Array.isArray(kidId) ? kidId[0] : kidId;
        const res = await getParentKidById(id);
        setStudent(res.data);
      } catch (error) {
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [kidId]);

  useEffect(() => {
    const fetchSchedule = async () => {
      setScheduleLoading(true);
      try {
        const id = Array.isArray(kidId) ? kidId[0] : kidId;
        const res = await getStudentSchedule(id); // /v1/parent/{id}/schedule
        setSchedule(res.data || []);
      } catch (error) {
        setSchedule([]);
      } finally {
        setScheduleLoading(false);
      }
    };
    fetchSchedule();
  }, [kidId]);


  function formatTime(isoTime: string) {
  const date = new Date(isoTime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


  const getInitials = () => {
    if (!student) return "";
    return `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
  };

  const calculateAverage = () => {
    if (!results.length) return "0.0";
    const total = results.reduce((sum, result) => sum + result.score, 0);
    return (total / results.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading student profile...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Student not found.</span>
      </div>
    );
  }

  // Group schedule by day
  const scheduleByDay: { [day: string]: ScheduleItem[] } = {};
  schedule.forEach((item) => {
    if (!scheduleByDay[item.day]) scheduleByDay[item.day] = [];
    scheduleByDay[item.day].push(item);
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* <Avatar className="h-24 w-24">
                <AvatarImage src={student.photo} alt={`${student.firstName} ${student.lastName}`} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar> */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{student.firstName} {student.lastName}</h1>
                  <Badge variant="outline" className="capitalize">{student.gender}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{student.class && typeof student.class === "object" ? student.class.className : ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Born: {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Enrolled: {student.enrolmentDate ? new Date(student.enrolmentDate).toLocaleDateString() : ""}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{student.firstName} {student.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </p>
                    <p className="font-medium">{student.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-medium">{student.class && typeof student.class === "object" ? student.class?.className : ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level Type</p>
                    <p className="font-medium capitalize">{student.class && typeof student.class === "object" ? student.class?.levelType : ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Enrolment Date</p>
                    <p className="font-medium">{student.enrolmentDate ? new Date(student.enrolmentDate).toLocaleDateString() : ""}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Interests & Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Hobbies & Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {student.hobbies && student.hobbies.map((hobby, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{student.language}</p>
                </CardContent>
              </Card>
            </div>

            {/* About Section */}
            {student.aboutMe && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{student.aboutMe}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          {/* <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {scheduleLoading ? (
                  <div className="py-8 text-center">Loading schedule...</div>
                ) : schedule.length === 0 ? (
                  <div className="py-8 text-center">No schedule found.</div>
                ) : (
                  Object.entries(scheduleByDay).map(([day, periods]) => (
                    <div key={day} className="mb-6">
                      <h3 className="font-semibold text-lg border-b pb-2">{day}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {periods.map((period) => (
                          <div
                            key={period._id}
                            className="p-4 rounded-lg border bg-card"
                          >
                            <h4 className="font-medium">{period.subject.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Teacher: {period.teacher.userId.firstName} {period.teacher.userId.lastName}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(period.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                                {new Date(period.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent> */}


<TabsContent value="schedule" className="mt-6">
  <Card>
    <CardHeader>
      <CardTitle>Weekly Timetable</CardTitle>
    </CardHeader>
    <CardContent>
      {scheduleLoading ? (
        <div className="py-8 text-center">Loading schedule...</div>
      ) : (
        <div className="space-y-6">
          {weekDays.map((day) => {
            const periods = scheduleByDay[day] || [];
            return (
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
                        className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium capitalize">{period.subject.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {period.teacher.userId.firstName} {period.teacher.userId.lastName}
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
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Academic Results</CardTitle>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Overall Average</p>
                    <p className="text-2xl font-bold text-primary">{calculateAverage()}%</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result._id}>
                        <TableCell className="font-medium">{result.subject}</TableCell>
                        <TableCell>{result.score}%</TableCell>
                        <TableCell>
                          <Badge variant={result.score >= 80 ? "default" : "secondary"}>
                            {result.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{result.term}</TableCell>
                        <TableCell className="text-muted-foreground">{result.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KidsProfile;