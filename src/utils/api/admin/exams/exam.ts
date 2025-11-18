import { type Exam, type ExamsResponse } from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// -------------------------------
// Get All Examinations (Admin)
// -------------------------------
export const getAllExaminations = async (page = 1, limit = 50): Promise<ExamsResponse> => {
  return handleApi(
    () =>
      api.get<ExamsResponse>("/v1/admin/examination", {
        params: { page, limit },
      }),
    "Failed to fetch examinations",
  );
};

// --------------------------------------
// Approve / Reject / Schedule Exam
// --------------------------------------
export const updateExaminationStatus = async (
  examId: string,
  status: "approve" | "reject" | "scheduled",
): Promise<{ data: Exam }> => {
  return handleApi(
    () =>
      api.patch<{ data: Exam }>(`/v1/admin/examination/${examId}/approve`, {
        status,
      }),
    "Failed to approve examination",
  );
};
