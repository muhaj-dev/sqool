"use client";

import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useAuthStore } from "@/zustand/authStore";

import ListStudent from "../components/student/ListStudent";

const Page = () => {
  const { user } = useAuthStore();
  console.log(user, "user in staff students page");
  const staffId = user?._id;
  useAuthRedirect();
  if (!staffId || user?.role !== "teacher") return null;
  return (
    <div className="">
      <ListStudent staffId={staffId} />
    </div>
  );
};

export default Page;
