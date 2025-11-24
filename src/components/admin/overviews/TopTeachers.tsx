"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getStaffs } from "@/utils/api";
import { type StaffResult, type StaffResponse } from "@/types";

const TopTeachers = () => {
  const [staffData, setStaffData] = useState<StaffResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: StaffResponse = await getStaffs(5, 1); // Fetch first 5 staff
      setStaffData(response?.data?.result ?? []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch staff";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStaffs(); // Add void operator here
  }, []);

  // Function to get initials for avatar fallback
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "NA";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "NA";
  };

  // Function to get display name
  const getDisplayName = (staff: StaffResult) => {
    if (staff.userId) {
      return `${staff.userId.firstName || ""} ${staff.userId.lastName || ""}`.trim();
    }
    return "Unknown Staff";
  };

  // Function to get primary subject
  const getPrimarySubject = (staff: StaffResult) => {
    return staff.primarySubject || "No subject assigned";
  };

  // Skeleton loading component
  const TeacherSkeleton = () => (
    <div className="flex items-center justify-between my-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        </Avatar>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <section className="bg-white rounded-md p-4">
        <h3 className="text-2xl mb-4">Top Teachers</h3>
        <Separator />
        <div className="flex justify-center items-center py-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-md p-4">
      <div>
        <h3 className="text-2xl mb-4">Top Teachers</h3>
      </div>
      <Separator />

      {loading ? (
        // Show 5 skeleton loaders
        Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <TeacherSkeleton />
            {index < 4 && <Separator />}
          </div>
        ))
      ) : staffData.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <p>No teachers available</p>
        </div>
      ) : (
        staffData.map((staff, index) => (
          <div key={staff._id || index}>
            <div className="flex items-center justify-between my-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {getInitials(staff.userId?.firstName, staff.userId?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{getDisplayName(staff)}</h4>
                  <div className="flex items-center text-[14px] gap-1">
                    <p className="text-muted-foreground">Subject -</p>
                    <p>{getPrimarySubject(staff)}</p>
                  </div>
                </div>
              </div>
            </div>
            {index < staffData.length - 1 && <Separator />}
          </div>
        ))
      )}
    </section>
  );
};

export default TopTeachers;
