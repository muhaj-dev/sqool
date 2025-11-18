import {
  type CreateFeeData,
  type FeesResponse,
  type FeeStructure,
  type GetFeesParams,
  type PaymentPaginationResponse,
  type UpdateFeeData,
} from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Payment-related API calls
export const adminC = async (paymentData: {
  paymentMemo: File | null;
  userId: string;
  paymentDate: string;
  paymentStatus: string;
  amount: string;
}): Promise<PaymentResponse> => {
  return handleApi(() => {
    const formData = new FormData();
    if (paymentData.paymentMemo) formData.append("paymentMemo", paymentData.paymentMemo);
    formData.append("userId", paymentData.userId);
    formData.append("paymentDate", paymentData.paymentDate);
    formData.append("paymentStatus", paymentData.paymentStatus);
    formData.append("amount", paymentData.amount);

    return api.post<PaymentResponse>("/v1/admin/payment", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }, "Failed to create payment");
};

// get all payments
export const getPayments = async (
  page = 1,
  limit = 10,
  paymentStatus?: string,
): Promise<PaymentPaginationResponse> => {
  return handleApi(
    () =>
      api.get<PaymentPaginationResponse>("/v1/admin/payment", {
        params: { page, limit, paymentStatus },
      }),
    "Failed to fetch payments",
  );
};

// get single payment
export const getPayment = async (paymentId: string): Promise<PaymentResponse> => {
  return handleApi(
    () => api.get<PaymentResponse>(`/v1/admin/payment/${paymentId}`),
    "Failed to fetch payment",
  );
};

// update payment
export const updatePayment = async (
  paymentId: string,
  paymentData: {
    paymentDate?: string;
    paymentStatus?: string;
    amount?: string;
    userId?: string;
  },
): Promise<PaymentResponse> => {
  return handleApi(
    () => api.patch<PaymentResponse>(`/v1/admin/payment/${paymentId}`, paymentData),
    "Failed to update payment",
  );
};

// GET - Get all school fees
export const getSchoolFees = async (params: GetFeesParams = {}): Promise<FeesResponse> => {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.filter) queryParams.append("filter", params.filter);
  if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params.class) queryParams.append("class", params.class);
  if (params.session) queryParams.append("session", params.session);

  const url = `/v1/admin/schools/fee${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return handleApi(() => api.get<FeesResponse>(url), "Failed to fetch school fees");
};

// POST - Create a new fee structure
export const createFeeStructure = async (feeData: CreateFeeData): Promise<FeeStructure> => {
  const requestData = {
    class: feeData.class,
    session: feeData.session,
    totalAmount: feeData.totalAmount,
    terms: feeData.terms,
  };

  return handleApi(
    () => api.post<FeeStructure>("/v1/admin/schools/fee", requestData),
    "Failed to create fee structure",
  );
};

// PATCH - Update fee structure
export const updateFeeStructure = async (
  feeId: string,
  updateData: UpdateFeeData,
): Promise<FeeStructure> => {
  const requestData: Partial<UpdateFeeData> = {};
  if (updateData.totalAmount !== undefined) requestData.totalAmount = updateData.totalAmount;
  if (updateData.terms !== undefined) requestData.terms = updateData.terms;
  if (updateData.isActive !== undefined) requestData.isActive = updateData.isActive;

  return handleApi(
    () => api.patch<FeeStructure>(`/v1/admin/schools/fee/${feeId}`, requestData),
    "Failed to update fee structure",
  );
};

// DELETE - Delete fee structure
export const deleteFeeStructure = async (feeId: string): Promise<{ message: string }> => {
  return handleApi(
    () => api.delete<{ message: string }>(`/v1/admin/schools/fee/${feeId}`),
    "Failed to delete fee structure",
  );
};

// GET - Single fee structure by ID
export const getFeeStructureById = async (feeId: string): Promise<FeeStructure> => {
  return handleApi(
    () => api.get<FeeStructure>(`/v1/admin/schools/fee/${feeId}`),
    "Failed to fetch fee structure",
  );
};

// PATCH - Publish a fee structure
export const publishFeeStructure = async (feeId: string) => {
  return handleApi(
    () => api.patch(`/v1/admin/schools/fee/publish/${feeId}`),
    "Failed to publish fee structure",
  );
};

// GET - Parent fees
export const getParentFees = async (): Promise<FeesResponse> => {
  return handleApi(() => api.get<FeesResponse>("/v1/parent/fees"), "Failed to fetch parent fees");
};
