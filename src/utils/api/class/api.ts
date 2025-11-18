import {
  type ClassPaginationResponse,
  type IClassConfiguration,
  type IClassConfigurationResponse,
} from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../apiHelpers";

// Class-related API calls
export const createClasses = (classData: IClassConfiguration) =>
  handleApi<IClassConfigurationResponse>(
    () => api.post<IClassConfigurationResponse>("/v1/admin/classes", classData),
    "Failed to create class",
  );

// Edit class details
export const editClasses = (id: string, classData: IClassConfiguration) =>
  handleApi<IClassConfigurationResponse>(
    () => api.patch<IClassConfigurationResponse>(`/v1/admin/classes/${id}`, classData),
    "Failed to update class",
  );

// Delete a class
export const deleteClasses = (id: string) =>
  handleApi<void>(() => api.delete(`/v1/admin/classes/${id}`), "Failed to delete class");

// Fetch paginated list of classes
export const getClasses = (page = "1", limit = "10") =>
  handleApi<ClassPaginationResponse>(
    () =>
      api.get<ClassPaginationResponse>("/v1/admin/classes", {
        params: { page, limit },
      }),
    "Failed to fetch classes",
  );

// Fetch class by ID
export const getClassById = (classId: string) =>
  handleApi<IClassConfigurationResponse>(
    () => api.get<IClassConfigurationResponse>(`/v1/admin/classes/${classId}`),
    "Failed to fetch class",
  );

// Update class details
export const updateClass = (classId: string) =>
  handleApi<IClassConfigurationResponse>(
    () => api.patch<IClassConfigurationResponse>(`/v1/admin/classes/${classId}`),
    "Failed to update class",
  );
