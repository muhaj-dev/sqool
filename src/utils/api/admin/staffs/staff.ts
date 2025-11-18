import { type AddStaffPayload, type SingleStaffResponse, type StaffResponse } from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Fetch all staffs with pagination and search options
export const getStaffs = (limit = 10, page = 1, search = "") =>
  handleApi<StaffResponse>(
    () =>
      api.get<StaffResponse>("/v1/admin/staffs", {
        params: { limit, page, search },
      }),
    "Failed to fetch staffs",
  );

// Add a new staff member
export const addStaff = (staffData: AddStaffPayload) =>
  handleApi<StaffResponse>(
    () => api.post<StaffResponse>("/v1/admin/staffs", staffData),
    "Failed to add staff",
  );

// Get staff by ID
export const getStaffById = (staffId: string) =>
  handleApi<SingleStaffResponse>(
    () => api.get<SingleStaffResponse>(`/v1/admin/staffs/${staffId}`),
    "Failed to fetch staff",
  );

// Update staff status
export const updateStaffStatus = (staffId: string, statusData: { status: string }) =>
  handleApi<void>(
    () => api.patch(`/v1/admin/staffs/${staffId}/status`, statusData),
    "Failed to update staff status",
  );
