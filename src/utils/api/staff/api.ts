import axios from "axios";
import { format } from "date-fns";
import qs from "qs";

import {
  type ClassPaginationResponse,
  type CreateExamResponse,
  type Exam,
  type ExamsResponse,
  type NoticesResponse,
  type SessionsResponse,
  type StaffProfileResponse,
  type StaffStatResponse,
  type StudentPaginationResponse,
  type SubjectPaginationResponse,
  type TimetableResponse,
  type UpdateExamResponse,
} from "@/types";
import { api } from "@/utils/api";

import { handleApi } from "../apiHelpers";
import { type StaffStudentResponse } from "./types";

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface StudentFilters extends Record<string, any>, DateRange {
  include?: string; // e.g. "Attendance"
}

const buildStaffQueryUrl = (
  basePath: string,
  filters: StudentFilters = {},
  extendUrl?: string,
): string => {
  const fullPath = `/v1/staff${extendUrl ?? ""}${basePath ?? ""}`;
  const queryString = qs.stringify(filters, {
    skipNulls: true,
    arrayFormat: "repeat",
  });
  return queryString ? `${fullPath}?${queryString}` : fullPath;
};

export const getAllStudentsStaff = async (
  page = 1,
  limit = 10,
  search?: string,
  filter?: Record<string, any>,
  options?: {
    hasAttendance?: boolean;
    startDate?: string;
    endDate?: string;
  },
): Promise<StudentPaginationResponse> => {
  try {
    const filters: StudentFilters = {
      ...filter,
      page,
      limit,
      search,
      ...(options?.startDate && { startDate: options.startDate }),
      ...(options?.endDate && { endDate: options.endDate }),
      ...(options?.hasAttendance && { include: "Attendance" }),
    };
    const url = buildStaffQueryUrl("/student", filters);

    const response = await api.get<StudentPaginationResponse>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to fetch students";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch students");
  }
};

// eslint-disable-next-line prettier/prettier
export const getStaffClasses = async (
  page: number,
  limit = 10,
): Promise<ClassPaginationResponse> => {
  try {
    const response = await api.get<ClassPaginationResponse>("/v1/staff/classes/own", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to fetch classes";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch classes");
  }
};

export const getStudentByIdStaff = async (id: string): Promise<StaffStudentResponse> => {
  try {
    const response = await api.get<StaffStudentResponse>(`/v1/staff/student/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to fetch student";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch student");
  }
};

//********************* DASHBOARD **********************************/

export const getStaffUpcomingExam = async (page = 1, limit = 4): Promise<ExamsResponse> => {
  try {
    const response = await api.get(`/v1/staff/examination`, {
      params: {
        limit,
        page,
        startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to fetch upcoming exams";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch upcoming exams");
  }
};
export const getStaffDashboardStats = async (): Promise<StaffStatResponse> => {
  try {
    const response = await api.get(`/v1/staff/stat`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to dashboard stats";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to dashboard stats");
  }
};

// Staff profile API
export const getStaffProfile = async (): Promise<StaffProfileResponse> => {
  return handleApi(
    () => api.get<StaffProfileResponse>("/v1/user/profile"),
    "Failed to fetch staff profile",
  );
};

// Examination API
export const createExamination = async (formData: FormData): Promise<CreateExamResponse> => {
  return handleApi(
    () =>
      api.post<CreateExamResponse>("/v1/staff/examination", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    "Failed to create examination",
  );
};

// Staff: Get sessions and terms
export const getSessionsForStaff = async (page = "1", limit = "10"): Promise<SessionsResponse> => {
  return handleApi(
    () =>
      api.get<SessionsResponse>("/v1/staff/session-and-terms", {
        params: { page, limit },
      }),
    "Failed to fetch sessions for staff",
  );
};

// Staff: Get classes
export const getClassesForStaff = async (
  page = "1",
  limit = "10",
): Promise<ClassPaginationResponse> => {
  return handleApi(
    () =>
      api.get<ClassPaginationResponse>("/v1/staff/classes", {
        params: { page, limit },
      }),
    "Failed to fetch classes",
  );
};

// Staff: Get subjects
export const getSubjectsForStaff = async (
  page = 1,
  search = "",
): Promise<SubjectPaginationResponse> => {
  return handleApi(
    () =>
      api.get<SubjectPaginationResponse>("/v1/staff/subject", {
        params: { page, search, limit: 100 },
      }),
    "Failed to fetch subjects",
  );
};

// Staff: Get all exams
export const getAllExams = async (page = 1, limit = 10): Promise<ExamsResponse> => {
  return handleApi(
    () =>
      api.get<ExamsResponse>("/v1/staff/examination", {
        params: { page, limit },
      }),
    "Failed to fetch exams",
  );
};

// Staff: Get exam by ID
export const getExamById = async (examId: string): Promise<{ data: Exam; message: string }> => {
  return handleApi(
    () => api.get<{ data: Exam; message: string }>(`/v1/staff/examination/${examId}`),
    "Failed to fetch exam",
  );
};

// Staff: Update exam
export const updateExamination = async (
  examId: string,
  formData: FormData,
): Promise<UpdateExamResponse> => {
  return handleApi(
    () =>
      api.patch<UpdateExamResponse>(`/v1/staff/examination/${examId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    "Failed to update exam",
  );
};

// Staff: Delete exam
export const deleteExam = async (examId: string): Promise<void> => {
  return handleApi(() => api.delete(`/v1/staff/examination/${examId}`), "Failed to delete exam");
};

// Staff: Get timetable
export const getClassScheduleForStaff = async (): Promise<TimetableResponse> => {
  return handleApi(
    () => api.get<TimetableResponse>("/v1/staff/class/schedule"),
    "Failed to fetch timetable",
  );
};

// -------------------------------
//  Staff Notices
// -------------------------------
export const getStaffNotices = async (
  search = "",
  limit = 20,
  startDate: string = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  endDate: string = format(new Date(), "yyyy-MM-dd"),
): Promise<NoticesResponse> => {
  return handleApi(
    () =>
      api.get<NoticesResponse>("/v1/staff/notices", {
        params: { search, limit, startDate, endDate },
      }),
    "Failed to fetch staff notices",
  );
};
