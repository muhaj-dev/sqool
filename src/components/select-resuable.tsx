"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string;
  value: string;
}

interface ReusableSelectProps {
  label?: string;
  value: string | undefined;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
}

export function ReusableSelect({
  label = "Select Option",
  value,
  onChange,
  options,
  placeholder = "Choose option…",
}: ReusableSelectProps) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-sm">{label}</p>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
