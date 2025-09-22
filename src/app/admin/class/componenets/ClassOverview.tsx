import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Calendar, Edit } from "lucide-react";

import { IClassByIdResponse } from "./types";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
} from "react";

interface ClassOverviewProps {
  classData: any;
}

export const ClassOverview = ({ classData }: ClassOverviewProps) => {
  // Example: You may want to fetch teacher names and students count elsewhere
  // For now, display IDs and counts directly

  return (
    <div className="space-y-6">
      {/* Class Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Class Information</CardTitle>
            {/* <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Class Name
              </label>
              <p className="text-lg font-semibold">{classData.className}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Level/Stream
              </label>
              <p className="text-lg font-semibold capitalize">
                {classData.levelType}
              </p>

              {/* <Badge variant="outline" className="mt-1">{classData.levelType}</Badge> */}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Class Section
              </label>
              <p className="text-lg font-semibold">
                {classData.classSection || "-"}
              </p>
            </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Class Teacher(s)
            </label>
            <p className="mt-1">
              {classData.classTeacher && classData.classTeacher.length > 0
                ? `${classData.classTeacher[0].userId.firstName} ${classData.classTeacher[0].userId.lastName}`
                : "No teacher assigned"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Description
            </label>
            <p className="mt-1">{classData.shortName || "-"}</p>
          </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Students
              </CardTitle>
              {/* <Button variant="outline" size="sm">View All</Button> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">
                Total Students:{" "}
                {classData.students ? classData.students.length : 0}
              </p>
              {/* You can map students here if you fetch their details */}
            </div>
          </CardContent>
        </Card>

        {/* Assigned Subjects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Assigned Subjects
              </CardTitle>
              {/* <Button variant="outline" size="sm">View All</Button> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">
                Total Subjects:{" "}
                {classData.subjects ? classData.subjects.length : 0}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {classData.subjects && classData.subjects.length > 0 ? (
                  classData.subjects.map(
                    (subject: {
                      _id: Key | null | undefined;
                      name:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                      code:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                    }) => (
                      <Badge key={subject._id} variant="secondary">
                        {subject.name} ({subject.code})
                      </Badge>
                    )
                  )
                ) : (
                  <span>No subjects assigned</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    
    </div>
  );
};
