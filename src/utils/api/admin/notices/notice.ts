import { type Notice, type NoticeFormData, type NoticesResponse } from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// -------------------------------
// Create Notice
// -------------------------------
export const createNotice = async (payload: NoticeFormData): Promise<Notice> => {
  return handleApi(() => api.post<Notice>("/v1/admin/notices", payload), "Failed to create notice");
};

// ----------------------------------------------
// Get All Notices (with search, filter, etc.)
// ----------------------------------------------
export const getAllNotices = async (
  search = "",
  filter = "",
  page = 1,
  limit = 20,
): Promise<NoticesResponse> => {
  return handleApi(
    () =>
      api.get<NoticesResponse>("/v1/admin/notices", {
        params: { search, filter, page, limit },
      }),
    "Failed to fetch notices",
  );
};

// -------------------------------
// Update Notice
// -------------------------------
export const updateNotice = async (
  noticeId: string,
  payload: Partial<NoticeFormData>,
): Promise<Notice> => {
  return handleApi(
    () => api.patch<Notice>(`/v1/admin/notices/${noticeId}`, payload),
    "Failed to update notice",
  );
};

// -------------------------------
// Delete Notice
// -------------------------------
export const deleteNotice = async (noticeId: string): Promise<void> => {
  return handleApi(() => api.delete(`/v1/admin/notices/${noticeId}`), "Failed to delete notice");
};
