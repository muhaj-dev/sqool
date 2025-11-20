"use client";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "recharts";

interface FeeFiltersProps {
  searchQuery: string;
  filterClass: string;
  filterSession: string;
  limit: number;
  classOptions: { value: string; label: string }[];
  sessionOptions: { value: string; label: string }[];
  filteredCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onClassFilterChange: (value: string) => void;
  onSessionFilterChange: (value: string) => void;
  onLimitChange: (value: number) => void;
  onClearFilters: () => void;
}

export function FeeFilters({
  searchQuery,
  filterClass,
  filterSession,
  limit,
  classOptions,
  sessionOptions,
  filteredCount,
  totalCount,
  onSearchChange,
  onClassFilterChange,
  onSessionFilterChange,
  onLimitChange,
  onClearFilters,
}: FeeFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>Filter Parameters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Label className="text-sm font-medium text-foreground mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by class or session..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Class Filter */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">Class</Label>
          <Select value={filterClass} onValueChange={onClassFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classOptions.map((cls) => (
                <SelectItem key={cls.value} value={cls.value}>
                  {cls.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Session Filter */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">Session</Label>
          <Select value={filterSession} onValueChange={onSessionFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="All sessions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              {sessionOptions.map((session) => (
                <SelectItem key={session.value} value={session.value}>
                  {session.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Limit */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">Limit</Label>
          <Input
            type="number"
            min="1"
            max="100"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            placeholder="20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClearFilters} className="gap-2">
          Clear Filters
        </Button>
        <span className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} fee structures
        </span>
      </div>
    </div>
  );
}
