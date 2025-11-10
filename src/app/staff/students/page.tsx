'use client'

import React from "react";
import ListStudent from "../components/student/ListStudent";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useAuthStore } from "@/zustand/authStore";

const Page = () => {
  const { user } = useAuthStore();
  const staffId = user?._id;
  useAuthRedirect();
  if (!staffId || user?.role !== "teacher") return null;
  return (
    <div className="">
      <ListStudent staffId={staffId!} />
    </div>
  );
};

export default Page
