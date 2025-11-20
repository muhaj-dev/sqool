import { format } from "date-fns";
import qs from "qs";

import {
  type AttendanceResponse,
  type AttendanceStatus,
  type ClassPaginationResponse,
  type CreateExamResponse,
  type Exam,
  type ExamsApiResponse,
  type ExamsResponse,
  type NoticesResponse,
  type SessionsResponse,
  type StaffProfileResponse,
  type StaffStatApiResponse,
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

//********************* STAFF STUDENTS **********************************/
//Staff: Get all students
export const getAllStudentsStaff = (
  page = 1,
  limit = 10,
  search?: string,
  filter?: Record<string, any>,
  options?: {
    hasAttendance?: boolean;
    startDate?: string;
    endDate?: string;
  },
): Promise<StudentPaginationResponse> =>
  handleApi(async () => {
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

    return api.get<StudentPaginationResponse>(url);
  }, "Failed to fetch students");

//get staff classes
export const getStaffClasses = (page: number, limit = 10): Promise<ClassPaginationResponse> =>
  handleApi(
    () =>
      api.get<ClassPaginationResponse>("/v1/staff/classes/own", {
        params: { page, limit },
      }),
    "Failed to fetch classes",
  );
//get student by id
export const getStudentByIdStaff = (id: string): Promise<StaffStudentResponse> =>
  handleApi(
    () => api.get<StaffStudentResponse>(`/v1/staff/student/${id}`),
    "Failed to fetch student",
  );

//********************* DASHBOARD **********************************/

// Staff: Get upcoming exams
export const getStaffUpcomingExam = (page = 1, limit = 4): Promise<ExamsApiResponse> =>
  handleApi(
    () =>
      api.get("/v1/staff/examination", {
        params: {
          limit,
          page,
          startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          endDate: format(new Date(), "yyyy-MM-dd"),
        },
      }),
    "Failed to fetch upcoming exams",
  );
// Staff: Get dashboard stats
export const getStaffDashboardStats = (): Promise<StaffStatApiResponse> =>
  handleApi(() => api.get(`/v1/staff/stat`), "Failed to fetch dashboard stats");

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

//Staff: Attendance create
export const createStudentAttendanceStaff = async (
  classId: string,
  attendanceData: { studentId: string; status: AttendanceStatus; remarks: string }[],
): Promise<void> => {
  return handleApi(
    () => api.post(`/v1/staff/attendance/${classId}`, { attendance: attendanceData }),
    "Failed to save attendance",
  );
};

//Staff: Attendance save
export const saveStaffAttendance = async (
  classId: string,
  attendanceData: { studentId: string; status: AttendanceStatus; remarks: string }[],
): Promise<void> => {
  console.log({ attendanceData }, "from attendance data api");
  return handleApi(
    () => api.post(`/v1/staff/attendance/${classId}`, { attendance: attendanceData }),
    "Failed to save attendance",
  );
};
//Staff: Get student attendance records
export const getStudentAttendance = async (classId: string): Promise<AttendanceResponse> => {
  return handleApi(
    () => api.get<AttendanceResponse>(`/v1/staff/attendance/${classId}`),
    "Failed to save attendance",
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
