"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getStaffs,
  getSubjects,
  assignTutorToClass,
  changeClassTeacher,
  removeTutorOrSubjectFromClass,
  deleteClassTeacher,
} from "@/utils/api";
import { X, RefreshCw } from "lucide-react";
import { RemoveStaffDialog } from "./RemoveStaffDialog";
import { toast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface Teacher {
  _id: string;
  userId: User;
  level: string;
  qualification: string;
  isActive: boolean;
}

interface ClassTeacher {
  _id: string;
  userId: User;
}

interface Tutor {
  _id: string;
  teacher: Teacher;
  subject: any[];
}

interface Subject {
  _id: string;
  name: string;
  code: string;
}


export const TeacherManagement = ({ classData, refresh, onRefresh }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state for assigning subjects to a teacher
  const [modalOpen, setModalOpen] = useState(false);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Modal state for removing subjects from a tutor
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [removalSubjects, setRemovalSubjects] = useState<string[]>([]);
  const [removalTutor, setRemovalTutor] = useState<any>(null);

  // Modal state for confirming tutor removal
  const [removeTutorModalOpen, setRemoveTutorModalOpen] = useState(false);
  const [tutorToRemove, setTutorToRemove] = useState<any>(null);

  const [changingTeacher, setChangingTeacher] = useState(false);
  const [newClassTeacher, setNewClassTeacher] = useState("");

  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<{
    teacherId: string;
    classId: string;
    className: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  } | null>(null);

  const currentClassTeacherObj = classData?.classTeacher?.[0];
  // const [allTeachers, setAllTeachers] = useState<any>(classData?.classTeacher);
    const [allTeachers, setAllTeachers] = useState<ClassTeacher[]>(classData?.classTeacher || []);
  
  const currentClassTeacher = currentClassTeacherObj?.userId;

  // Tutors from classData
  const classTutors = classData?.tutors || [];
  const classId = classData?._id;

  // Get current teacher IDs in class (by their _id)
  const currentTeacherIds = classTutors
    .map((tutor: any) => tutor.teacher?.userId?._id)
    .filter(Boolean);

  // Fetch all staff (teachers)
  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const response = await getStaffs(50, 1, searchTerm);
        setStaffs(response?.data?.result ?? []);
      } catch {
        setStaffs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, [searchTerm, refresh]);

  // Fetch all subjects for assignment modal
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects(1, subjectSearch);
        setAllSubjects(response?.data?.result ?? []);
      } catch {
        setAllSubjects([]);
      }
    };
    fetchSubjects();
  }, [subjectSearch, refresh]);

  useEffect(() => {
    setAllTeachers(classData?.classTeacher || []);
  }, [classData?.classTeacher]);

  useEffect(() => {
    if (selectedStaff) setRemoveOpen(true);
  }, [selectedStaff]);

  // Filter out teachers already assigned to this class
  const availableTeachers = staffs.filter(
    (teacher) => !currentTeacherIds.includes(teacher._id)
  );

  // Get all subject IDs already assigned in classData
  const assignedSubjectIds = (classData?.subjects || []).map((s: any) => s._id);

  // Refresh data function
  const handleRefresh = () => {
    onRefresh();
    toast({
      title: "Refreshed",
      description: "Data has been updated",
      variant: "default",
    });
  };

  // Assign tutor and subjects to class
  const handleAssignSubjectsToTutor = async () => {
    if (!selectedTeacher || selectedSubjects.length === 0) return;
    try {
      setLoading(true);
      await assignTutorToClass(classId, {
        tutor: selectedTeacher._id,
        subjects: selectedSubjects,
      });
      onRefresh();
      setModalOpen(false);
      setSelectedSubjects([]);
      setSelectedTeacher(null);
      toast({
        title: "Success",
        description: "Subjects assigned successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign subjects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove selected subjects from a tutor
  const handleRemoveSelectedSubjects = async () => {
    if (!removalTutor || removalSubjects.length === 0) return;
    try {
      setLoading(true);
      await removeTutorOrSubjectFromClass(classId, {
        tutor: removalTutor.teacher?._id,
        subjects: removalSubjects,
      });
      onRefresh();
      setRemoveModalOpen(false);
      setRemovalSubjects([]);
      setRemovalTutor(null);
      toast({
        title: "Success",
        description: "Subjects removed successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove subjects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove tutor completely
  const handleRemoveTutor = async (tutorId: string, subjectIds: string[]) => {
    try {
      setLoading(true);
      await removeTutorOrSubjectFromClass(classId, {
        tutor: tutorId,
        subjects: subjectIds,
      });
      onRefresh();
      setRemoveTutorModalOpen(false);
      setTutorToRemove(null);
      toast({
        title: "Success",
        description: "Tutor removed successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tutor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open confirmation modal for tutor removal
  const confirmRemoveTutor = (tutor: any) => {
    setTutorToRemove(tutor);
    setRemoveTutorModalOpen(true);
  };

  const handleChangeClassTeacher = async () => {
    if (!newClassTeacher) return;
    setChangingTeacher(true);
    try {
      const payload: any = { newTeacher: newClassTeacher };
      if (currentClassTeacherObj?._id) {
        payload.oldTeacher = currentClassTeacherObj._id;
      }
      await changeClassTeacher(classId, payload);
      onRefresh();
      setNewClassTeacher("");
      toast({
        title: "Success",
        description: "Class teacher updated successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update class teacher",
        variant: "destructive",
      });
    } finally {
      setChangingTeacher(false);
    }
  };

  async function handleRemove(
    classId: string | undefined,
    teacherId: string | undefined
  ) {
    if (!classId && !teacherId) return;
    try {
      setLoading(true);
      await deleteClassTeacher(classId!, { teacherId: teacherId! });
      setAllTeachers((prev: any) =>
        prev.filter((item: any) => item._id !== teacherId)
      );
      toast({
        title: "Success",
        description: "Staff removed successfully",
        variant: "default",
      });
      setRemoveOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove staff",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Assign New Teacher */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentClassTeacher ? "Assign Class Teacher" : "Add Class Teacher"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select and assign teachers to {classData?.className}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <label className="text-sm font-medium">Current Class Teacher</label>
             {allTeachers?.length > 0 &&
    allTeachers?.map(({ userId, _id }: ClassTeacher) => {
      return (
        <div key={_id}>
          <div className="p-2 border rounded bg-muted mt-1 flex items-center justify-between">
            {`${userId?.firstName} ${userId?.lastName}`}
            <Button
              onClick={() => {
                setSelectedStaff({
                  teacherId: _id,
                  classId,
                  className: classData?.className,
                  userId: {
                    firstName: userId?.firstName,
                    lastName: userId?.lastName,
                  },
                });
                setRemoveOpen((prev) => !prev);
              }}
              className="bg-destructive text-white p-0.5 px-2 hover:bg-transparent hover:text-black hover:border"
            >
              <X className="h-3 w-3" /> Remove
            </Button>
          </div>
        </div>
      );
    })}
            <div>
              <label className="text-sm font-medium">
                {currentClassTeacher
                  ? "Change Class Teacher"
                  : "Add Class Teacher"}
              </label>
              <Select
                value={newClassTeacher}
                onValueChange={setNewClassTeacher}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      currentClassTeacher
                        ? "Select new class teacher"
                        : "Select class teacher"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.userId.firstName} {teacher.userId.lastName} -{" "}
                      {teacher.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="mt-2 text-white"
                onClick={handleChangeClassTeacher}
                disabled={!newClassTeacher || changingTeacher}
              >
                {changingTeacher
                  ? currentClassTeacher
                    ? "Changing..."
                    : "Adding..."
                  : currentClassTeacher
                  ? "Change Class Teacher"
                  : "Add Class Teacher"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete staff from class dialog */}
      <RemoveStaffDialog
        open={removeOpen && !!selectedStaff}
        setOpen={(v) => {
          setRemoveOpen(v);
          if (!v) setSelectedStaff(null);
        }}
        staff={selectedStaff}
        loading={loading}
        onConfirm={() =>
          handleRemove(selectedStaff?.classId, selectedStaff?.teacherId)
        }
      />

      {/* Assign Subjects Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Subjects to {selectedTeacher?.userId?.firstName}{" "}
              {selectedTeacher?.userId?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Search subjects..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
            />
            <div className="space-y-2 h-[240px] overflow-y-auto p-2 border border-[#c3c3c3] rounded">
              {allSubjects.length > 0 ? (
                allSubjects.map((subject) => {
                  const isAssigned = assignedSubjectIds.includes(subject._id);
                  return (
                    <div
                      key={subject._id}
                      className="flex items-center space-x-2 accent-primary"
                    >
                      <input
                        type="checkbox"
                        id={subject._id}
                        checked={selectedSubjects.includes(subject._id)}
                        onChange={() => {
                          setSelectedSubjects((prev) =>
                            prev.includes(subject._id)
                              ? prev.filter((id) => id !== subject._id)
                              : [...prev, subject._id]
                          );
                        }}
                        disabled={!isAssigned}
                      />
                      <label
                        htmlFor={subject._id}
                        className={!isAssigned ? "text-[#adadad]" : ""}
                      >
                        {subject.code} - {subject.name}
                        {!isAssigned && (
                          <span className="ml-2 text-xs text-gray-400">
                            (Not assigned to class)
                          </span>
                        )}
                      </label>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  {subjectSearch
                    ? "No subjects found"
                    : "No subjects available"}
                </p>
              )}
            </div>
            <Button
              onClick={handleAssignSubjectsToTutor}
              className="w-full text-white"
              disabled={selectedSubjects.length === 0 || loading}
            >
              {loading ? "Assigning..." : "Assign Subjects"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Class Teachers (from classData.tutors) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Subject Teachers
              </CardTitle>
              <Badge variant="outline">{classTutors.length} assigned</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-[430px] overflow-y-auto">
              {classTutors.length === 0 ? (
                <div className="text-muted-foreground">
                  No teachers assigned.
                </div>
              ) : (
                classTutors.map((tutor: any) => (
                  <div key={tutor._id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {tutor.teacher?.userId?.firstName?.[0]}
                            {tutor.teacher?.userId?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {tutor.teacher?.userId?.firstName}{" "}
                            {tutor.teacher?.userId?.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {tutor.teacher?.level}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Subjects:{" "}
                        {Array.isArray(tutor.subject)
                          ? tutor.subject
                              .map((sub: any) =>
                                typeof sub === "object" && sub !== null
                                  ? sub.name
                                  : sub
                              )
                              .join(", ")
                          : ""}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-3">
                      <Button
                        size="sm"
                        className="text-white"
                        onClick={() => {
                          setRemovalTutor(tutor);
                          setRemovalSubjects([]);
                          setRemoveModalOpen(true);
                        }}
                      >
                        Edit Subject(s)
                      </Button>
                      <Button
                        className="text-white bg-destructive hover:bg-destructive/90"
                        size="sm"
                        onClick={() => confirmRemoveTutor(tutor)}
                      >
                        Remove Tutor
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Teachers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Available Teachers</CardTitle>
              <div className="relative">
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div>Loading...</div>
              ) : availableTeachers.length === 0 ? (
                <div className="text-muted-foreground">No teachers found.</div>
              ) : (
                availableTeachers.map((teacher) => (
                  <div key={teacher._id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {teacher.userId.firstName[0]}
                            {teacher.userId.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {teacher.userId.firstName} {teacher.userId.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {teacher.level}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {teacher.qualification}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={teacher.isActive ? "default" : "secondary"}
                      >
                        {teacher.isActive ? "Available" : "Inactive"}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 text-white"
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setModalOpen(true);
                      }}
                      disabled={!teacher.isActive}
                    >
                      Assign subject(s)
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remove Subjects Modal */}
      <Dialog open={removeModalOpen} onOpenChange={setRemoveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Subjects for {removalTutor?.teacher?.userId?.firstName}{" "}
              {removalTutor?.teacher?.userId?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2 h-[180px] overflow-y-auto p-2 border border-[#c3c3c3] rounded">
              {removalTutor?.subject?.length > 0 ? (
                removalTutor.subject.map((sub: any) => (
                  <div
                    key={sub._id}
                    className="flex items-center space-x-2 accent-primary"
                  >
                    <input
                      type="checkbox"
                      id={`remove-${sub._id}`}
                      checked={removalSubjects.includes(sub._id)}
                      onChange={() => {
                        setRemovalSubjects((prev) =>
                          prev.includes(sub._id)
                            ? prev.filter((id) => id !== sub._id)
                            : [...prev, sub._id]
                        );
                      }}
                    />
                    <label htmlFor={`remove-${sub._id}`}>{sub.name}</label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No subjects assigned to this tutor.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={handleRemoveSelectedSubjects}
                className="flex-1 text-white bg-destructive hover:bg-destructive/90"
                disabled={removalSubjects.length === 0 || loading}
              >
                {loading ? "Removing..." : "Remove Selected Subjects"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Tutor Confirmation Modal */}
      <Dialog open={removeTutorModalOpen} onOpenChange={setRemoveTutorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to remove{" "}
              <strong>
                {tutorToRemove?.teacher?.userId?.firstName}{" "}
                {tutorToRemove?.teacher?.userId?.lastName}
              </strong>{" "}
              as a tutor from this class?
            </p>
            <p className="text-sm text-muted-foreground">
              This action will remove all subjects assigned to this tutor.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setRemoveTutorModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() =>
                  handleRemoveTutor(
                    tutorToRemove?.teacher?._id,
                    tutorToRemove?.subject?.map((s: any) => s._id) || []
                  )
                }
                disabled={loading}
              >
                {loading ? "Removing..." : "Yes, Remove Tutor"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};