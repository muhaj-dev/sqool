// src/app/staff/[staffId]/page.tsx
"use client";
import LeftBar from "@/components/staff/LeftBar";
import StaffSteps from "@/components/staff/StaffSteps";
import StaffTopbar from "@/components/staff/StaffTopbar";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getStaffById } from "@/utils/api";
import { StaffResult, SingleStaffResponse } from "@/types";

const Page = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [staffId, setStaffId] = useState("");
  const [staff, setStaff] = useState<StaffResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract the id from the pathname
    const pathSegments = pathname?.split("/") ?? [];
    const extractedStaffId = pathSegments[pathSegments.length - 1];
    setStaffId(extractedStaffId);
    console.log("Staff ID:", extractedStaffId);
  }, [pathname]);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!staffId) return; // Skip if staffId is not set
      setLoading(true);
      setError(null);
      try {
        const response: SingleStaffResponse = await getStaffById(staffId);
        setStaff(response?.data ?? null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch staff details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [staffId]);

  return (
    <>
      <StaffTopbar staffId={staffId} />
      <section className="flex gap-8 flex-col lg:flex-row w-full">
        <LeftBar staffId={staffId} staff={staff} loading={loading} error={error} />
        <div className="bg-white flex-1 rounded-md">
          <StaffSteps staffId={staffId} staff={staff} />
          {/* <Staff /> */}
        </div>
      </section>
    </>
  );
};

export default Page;