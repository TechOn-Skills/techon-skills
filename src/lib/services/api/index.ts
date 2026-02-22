import { fetchURL, handleApiResponse, logger } from "@/lib/helpers";
import { CONFIG } from "@/utils/constants";
import { FetchMethod, LoggerLevel } from "@/utils/enums";
import { ApiResponse, IContactFormSubmission, IUser, IUserProfileInfo } from "@/utils/interfaces";

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
        return handleApiResponse<T>(response);
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
        return handleApiResponse<T>(response);
    }

    logout = async (): Promise<ApiResponse<null>> => {
        const path = CONFIG.BACKEND_PATHS.AUTH.LOGOUT;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST } });
        return handleApiResponse<null>(response);
    }

    approveStudentRegistrationRequest = async (user_id: string): Promise<ApiResponse<IUser>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.APPROVE_STUDENT_REGISTRATION_REQUEST}?user_id=${user_id}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST } });
        return handleApiResponse<IUser>(response);
    }

    toggleBlockStudent = async (user_id: string): Promise<ApiResponse<IUserProfileInfo>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.TOGGLE_BLOCK_STUDENT}?user_id=${user_id}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST } });
        return handleApiResponse<IUserProfileInfo>(response);
    }

    toggleSuspendStudent = async (user_id: string): Promise<ApiResponse<IUserProfileInfo>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.TOGGLE_SUSPEND_STUDENT}?user_id=${user_id}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST } });
        return handleApiResponse<IUserProfileInfo>(response);
    }

    toggleDeleteStudent = async (user_id: string): Promise<ApiResponse<IUserProfileInfo>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.TOGGLE_DELETE_STUDENT}?user_id=${user_id}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST } });
        return handleApiResponse<IUserProfileInfo>(response);
    }

    getUserProfileInfo = async <T>(): Promise<ApiResponse<T>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.GET_USER_PROFILE_INFO}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.GET } });
        return handleApiResponse<T>(response);
    }

    submitContactForm = async <T>(formData: T): Promise<ApiResponse<T>> => {
        const path = `${CONFIG.BACKEND_PATHS.FORM.SUBMIT}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST, body: JSON.stringify(formData), headers: { "Content-Type": "application/json" } } });
        return handleApiResponse<T>(response);
    }

    getContactFormSubmissions = async (page: number, limit: number): Promise<ApiResponse<IContactFormSubmission[]>> => {
        const path = `${CONFIG.BACKEND_PATHS.FORM.GET_CONTACT_SUBMISSIONS}?page=${page}&limit=${limit}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.GET } });
        return handleApiResponse<IContactFormSubmission[]>(response);
    }

    getStudentRegistrationRequests = async (page: number, limit: number): Promise<ApiResponse<IUser[]>> => {
        const path = `${CONFIG.BACKEND_PATHS.AUTH.GET_STUDENT_REGISTRATION_REQUESTS}?page=${page}&limit=${limit}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.GET } });
        return handleApiResponse<IUser[]>(response);
    }

    sendEmailToContact = async (submissionId: string, subject: string, body: string): Promise<ApiResponse<unknown>> => {
        const path = CONFIG.BACKEND_PATHS.FORM.SEND_EMAIL;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST, body: JSON.stringify({ submissionId, subject, body }), headers: { "Content-Type": "application/json" } } });
        return handleApiResponse<unknown>(response);
    }

    assignCoursesToContact = async (submissionId: string, courseSlugs: string[]): Promise<ApiResponse<unknown>> => {
        const path = CONFIG.BACKEND_PATHS.FORM.ASSIGN_COURSES;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST, body: JSON.stringify({ submissionId, courseSlugs }), headers: { "Content-Type": "application/json" } } });
        return handleApiResponse<unknown>(response);
    }
}

export const apiService = new ApiService();