import axios from "axios";


export interface ApiError {
  status: number | null;
  code: string;
  message: string;
  details?: unknown;
}


interface ErrorPayload {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };

  detail?: string;
  message?: string;
}


export function normalizeApiError(
  error: unknown,
): ApiError {
  if (!axios.isAxiosError(error)) {
    return {
      status: null,
      code: "UNKNOWN_ERROR",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }

  const payload =
    error.response?.data as
      | ErrorPayload
      | undefined;

  const status =
    error.response?.status
    ?? null;

  const code =
    payload?.error?.code
    ?? (
      status
        ? `HTTP_${status}`
        : "NETWORK_ERROR"
    );

  const message =
    payload?.error?.message
    ?? payload?.detail
    ?? payload?.message
    ?? (
      error.code === "ECONNABORTED"
        ? "The request timed out."
        : error.message
    )
    ?? "Request failed.";

  return {
    status,
    code,
    message,
    details:
      payload?.error?.details,
  };
}