import { type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
}
interface StatsCardSkeletonProps {
  count?: number;
  className?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, iconClassName }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
            {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
          <div className={cn("p-3 rounded-lg", iconClassName || "bg-primary/10")}>
            <Icon className={cn("h-6 w-6", iconClassName ? "" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardSkeleton({ count = 1, className }: StatsCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className={cn("hover:shadow-md transition-shadow animate-pulse", className)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Title placeholder */}
                <div className="h-3 w-24 bg-muted rounded" />
                {/* Value placeholder */}
                <div className="h-6 w-16 bg-muted rounded" />
                {/* Subtitle placeholder */}
                <div className="h-2 w-20 bg-muted rounded" />
              </div>
              {/* Icon placeholder */}
              <div className="p-3 rounded-lg bg-muted h-10 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
