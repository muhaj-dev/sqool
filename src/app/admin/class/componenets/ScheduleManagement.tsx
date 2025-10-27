'use client'

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClassSchedule, getClassSchedule, updateClassSchedule, deleteClassSchedule } from "@/utils/api";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface ClassSchedulesProps {
  classData: any;
}

interface SchedulePeriod {
  _id: string;
  day: string;
  subject: {
    _id: string;
    name: string;
  };
  teacher: {
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  };
  startTime: string;
  endTime: string;
  room?: string;
}

export const ScheduleManagement = ({ classData }: ClassSchedulesProps) => {
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<SchedulePeriod[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<SchedulePeriod | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<SchedulePeriod | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state for new/edited schedule
  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    // room: "",
    subject: "",
    teacher: "",
  });

  const subjects = classData?.subjects || [];
  const teachers =
    classData?.tutors?.map((t: any) => ({
      id: t.teacher?._id,
      name: `${t.teacher?.userId?.firstName} ${t.teacher?.userId?.lastName}`,
    })) || [];

  // Fetch schedules on component mount
  useEffect(() => {
    fetchSchedules();
  }, [classData]);

  const fetchSchedules = async () => {
    if (!classData?._id) return;
    
    setLoadingSchedules(true);
    try {
      const response = await getClassSchedule(classData._id);
      setSchedules(response.data || []);
    } catch (error: any) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const openEditModal = (schedule: SchedulePeriod) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      dayOfWeek: schedule.day,
      startTime: formatTimeForInput(schedule.startTime),
      endTime: formatTimeForInput(schedule.endTime),
      // room: schedule.room || "",
      subject: schedule.subject._id,
      teacher: schedule.teacher._id,
    });
    setModalOpen(true);
  };

  const openDeleteModal = (schedule: SchedulePeriod) => {
    setDeletingSchedule(schedule);
    setDeleteModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSchedule(null);
    setScheduleForm({
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      // room: "",
      subject: "",
      teacher: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingSchedule(null);
  };

  // Group schedules by day
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const day = schedule.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(schedule);
    return acc;
  }, {} as Record<string, SchedulePeriod[]>);

  // Ensure all week days are present in the grouped schedules
  const weeklySchedule = weekDays.reduce((acc, day) => {
    acc[day] = groupedSchedules[day] || [];
    return acc;
  }, {} as Record<string, SchedulePeriod[]>);

  function toISOTime(time: string) {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date.toISOString();
  }

  function formatTime(isoTime: string) {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatTimeForInput(isoTime: string) {
    const date = new Date(isoTime);
    return date.toTimeString().slice(0, 5);
  }

  const handleSubmitSchedule = async () => {
    if (
      !scheduleForm.dayOfWeek ||
      !scheduleForm.startTime ||
      !scheduleForm.endTime ||
      !scheduleForm.subject ||
      !scheduleForm.teacher
    ) {
      return;
    }

    setLoading(true);
    try {
      if (editingSchedule) {
        // Update existing schedule - only send required fields
        await updateClassSchedule(classData._id, {
          day: scheduleForm.dayOfWeek,
          subject: scheduleForm.subject,
          teacher: scheduleForm.teacher,
          startTime: toISOTime(scheduleForm.startTime),
          endTime: toISOTime(scheduleForm.endTime),
          id: editingSchedule._id
        });
      } else {
        // Create new schedule - send all required fields including class ID
        await createClassSchedule({
          class: classData._id,
          day: scheduleForm.dayOfWeek,
          subject: scheduleForm.subject,
          teacher: scheduleForm.teacher,
          startTime: toISOTime(scheduleForm.startTime),
          endTime: toISOTime(scheduleForm.endTime),
          // room: scheduleForm.room || undefined,
        });
      }

      closeModal();
      fetchSchedules();
    } catch (error: any) {
      console.error("Failed to save schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!deletingSchedule) return;

    setDeleting(true);
    try {
      await deleteClassSchedule(classData._id, deletingSchedule._id);
      closeDeleteModal();
      fetchSchedules();
      
    } catch (error: any) {
      console.error("Failed to delete schedule:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loadingSchedules) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Schedule Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Class Schedule
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button onClick={() => setModalOpen(true)} className="text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Period
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Weekly schedule for {classData?.className}
          </p>
        </CardHeader>
      </Card>

      {/* Add/Edit Period Modal */}
      <Dialog open={modalOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Edit Schedule Period" : "Add Schedule Period"}
            </DialogTitle>
            <CardDescription>
              {editingSchedule ? "Edit" : "Add"} schedule for class subjects
            </CardDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Day of Week</Label>
              <Select
                value={scheduleForm.dayOfWeek}
                onValueChange={(value) =>
                  setScheduleForm({ ...scheduleForm, dayOfWeek: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a day" />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Select
                value={scheduleForm.subject}
                onValueChange={(value) =>
                  setScheduleForm({ ...scheduleForm, subject: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject: any) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Teacher</Label>
              <Select
                value={scheduleForm.teacher}
                onValueChange={(value) =>
                  setScheduleForm({ ...scheduleForm, teacher: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.length > 0 ? (
  teachers.map((teacher: any) => (
    <SelectItem key={teacher.id} value={teacher.id}>
      {teacher.name}
    </SelectItem>
  ))
) : (
  <SelectItem value="no-teacher" disabled className="text-muted-foreground italic">
    No Teacher has been assigned to this class yet, please assign teacher to this class
  </SelectItem>
)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={scheduleForm.startTime}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={scheduleForm.endTime}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {/* {!editingSchedule && (
              <div>
                <Label>Room (Optional)</Label>
                <Input
                  placeholder="e.g., Room 101, Science Lab"
                  value={scheduleForm.room}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, room: e.target.value })
                  }
                />
              </div>
            )} */}
            <Button 
              onClick={handleSubmitSchedule} 
              className="w-full text-white"
              disabled={loading}
            >
              {loading 
                ? editingSchedule 
                  ? "Updating..." 
                  : "Creating..." 
                : editingSchedule 
                  ? "Update Schedule" 
                  : "Create Schedule"
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={closeDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this schedule period?
              {deletingSchedule && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{deletingSchedule.subject.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {deletingSchedule.teacher.userId.firstName} {deletingSchedule.teacher.userId.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(deletingSchedule.startTime)} - {formatTime(deletingSchedule.endTime)}
                  </p>
                 
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              // variant="destructive"
              className="text-white"
              onClick={handleDeleteSchedule}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weekly Timetable */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(weeklySchedule).map(([day, periods]) => (
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
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditModal(period)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteModal(period)}
                              disabled={deleting}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
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
    </div>
  );
};