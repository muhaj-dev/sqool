import {
  ClassPaginationResponse,
  StudentPaginationResponse,
  ExamsResponse,
} from "@/types";
import axios from "axios";
import { api } from "@/utils/api";
import { StaffStudentResponse } from "./types";
import qs from "qs";
import { format } from "date-fns";

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
  extendUrl?: string
): string => {
  const fullPath = `/v1/staff${extendUrl ?? ""}${basePath ?? ""}`;
  const queryString = qs.stringify(filters, {
    skipNulls: true,
    arrayFormat: "repeat",
  });
  return queryString ? `${fullPath}?${queryString}` : fullPath;
};

export const getAllStudents = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filter?: Record<string, any>,
  options?: {
    hasAttendance?: boolean;
    startDate?: string;
    endDate?: string;
  }
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
      const errorMessage =
        error.response?.data?.message || "Failed to fetch students";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch students");
  }
};

export const getStaffClasses = async (
  page: number,
  limit: number = 10
): Promise<ClassPaginationResponse> => {
  try {
    const response = await api.get<ClassPaginationResponse>(
      "/v1/staff/classes/own",
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch classes";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch classes");
  }
};

export const getStudentById = async (
  id: string
): Promise<StaffStudentResponse> => {
  try {
    const response = await api.get<StaffStudentResponse>(
      `/v1/staff/student/${id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch student";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch student");
  }
};

//********************* DASHBOARD **********************************/

export const getStaffUpcomingExam = async (
  page: number = 1,
  limit: number = 4
): Promise<ExamsResponse> => {
  try {
    const response = await api.get(`/v1/staff/examination`, {
      params: {
        limit,
        page,
        startDate: format(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        ),
        endDate: format(new Date(), "yyyy-MM-dd"),
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch upcoming exams";
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Failed to fetch upcoming exams");
  }
};
