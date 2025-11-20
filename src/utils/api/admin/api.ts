import { type DashboardData, type DashboardResponse } from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../apiHelpers";

export * from "./banks/bank";
export * from "./classes/class";
export * from "./exams/exam";
export * from "./notices/notice";
export * from "./parents/parent";
export * from "./payments/payment";
export * from "./schedules/schedule";
export * from "./sessions/session";
export * from "./staffs/staff";
export * from "./students/student";
export * from "./subjects/subject";

// Fetch dashboard data
export const getDashboardData = () =>
  handleApi<DashboardData>(async () => {
    const res = await api.get<DashboardResponse>("/v1/admin/dashboard");
    return res.data.data; // unwrap nested `.data`
  }, "Failed to fetch dashboard data");
