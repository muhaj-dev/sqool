"use client";

import { ReusableSelect } from "@/components/select-resuable";

interface AttendanceClassSelectorProps {
  classes: { id: string; name: string }[];
  value: string | undefined;
  onChange: (val: string) => void;
}

export function AttendanceClassSelector({
  classes,
  value,
  onChange,
}: AttendanceClassSelectorProps) {
  return (
    <ReusableSelect
      label="Select Class"
      value={value}
      onChange={onChange}
      options={classes.map((c) => ({ label: c.name, value: c.id }))}
      placeholder="Choose class…"
    />
  );
}
