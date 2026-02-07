import { fetchURL } from "@/lib/helpers";
import { CONFIG } from "@/utils/constants";
import { FetchMethod } from "@/utils/enums";
import { ApiResponse, ICheckStudentStatus, IUser, IUserProfileInfo } from "@/utils/interfaces";

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

    approveStudentRegistrationRequest = async (email: string): Promise<ApiResponse<IUser>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.APPROVE_STUDENT_REGISTRATION_REQUEST}?email=${email}`;
        const response = await fetchURL({
            path,
            isGraphQL: false,
            options: {
                method: FetchMethod.POST,
            },
        })
        if (!response) {
            return { success: false, message: "Unable to reach server" } as ApiResponse<IUser>;
        }
        const parsedResponse: ApiResponse<IUser> = await response.json();

        return parsedResponse;
    }

    toggleBlockStudent = async (user_id: string): Promise<ApiResponse<IUserProfileInfo>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.TOGGLE_BLOCK_STUDENT}?user_id=${user_id}`;
        const response = await fetchURL({
            path,
            isGraphQL: false,
            options: {
                method: FetchMethod.POST,
            },
        })
        if (!response) {
            return { success: false, message: "Unable to reach server" } as ApiResponse<IUserProfileInfo>;
        }
        const parsedResponse: ApiResponse<IUserProfileInfo> = await response.json();

        return parsedResponse;
    }

    toggleSuspendStudent = async (user_id: string): Promise<ApiResponse<IUserProfileInfo>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.TOGGLE_SUSPEND_STUDENT}?user_id=${user_id}`;
        const response = await fetchURL({
            path,
            isGraphQL: false,
            options: {
                method: FetchMethod.POST,
            },
        })
        if (!response) {
            return { success: false, message: "Unable to reach server" } as ApiResponse<IUserProfileInfo>;
        }
        const parsedResponse: ApiResponse<IUserProfileInfo> = await response.json();

        return parsedResponse;
    }

    toggleDeleteStudent = async (user_id: string): Promise<ApiResponse<IUserProfileInfo>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.TOGGLE_DELETE_STUDENT}?user_id=${user_id}`;
        const response = await fetchURL({
            path,
            isGraphQL: false,
            options: {
                method: FetchMethod.POST,
            },
        })
        if (!response) {
            return { success: false, message: "Unable to reach server" } as ApiResponse<IUserProfileInfo>;
        }
        const parsedResponse: ApiResponse<IUserProfileInfo> = await response.json();

        return parsedResponse;
    }

    isUserAuthenticated = async <T>(): Promise<ApiResponse<T>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.IS_USER_AUTHENTICATED}`;
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