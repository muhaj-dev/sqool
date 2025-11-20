import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Class schedule endpoints (placeholders)
export const createClassSchedule = async (payload: any) => {
  return handleApi(
    () => api.post(`/v1/admin/class/schedule`, payload),
    "Failed to create class schedule",
  );
};

// Fetch class schedule by class ID
export const getClassSchedule = async (classId: string): Promise<any> => {
  return handleApi(
    () => api.get(`/v1/admin/class/schedule/${classId}`),
    "Failed to fetch class schedule",
  );
};

// Update class schedule
export const updateClassSchedule = async (scheduleId: string, data: any): Promise<any> => {
  return handleApi(
    () => api.patch(`/v1/admin/classes/schedule/${scheduleId}`, data),
    "Failed to update class schedule",
  );
};

// Delete class schedule
export const deleteClassSchedule = async (classId: string, scheduleId: string): Promise<any> => {
  return handleApi(
    () => api.delete(`/v1/admin/class/schedule/${classId}/${scheduleId}`),
    "Failed to delete class schedule",
  );
};
