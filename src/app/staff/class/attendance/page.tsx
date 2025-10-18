"use client";
export const dynamic = 'force-dynamic';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Save, Users, UserCheck, UserX } from "lucide-react";

const Attendance = () => {
  const students = [
    { id: "ADM221-10", name: "Tyrus McVity", present: true },
    { id: "ADM221-11", name: "Sarah Johnson", present: true },
    { id: "ADM221-12", name: "Michael Brown", present: false },
    { id: "ADM221-13", name: "Emily Davis", present: true },
    { id: "ADM221-14", name: "James Wilson", present: true },
  ];

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Attendance</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <span>Home</span>
          <span>›</span>
          <span>Attendance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Attendance Form */}
        <div className="lg:col-span-3">
          <Card className="dashboard-card">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Mark Attendance</h3>
              
              {/* Selection Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select defaultValue="5a">
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5a">5A</SelectItem>
                      <SelectItem value="5b">5B</SelectItem>
                      <SelectItem value="6a">6A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Attendance List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Student Attendance - Class 5A</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Mark All Present
                    </Button>
                    <Button variant="outline" size="sm">
                      Mark All Absent
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Admission No.</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Present/Absent</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td className="font-medium">{student.name}</td>
                          <td>
                            {student.present ? (
                              <Badge className="status-present">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Present
                              </Badge>
                            ) : (
                              <Badge className="status-absent">
                                <UserX className="h-3 w-3 mr-1" />
                                Absent
                              </Badge>
                            )}
                          </td>
                          <td>
                            <Switch 
                              checked={student.present}
                              onCheckedChange={() => {}}
                            />
                          </td>
                          <td>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              Note
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Attendance
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold text-success">{presentCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-success" />
            </div>
          </Card>

          <Card className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent Today</p>
                <p className="text-2xl font-bold text-destructive">{absentCount}</p>
              </div>
              <UserX className="h-8 w-8 text-destructive" />
            </div>
          </Card>

          <Card className="dashboard-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Attendance Rate</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Week</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Month</span>
                  <span className="font-medium">89%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Attendance;