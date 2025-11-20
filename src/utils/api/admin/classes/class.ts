import { type Class, type ClassesResponse } from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Assign subject to class
export const assignSubjectToClass = async (payload: { subjectIds: string[]; classId: string }) => {
  return handleApi(
    () => api.post(`/v1/admin/classes/assign-subject`, payload),
    "Failed to assign subject to class",
  );
};

// De-assign subject from class
export const deAssignSubjectToClass = async (payload: {
  classId: string;
  subjectIds: string[];
}) => {
  return handleApi(
    () => api.post(`/v1/admin/classes/de-assign-subject`, payload),
    "Failed to de-assign subject from class",
  );
};

// Assign tutor to class
export const assignTutorToClass = async (
  classId: string,
  payload: { tutor: string; subjects: string[] },
) => {
  return handleApi(
    () => api.post(`/v1/admin/classes/${classId}/tutor`, payload),
    "Failed to assign tutor to class",
  );
};

// Remove tutor or subject from class
export const removeTutorOrSubjectFromClass = async (
  classId: string,
  payload: { tutor: string; subjects: string[] },
) => {
  return handleApi(
    () => api.patch(`/v1/admin/classes/${classId}/tutor`, payload),
    "Failed to remove tutor or subject from class",
  );
};

// Remove staff from class
export const deleteClassTeacher = async (classId: string, payload: { teacherId: string }) => {
  return handleApi(
    () => api.patch(`/v1/admin/classes/${classId}/teacher/remove`, payload),
    "Failed to remove staff from class",
  );
};

// Change class teacher
export const changeClassTeacher = async (
  classId: string,
  payload: { oldTeacher: string; newTeacher: string },
) => {
  return handleApi(
    () => api.patch(`/v1/admin/classes/${classId}/teacher`, payload),
    "Failed to change class teacher",
  );
};

// Fetch class statistics
export const getClassStats = async (): Promise<{
  total: number;
  nursery: number;
  primary: number;
  secondary: number;
  tertiary: number;
}> => {
  return handleApi(
    () =>
      api.get<{
        total: number;
        nursery: number;
        primary: number;
        secondary: number;
        tertiary: number;
      }>("/v1/admin/classes/stat"),
    "Failed to fetch class stats",
  );
};

// GET - All classes
export const getAllClasses = async (): Promise<Class[]> => {
  return handleApi(
    () =>
      api
        .get<ClassesResponse>("/v1/admin/classes", { params: { page: "1", limit: "100" } })
        .then((r) => r.data.data?.result as Class[]),
    "Failed to fetch classes",
  );
};
