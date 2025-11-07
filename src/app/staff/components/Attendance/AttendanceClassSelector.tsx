"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AttendanceClassSelector({ classes, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-sm">Select Class</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder="Choose class…" /></SelectTrigger>
        <SelectContent>
          {classes.map((cls: any) => (
            <SelectItem key={cls.id} value={cls.id}>
              {cls.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
