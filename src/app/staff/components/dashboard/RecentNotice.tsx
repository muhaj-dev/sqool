import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const notices = [
  {
    title: "Staff Meeting",
    description: "Monthly staff meeting scheduled for tomorrow",
    time: "2 hours ago",
  },
  {
    title: "Exam Schedule Released",
    description: "Mid-term examination timetable now available",
    time: "5 hours ago",
  },
  {
    title: "Holiday Reminder",
    description: "School will be closed next Monday for public holiday",
    time: "1 day ago",
  },
];

export function RecentNotices() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Notices</CardTitle>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notices.map((notice, index) => (
            <div
              key={index}
              className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{notice.title}</h4>
                <p className="text-xs text-muted-foreground mb-1">{notice.description}</p>
                <span className="text-xs text-muted-foreground">{notice.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
