import { getConfig } from "@/lib/services/config";
import { fetchURL, getClientTimezone, handleApiResponse } from "@/lib/helpers";
import { CONFIG } from "@/utils/constants";
import { FetchMethod } from "@/utils/enums";
import {
    ApiResponse,
    IContactFormSubmission,
    IEnrollmentApplication,
    IEnrollmentApplicationSubmit,
    IUser,
    IUserProfileInfo,
} from "@/utils/interfaces";

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

    sendEmailToUser = async (userId: string, subject: string, body: string): Promise<ApiResponse<unknown>> => {
        const path = CONFIG.BACKEND_PATHS.AUTH.SEND_EMAIL_TO_USER;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST, body: JSON.stringify({ userId, subject, body }), headers: { "Content-Type": "application/json" } } });
        return handleApiResponse<unknown>(response);
    }

    /** Upload image. category: courses | articles | users | profiles. subPath optional (e.g. userId for users/123). */
    uploadImage = async (file: File, category: string, subPath?: string): Promise<ApiResponse<{ url: string; filename: string; relativePath?: string }>> => {
        const { BACKEND_URL } = getConfig();
        const path = CONFIG.BACKEND_PATHS.UPLOAD.IMAGE;
        const formData = new FormData();
        formData.append("category", category);
        if (subPath) formData.append("subPath", subPath);
        formData.append("image", file);
        const tz = getClientTimezone();
        const response = await fetch(`${BACKEND_URL}${path}`, {
            method: FetchMethod.POST,
            body: formData,
            credentials: "include",
            headers: tz ? { "X-Timezone": tz } : undefined,
        });
        const json = await response.json();
        if (json?.data?.url) {
            json.data.url = json.data.url.startsWith("http") ? json.data.url : `${BACKEND_URL.replace(/\/$/, "")}${json.data.url}`;
        }
        return json as ApiResponse<{ url: string; filename: string; relativePath?: string }>;
    }

    getUploadedImages = async (params?: { category?: string; subPath?: string }): Promise<ApiResponse<{ id: string; category: string; subPath: string; filename: string; url: string; relativePath: string; createdAt: string }[]>> => {
        const { BACKEND_URL } = getConfig();
        const q = new URLSearchParams();
        if (params?.category) q.set("category", params.category);
        if (params?.subPath) q.set("subPath", params.subPath);
        const path = `${CONFIG.BACKEND_PATHS.UPLOAD.IMAGES}${q.toString() ? `?${q.toString()}` : ""}`;
        const tz = getClientTimezone();
        const response = await fetch(`${BACKEND_URL}${path}`, {
            method: FetchMethod.GET,
            credentials: "include",
            headers: tz ? { "X-Timezone": tz } : undefined,
        });
        return handleApiResponse(response);
    }

    deleteUploadedImage = async (id: string): Promise<ApiResponse<unknown>> => {
        const { BACKEND_URL } = getConfig();
        const tz = getClientTimezone();
        const response = await fetch(`${BACKEND_URL}${CONFIG.BACKEND_PATHS.UPLOAD.IMAGE_DELETE}/${id}`, {
            method: FetchMethod.DELETE,
            credentials: "include",
            headers: tz ? { "X-Timezone": tz } : undefined,
        });
        return handleApiResponse(response);
    }

    submitEnrollmentApplication = async (
        formData: IEnrollmentApplicationSubmit
    ): Promise<ApiResponse<IEnrollmentApplication>> => {
        const path = CONFIG.BACKEND_PATHS.ENROLLMENT_APPLICATION.SUBMIT;
        const response = await fetchURL({
            path,
            isGraphQL: false,
            options: {
                method: FetchMethod.POST,
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            },
        });
        return handleApiResponse<IEnrollmentApplication>(response);
    }

    getEnrollmentApplications = async (
        page: number,
        limit: number,
        status?: string
    ): Promise<ApiResponse<IEnrollmentApplication[]>> => {
        const q = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) q.set("status", status);
        const path = `${CONFIG.BACKEND_PATHS.ENROLLMENT_APPLICATION.LIST}?${q.toString()}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.GET } });
        return handleApiResponse<IEnrollmentApplication[]>(response);
    }

    approveEnrollmentApplication = async (applicationId: string): Promise<ApiResponse<unknown>> => {
        const path = `${CONFIG.BACKEND_PATHS.ENROLLMENT_APPLICATION.APPROVE}?application_id=${encodeURIComponent(applicationId)}`;
        const response = await fetchURL({ path, isGraphQL: false, options: { method: FetchMethod.POST } });
        return handleApiResponse(response);
    }

    rejectEnrollmentApplication = async (applicationId: string, reason?: string): Promise<ApiResponse<IEnrollmentApplication>> => {
        const path = `${CONFIG.BACKEND_PATHS.ENROLLMENT_APPLICATION.REJECT}?application_id=${encodeURIComponent(applicationId)}`;
        const response = await fetchURL({
            path,
            isGraphQL: false,
            options: {
                method: FetchMethod.POST,
                body: JSON.stringify({ reason: reason ?? "" }),
                headers: { "Content-Type": "application/json" },
            },
        });
        return handleApiResponse<IEnrollmentApplication>(response);
    }
}

export const apiService = new ApiService();