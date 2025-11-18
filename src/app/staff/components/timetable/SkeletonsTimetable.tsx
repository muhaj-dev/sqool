"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// -------------------------
// Skeleton Components
// -------------------------
interface TimetableSkeletonProps {
  skipHeader?: boolean;
}
export const TimetableSkeleton = ({ skipHeader = false }: TimetableSkeletonProps) => (
  <div className="space-y-6 animate-pulse">
    {!skipHeader && (
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </Card>
      ))}
    </div>

    <Card className="p-6 space-y-3">
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </Card>
  </div>
);

export const SubjectSkeleton = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <Skeleton className="h-5 w-32" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 rounded-md" />
        ))}
      </div>
    </div>
  </Card>
);
