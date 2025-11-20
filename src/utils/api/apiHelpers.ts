import axios from "axios";

export interface ApiErrorShape {
  message: string;
  status?: number;
  data?: unknown;
}

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Centralized API error handler — fully typed, no any
 */

export const handleApiError = (error: unknown, fallbackMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    const data = error.response?.data;

    const message = (data as { message?: string } | undefined)?.message ?? fallbackMessage;

    throw new ApiError(message, status, data);
  }

  throw new ApiError(fallbackMessage);
};

/**
 * Typed API wrapper
 * - T = expected return type
 * - callback must return `Promise<{ data: T }>` or `Promise<T>`
 */
export const handleApi = async <T>(
  callback: () => Promise<{ data: T } | T>,
  fallbackMessage: string,
): Promise<T> => {
  try {
    const result = await callback();

    if (typeof result === "object" && result !== null && "data" in result) {
      return (result as { data: T }).data;
    }

    return result as T;
  } catch (error) {
    return handleApiError(error, fallbackMessage);
  }
};
