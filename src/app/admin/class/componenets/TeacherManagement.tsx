'use client'

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
} from "@/utils/api";


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

const [changingTeacher, setChangingTeacher] = useState(false);
  const [newClassTeacher, setNewClassTeacher] = useState("");

 const currentClassTeacherObj = classData.classTeacher?.[0];
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

  // Filter out teachers already assigned to this class
  const availableTeachers = staffs.filter(
    (teacher) => !currentTeacherIds.includes(teacher._id)
  );

    // Get all subject IDs already assigned in classData
  const assignedSubjectIds = (classData?.subjects || []).map((s: any) => s._id);


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
    } catch (error) {
      // handle error (toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  // Remove a subject from a tutor
  const handleRemoveSubjectFromTutor = async (
    tutorId: string,
    subjectId: string
  ) => {
    try {
      setLoading(true);
      await removeTutorOrSubjectFromClass(classId, {
        tutor: tutorId,
        subjects: [subjectId],
      });
      onRefresh();
      // Optionally refresh data here
    } catch (error) {
      // handle error
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
    } catch (error) {
      // handle error
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
      // Optionally refresh data here
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

   const handleChangeClassTeacher = async () => {
    if (!newClassTeacher) return;
    setChangingTeacher(true);
    try {
      const payload: any = { newTeacher: newClassTeacher };
      // Only add oldTeacher if it exists
      if (currentClassTeacherObj?._id) {
        payload.oldTeacher = currentClassTeacherObj._id;
      }
      await changeClassTeacher(classId, payload);
      onRefresh();
      setNewClassTeacher("");
      // Optionally refresh data or show a toast
    } catch (error) {
      // handle error (toast, etc.)
    } finally {
      setChangingTeacher(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Assign New Teacher */}
     <Card>
        <CardHeader>
          <CardTitle>
            {currentClassTeacher
              ? "Assign Class Teacher"
              : "Add Class Teacher"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select and assign teachers to {classData.className}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {currentClassTeacher && (
              <div>
                <label className="text-sm font-medium">Current Class Teacher</label>
                <div className="p-2 border rounded bg-muted mt-1">
                  {`${currentClassTeacher.firstName} ${currentClassTeacher.lastName}`}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">
                {currentClassTeacher ? "Change Class Teacher" : "Add Class Teacher"}
              </label>
              <Select
                value={newClassTeacher}
                onValueChange={setNewClassTeacher}
              >
                <SelectTrigger>
                  <SelectValue placeholder={currentClassTeacher ? "Select new class teacher" : "Select class teacher"} />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.userId.firstName} {teacher.userId.lastName} - {teacher.level}
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
                  className="flex items-center space-x-2 accent-primaryColor"
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
                      <span className="ml-2 text-xs text-gray-400">(Not assigned to class)</span>
                    )}
                  </label>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              {subjectSearch ? "No subjects found" : "No subjects available"}
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
                Current Teachers
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
                          ? tutor.subject.map((sub: any) =>
                              typeof sub === "object" && sub !== null
                                ? sub.name
                                : sub
                            ).join(", ")
                          : ""}
                      </p>
                    </div>
                      <div className="flex gap-2 flex-wrap mt-3">
                        <Button
                          size="sm"
                          className="text-white"
                          // variant="destructive"
                          onClick={() => {
                            setRemovalTutor(tutor);
                            setRemovalSubjects([]);
                            setRemoveModalOpen(true);
                          }}
                        >
                          Edit Subject(s)
                        </Button>
                        <Button
                          className="text-white"
                          size="sm"
                          // variant="destructive"
                          onClick={() =>
                            handleRemoveTutor(
                              tutor.teacher?._id,
                              tutor.subject.map((s: any) => s._id)
                            )
                          }
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
                      Assign to Class
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

       <Dialog open={removeModalOpen} onOpenChange={setRemoveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Remove Subject(s) from {removalTutor?.teacher?.userId?.firstName}{" "}
              {removalTutor?.teacher?.userId?.lastName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="space-y-2 h-[180px] overflow-y-auto p-2 border border-[#c3c3c3] rounded">
              {removalTutor?.subject?.length > 0 ? (
                removalTutor.subject.map((sub: any) => (
                  <div key={sub._id} className="flex items-center space-x-2 accent-primaryColor">
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
            <Button
              onClick={handleRemoveSelectedSubjects}
              className="w-full text-white"
              disabled={removalSubjects.length === 0 || loading}
              // variant="destructive"
            >
              {loading ? "Removing..." : "Remove Selected Subjects"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  
    </div>
  );
};