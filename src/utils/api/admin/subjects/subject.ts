import {
  type ISubjectPayload,
  type ISubjectResponse,
  type SubjectPaginationResponse,
} from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Subject-related API calls
export const createSubject = async (subjectData: ISubjectPayload): Promise<ISubjectResponse> => {
  return handleApi(
    () => api.post<ISubjectResponse>("/v1/admin/subject", subjectData),
    "Failed to create subject",
  );
};

// Fetch subjects with pagination and search
export const getSubjects = async (page = 1, search = ""): Promise<SubjectPaginationResponse> => {
  return handleApi(
    () =>
      api.get<SubjectPaginationResponse>("/v1/admin/subject", {
        params: { page, search, limit: 100 },
      }),
    "Failed to fetch subjects",
  );
};
