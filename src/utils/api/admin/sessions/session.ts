import { type ISessionAndTerm, type Session, type SessionsResponse } from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Create a new academic session along with its terms
export const createSessionAndTerms = (data: ISessionAndTerm) =>
  handleApi<ISessionAndTerm>(
    () => api.post("/v1/admin/session-and-terms", data),
    "Failed to create session and terms",
  );

// Sessions API
export const getSessions = async (page = "1", limit = "10"): Promise<SessionsResponse> => {
  return handleApi(
    () =>
      api.get<SessionsResponse>("/v1/admin/session-and-terms", {
        params: { page, limit },
      }),
    "Failed to fetch sessions",
  );
};

// GET - All sessions
export const getAllSessions = async (): Promise<Session[]> => {
  return handleApi(
    () =>
      api
        .get<SessionsResponse>("/v1/admin/session-and-terms", {
          params: { page: "1", limit: "100" },
        })
        .then((r) => r.data.data?.result as Session[]),
    "Failed to fetch sessions",
  );
};
