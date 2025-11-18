import { Calendar, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type ClassSchedule } from "@/types";

export const ClassSummarySection = ({
  currentClass,
  nextClass,
  completedClasses,
  totalToday,
  formatTime,
}: {
  currentClass: ClassSchedule | undefined;
  nextClass: ClassSchedule | undefined;
  completedClasses: number;
  totalToday: number;
  formatTime: (d: string) => string;
}) => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Class</p>
          <p className="text-lg font-semibold">
            {currentClass ? currentClass.subject.name : "No class"}
          </p>
          <p className="text-sm text-primary">
            {currentClass
              ? `${formatTime(currentClass.startTime)} - ${formatTime(currentClass.endTime)}`
              : "Free period"}
          </p>
        </div>
        <Clock className="h-8 w-8 text-primary" />
      </div>
    </Card>

    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Next Class</p>
          <p className="text-lg font-semibold">
            {nextClass ? nextClass.subject.name : "No more classes"}
          </p>
          <p className="text-sm text-orange-500">
            {nextClass ? `Starts at ${formatTime(nextClass.startTime)}` : "Day ended"}
          </p>
        </div>
        <Calendar className="h-8 w-8 text-orange-500" />
      </div>
    </Card>

    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Classes Today</p>
          <p className="text-2xl font-bold">{totalToday}</p>
          <p className="text-sm text-green-500">{completedClasses} Completed</p>
        </div>
        <Badge variant={currentClass ? "default" : "outline"}>
          {currentClass ? "Active" : "Inactive"}
        </Badge>
      </div>
    </Card>
  </section>
);
