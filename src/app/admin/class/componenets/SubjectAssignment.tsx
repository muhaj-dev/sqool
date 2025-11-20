"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { assignSubjectToClass, deAssignSubjectToClass, getClasses, getSubjects } from "@/utils/api";

import SubjectList from "./SubjectList";
import { type Class, type ISubject, type SubjectAssignmentPayload } from "./types";

interface SubjectAssignmentProps {
  classData: any;
  onRefresh: () => void;
}

const SubjectAssignment = ({ classData, onRefresh }: SubjectAssignmentProps) => {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>(classData?._id || "");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    classData?.subjects?.map((s: any) => s._id) || [],
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [subjectsToRemove, setSubjectsToRemove] = useState<string[]>([]);

  const [initialSubjectIds, setInitialSubjectIds] = useState<string[]>(
    classData?.subjects?.map((s: any) => s._id) || [],
  );

  // Refresh data when classData changes
  useEffect(() => {
    setInitialSubjectIds(classData?.subjects?.map((s: any) => s._id) || []);
    setSelectedSubjects(classData?.subjects?.map((s: any) => s._id) || []);
    setSelectedClass(classData?._id || "");
  }, [classData]);

  // Fetch classes and subjects
  const fetchData = async () => {
    try {
      setLoading(true);
      const classesRes = await getClasses("1", "40");
      const subjectsRes = await getSubjects(1, "");

      // Transform API response to match your Class type
      const transformedClasses =
        classesRes.data?.result.map((cls) => ({
          id: cls._id,
          name: cls.className,
          level: cls.levelType,
          section: cls.classSection,
        })) || [];

      setClasses(transformedClasses as any);
      setSubjects(subjectsRes.data?.result || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    void fetchData();
  }, [toast]);

  const subjectListClasses = classes.map((cls) => ({
    id: cls.id,
    name: `${cls.name}${cls.section ? ` (${cls.section})` : ""} - ${cls.level}`,
  }));

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
    );
  };

  const handleAssignSubjects = async () => {
    if (!selectedClass) {
      toast({
        title: "Error",
        description: "Please select a class",
        variant: "destructive",
      });
      return;
    }

    const newSubjectIds = selectedSubjects.filter((id) => !initialSubjectIds.includes(id));

    if (newSubjectIds.length === 0) {
      toast({
        title: "No new subjects",
        description: "No new subjects selected to assign.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const payload: SubjectAssignmentPayload = {
        classId: selectedClass || classData._id,
        subjectIds: newSubjectIds,
      };

      const response = await assignSubjectToClass(payload);
      toast({
        title: "Success",
        description: response?.data?.message,
      });

      // Call parent refresh - the parent will refetch classData and pass it down
      onRefresh();

      // Reset selected subjects to match the current classData
      // The parent will update classData which will trigger our useEffect
      setSelectedSubjects(classData?.subjects?.map((s: any) => s._id) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubjects = async () => {
    try {
      setLoading(true);
      await deAssignSubjectToClass({
        classId: classData._id,
        subjectIds: subjectsToRemove,
      });
      toast({
        title: "Success",
        description: "Subjects removed successfully",
      });
      setRemoveModalOpen(false);
      setSubjectsToRemove([]);

      // Call parent refresh - the parent will refetch classData and pass it down
      onRefresh();

      // Reset selected subjects - the parent will update classData which will trigger our useEffect
      setSelectedSubjects(classData?.subjects?.map((s: any) => s._id) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Assignment Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              Assign Subjects to {classData?.shortName} {classData?.classSection}
            </CardTitle>
            <CardDescription>Select a class and multiple subjects to assign</CardDescription>
          </div>

          <Button
            className="text-white"
            variant="default"
            onClick={() => setRemoveModalOpen(true)}
            disabled={classData?.subjects?.length === 0}
          >
            Remove Subject
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subjects">Select Subjects</Label>
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!selectedClass || loading}
            />

            <div className="space-y-2 h-[320px] overflow-y-auto p-2 border border-[#c3c3c3] rounded">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="flex items-center space-x-2 border-[#c3c3c3] border-b-[2px]"
                  >
                    <input
                      type="checkbox"
                      id={subject._id}
                      className="accent-primary text-white"
                      checked={selectedSubjects.includes(subject._id)}
                      onChange={() => handleSubjectToggle(subject._id)}
                      disabled={!selectedClass || loading}
                    />
                    <label
                      htmlFor={subject._id}
                      className="text-sm my-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subject.code} - {subject.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No subjects found" : "No subjects available"}
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleAssignSubjects}
            className="w-full text-white"
            disabled={!selectedClass || selectedSubjects.length === 0 || loading}
          >
            {loading ? "Assigning..." : "Assign Subjects"}
          </Button>
        </CardContent>
      </Card>

      {/* Remove Subject Modal */}
      {removeModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Remove Subjects from {classData?.className}</h2>
            <div className="space-y-2 h-[340px] overflow-y-auto p-2 border border-[#c3c3c3] rounded mb-4">
              {classData.subjects && classData.subjects.length > 0 ? (
                classData.subjects.map((subject: any) => (
                  <div key={subject._id} className="flex items-center space-x-2 accent-primary">
                    <input
                      type="checkbox"
                      id={`remove-${subject._id}`}
                      checked={subjectsToRemove.includes(subject._id)}
                      onChange={() => {
                        setSubjectsToRemove((prev) =>
                          prev.includes(subject._id)
                            ? prev.filter((id) => id !== subject._id)
                            : [...prev, subject._id],
                        );
                      }}
                    />
                    <label htmlFor={`remove-${subject._id}`}>
                      {subject.code} - {subject.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No subjects assigned to this class.</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRemoveModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="text-white"
                disabled={subjectsToRemove.length === 0 || loading}
                onClick={handleRemoveSubjects}
              >
                {loading ? "Removing..." : "Remove Selected"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Subject List Card */}
      <SubjectList classes={subjectListClasses} classData={classData} onRefresh={onRefresh} />
    </div>
  );
};

export default SubjectAssignment;
