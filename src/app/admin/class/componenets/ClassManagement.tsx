"use client";

import { BookOpen, Calendar, FileText, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast"; // <-- Import useToast
import { getClassById } from "@/utils/api";

import ClassHeader from "./ClassHeader";
import { ClassOverview } from "./ClassOverview";
import ResourceManagement from "./ResourceManagement";
import { ScheduleManagement } from "./ScheduleManagement";
import SubjectAssignment from "./SubjectAssignment";
import { TeacherManagement } from "./TeacherManagement";
import { type Subject, type Teacher } from "./types";

interface ClassManagementProps {
  initialTeachers: Teacher[];
  initialSubjects: Subject[];
  classId: string;
  // initialClasses: Class[];
}

const ClassManagement = ({
  classId,
  // initialClasses,
}: ClassManagementProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const [classData, setClassData] = useState<any>(null);
  const [, setLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);
  // eslint-disable-next-line prettier/prettier
  const handleRefresh = useCallback(() => setRefresh((r) => !r), []);

  useEffect(() => {
    if (!classId) return;
    const fetchClass = async () => {
      setLoading(true);
      try {
        const res = await getClassById(classId);
        setClassData(res.data);
      } catch {
        setClassData(null);
        toast({
          variant: "destructive",
          title: "Unable to fetch data",
          description: "There was an error fetching class data.",
        });
      } finally {
        setLoading(false);
      }
    };
    void fetchClass();
  }, [classId, refresh]); // <-- add refresh here

  // if (loading) return <div>Loading...</div>
  // if (!classData) return <div>Class not found</div>

  // Optionally filter classes if you want search to work
  // const filteredClasses = filterClasses(classes, searchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClassHeader
      // searchTerm={searchTerm}
      // onSearchChange={setSearchTerm}
      // teachers={teachers}
      // classes={classes}
      // setClasses={setClasses}
      />

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 ">
          <div className="overflow-auto">
            <TabsList className="grid  grid-cols-5 min-w-[600px] max-w-3xl">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Assign Subjects
              </TabsTrigger>
              <TabsTrigger value="teachers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage Teachers
              </TabsTrigger>
              <TabsTrigger value="schedules" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedules
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <ClassOverview classData={classData} />
          </TabsContent>

          {/* Assign Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <SubjectAssignment classData={classData} onRefresh={handleRefresh} />
          </TabsContent>

          {/* Teachers Management Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <TeacherManagement classData={classData} refresh={refresh} onRefresh={handleRefresh} />
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <ScheduleManagement
              classData={classData}
              //           refresh={refresh}
              // onRefresh={handleRefresh}
            />
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <ResourceManagement
            // classes={classes}
            // setClasses={setClasses}
            // onRefresh={handleRefresh}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClassManagement;
