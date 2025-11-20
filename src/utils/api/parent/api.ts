import {
  type Child,
  type ClassSchedule,
  type NoticesResponse,
  type ParentDashboardResponse,
} from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../apiHelpers";

// -------------------------------
//  Parent Notices
// -------------------------------
export const getParentNotices = async (search = "", limit = 20): Promise<NoticesResponse> => {
  return handleApi(
    () =>
      api.get<NoticesResponse>("/v1/parent/notices", {
        params: { search, limit },
      }),
    "Failed to fetch parent notices",
  );
};

// -------------------------------
//  Parent Dashboard
// -------------------------------
export const getParentDashboard = async (): Promise<ParentDashboardResponse> => {
  return handleApi(
    () => api.get<ParentDashboardResponse>("/v1/parent/dashboard"),
    "Failed to fetch parent dashboard data",
  );
};

// -------------------------------
// Get a specific child by ID (Parent view)
// -------------------------------
export const getParentKidById = async (id: string): Promise<Child> => {
  return handleApi(() => api.get<Child>(`/v1/parent/${id}`), "Failed to fetch student data");
};

// -------------------------------
// Get a student's schedule (Parent view)
// -------------------------------
export const getStudentSchedule = async (id: string): Promise<ClassSchedule> => {
  return handleApi(
    () => api.get<ClassSchedule>(`/v1/parent/${id}/schedule`),
    "Failed to fetch student schedule",
  );
};
