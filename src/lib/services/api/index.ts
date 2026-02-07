import { fetchURL } from "@/lib/helpers";
import { CONFIG } from "@/utils/constants";
import { FetchMethod } from "@/utils/enums";
import { ApiResponse } from "@/utils/interfaces";

class ApiService {
    constructor() { }

    sendMagicLink = async <T>(email: string): Promise<ApiResponse<T>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.SEND_MAGIC_LINK}?email=${email}`;
        const response = await fetchURL({
            path,
            isGraphQL: false,
            options: {
                method: FetchMethod.POST,
            },
        })
        if (!response) {
            return { success: false, message: "Unable to reach server" } as ApiResponse<T>;
        }
        const parsedResponse: ApiResponse<T> = await response.json();

        return parsedResponse;
    }
    verifyMagicLink = async <T>(userId: string): Promise<ApiResponse<T>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.VERIFY_MAGIC_LINK}?user_id=${userId}`;
        const response = await fetchURL({
            path,
            isGraphQL: false,
            options: {
                method: FetchMethod.GET,
            },
        })
        if (!response) {
            return { success: false, message: "Unable to reach server" } as ApiResponse<T>;
        }
        const parsedResponse: ApiResponse<T> = await response.json();

        return parsedResponse;
    }
}

export const apiService = new ApiService();