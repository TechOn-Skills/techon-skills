import { CONFIG, HTTP_RESPONSES } from "@/utils/constants";
import { ApiResponse } from "@/utils/interfaces";

export function getApiDisplayMessage(
  response: { detail?: string; message?: string },
  fallback: string
): string {
  return response.detail ?? response.message ?? fallback
}

type HandleApiResponseOptions = {
  /** When true, clears auth storage on 401 (use only for explicit session checks). */
  logoutOnUnauthorized?: boolean
}

export const handleApiResponse = async <T>(
  response: Response | null,
  options?: HandleApiResponseOptions
): Promise<ApiResponse<T>> => {
  if (!response) {
    return { success: false, message: "Unable to reach server" } as ApiResponse<T>;
  }

  const body = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (response.status === HTTP_RESPONSES.HTTP_RESPONSE_401.code) {
    if (options?.logoutOnUnauthorized && typeof window !== "undefined") {
      Object.values(CONFIG.STORAGE_KEYS.AUTH).forEach((key) => {
        localStorage.removeItem(key);
      });
    }
    return {
      success: false,
      message: body.message ?? HTTP_RESPONSES.HTTP_RESPONSE_401.message,
      detail: body.detail ?? "Please sign in and try again.",
    } as ApiResponse<T>;
  }

  return body;
}
