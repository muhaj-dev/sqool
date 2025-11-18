import { type ISingleStudent, type StudentPaginationResponse, type StudentResponse } from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Fetch all students with pagination, search, and filter options
export const getAllStudents = (page: number, limit = 10, search?: string, filter?: string) =>
  handleApi<StudentPaginationResponse>(
    () =>
      api.get<StudentPaginationResponse>("/v1/admin/student/all", {
        params: { page, limit, search, filter },
      }),
    "Failed to fetch students",
  );

// Add a new student
export const addStudent = (studentData: ISingleStudent) =>
  handleApi<StudentResponse>(
    () => api.post<StudentResponse>("/v1/admin/student", studentData),
    "Failed to add student",
  );

// Fetch a student by ID
export const getStudentById = (id: string) =>
  handleApi<StudentResponse>(
    () => api.get<StudentResponse>(`/v1/admin/student/${id}`),
    "Failed to fetch student",
  );
