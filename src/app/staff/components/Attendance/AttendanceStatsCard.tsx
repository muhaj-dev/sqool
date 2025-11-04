import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AttendanceStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function AttendanceStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
}: AttendanceStatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", iconClassName || "bg-primary/10")}>
            <Icon className={cn("h-6 w-6", iconClassName ? "" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
