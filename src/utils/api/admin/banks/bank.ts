import { type BankResponse, type IBankAccount } from "@/types";
import { api } from "@/utils/api";
import { handleApi } from "../../apiHelpers";

// Create a new bank account
export const createBankAccount = (data: IBankAccount) =>
  handleApi<IBankAccount>(() => api.post("/v1/admin/banks", data), "Failed to create bank account");

// Fetch all banks
export const getBanks = () =>
  handleApi<BankResponse>(() => api.get<BankResponse>("/v1/admin/banks"), "Failed to fetch banks");
