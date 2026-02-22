import { CONFIG, HTTP_RESPONSES } from "@/utils/constants";
import { ApiResponse } from "@/utils/interfaces";
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";

export function getApiDisplayMessage(
  response: { detail?: string; message?: string },
  fallback: string
): string {
  return response.detail ?? response.message ?? fallback
}

export const handleApiResponse = async <T>(response: Response | null): Promise<ApiResponse<T>> => {
  if (!response) {
    return { success: false, message: "Unable to reach server" } as ApiResponse<T>;
  }
  if (response.status === HTTP_RESPONSES.HTTP_RESPONSE_401.code) {
    if (typeof window !== "undefined") {
      Object.values(CONFIG.STORAGE_KEYS.AUTH).forEach(key => {
        localStorage.removeItem(key);
      });
      toast.error("Your session has expired. Please login again.");
    }
    redirect(CONFIG.ROUTES.PUBLIC.HOME);
  }
  return response.json() as Promise<ApiResponse<T>>;
}
