import {
  type ParentPaginationResponse,
  type ParentPayload,
  type ParentResponse,
  type ParentSearchResponse,
} from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Search parents by query string with pagination
export const searchParents = (query: string, page = 1) =>
  handleApi<ParentSearchResponse>(
    () => api.get<ParentSearchResponse>(`/v1/admin/parents?search=${query}&page=${page}`),
    "Failed to search parents",
  );

// Add a new parent
export const addParent = (parentData: ParentPayload) =>
  handleApi<ParentResponse>(
    () => api.post<ParentResponse>("/v1/admin/parents", parentData),
    "Failed to add parent",
  );

// Fetch all parents with pagination, search, and filter options
export const getAllParents = (page: number, limit: number, search?: string, filter?: string) =>
  handleApi<ParentPaginationResponse>(
    () =>
      api.get<ParentPaginationResponse>("/v1/admin/parents", {
        params: { page, limit, search, filter },
      }),
    "Failed to fetch parents",
  );

// Fetch a parent by ID
export const getParentById = (parentId: string) =>
  handleApi<ParentResponse>(
    () => api.get<ParentResponse>(`/v1/admin/parents/${parentId}`),
    "Failed to fetch parent details",
  );
