import React from "react";
import { Card } from "@/components/ui/card";
import {Subject } from "@/types";
import ErrorState from "@/components/ErrorState";
import { SubjectSkeleton } from "./SkeletonsTimetable";


export const SubjectLegendSection = ({
  isPending,
  isError,
  error,
  refetch,
  subjects,
  getSubjectColor,
}: {
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  subjects: Subject[];
  getSubjectColor: (name: string) => string;
}) => {
  if (isPending) return <SubjectSkeleton />;
  if (isError)
    return (
      <ErrorState
        variant="compact"
        error={error as Error}
        onRetry={refetch}
        title="Failed to load subjects"
      />
    );

  return (
    <Card className="p-6 mb-16">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Subjects</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className={`px-2 py-1 rounded text-xs font-medium border text-center ${getSubjectColor(
                subject.name
              )}`}
            >
              <div className="font-semibold capitalize">{subject.name}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};