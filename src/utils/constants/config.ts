export const CONFIG = {
    STORAGE_KEYS: {
        AUTH: {
            TOKEN: "token",
            REFRESH_TOKEN: "refresh-token",
            EXPIRES_IN: "expires-in",
        },
        USER_PREFERENCES: {
            THEME: "theme",
            LANGUAGE: "language"
        },
        USER: {
            PROFILE: "profile",
        },
    },
    BACKEND_PATHS: {
        GRAPHQL: "graphql-techonskills",
        FORM: {
            SUBMIT: "/contact-form/submit",
            GET_CONTACT_SUBMISSIONS: "/contact-form/get-contact-form-requests",
            SEND_EMAIL: "/contact-form/send-email",
            ASSIGN_COURSES: "/contact-form/assign-courses",
        },
        AUTH: {
            SEND_MAGIC_LINK: "/auth/send-magic-link",
            VERIFY_MAGIC_LINK: "/auth/verify-magic-link",
            LIST_STUDENT_REGISTRATION_REQUESTS: "/auth/get-student-registration-requests",
            APPROVE_STUDENT_REGISTRATION_REQUEST: "/auth/approve-student-registration-request",
            TOGGLE_BLOCK_STUDENT: "/auth/toggle-block-student",
            TOGGLE_SUSPEND_STUDENT: "/auth/toggle-suspend-student",
            TOGGLE_DELETE_STUDENT: "/auth/toggle-delete-student",
            GET_USER_PROFILE_INFO: "/auth/get-user-profile-info",
        }
    },
    ROUTES: {
        PUBLIC: {
            HOME: "/",
            COURSES: "/courses",
            ABOUT: "/about",
            CONTACT: "/contact",
            FAQS: "/faqs",
            TERMS_OF_SERVICE: "/terms-of-service",
            PRIVACY_POLICY: "/privacy-policy",
            REFUND_POLICY: "/refund-policy",
            COOKIE_POLICY: "/cookie-policy",
            SUPPORT: "/support",
            VERIFY_MAGIC_LINK: "/auth/verify-magic-link",
        },
        NOT_FOUND_404: "/404",
        AUTH: {
            VERIFY_MAGIC_LINK: "/auth/verify-magic-link",
        },
        ADMIN: {
            DASHBOARD: "/admin/dashboard",
            REGISTRATION_REQUESTS: "/admin/registration-requests",
            CONTACT_SUBMISSIONS: "/admin/contact-submissions",
            USERS: "/admin/users",
            TICKETS: "/admin/tickets",
            NEWS: "/admin/news",
            LOGS: "/admin/logs",
            SETTINGS: "/admin/settings",
            EVENTS: "/admin/events",
            COURSES: "/admin/courses",
        },
        STUDENT: {
            HOME: "/student",
            DASHBOARD: "/student/dashboard",
            PROFILE: "/student/profile",
            SETTINGS: "/student/settings",
            ASSIGNMENTS: "/student/assignments",
            COURSES: "/student/courses",
            NEWS: "/student/news",
            ANNOUNCEMENTS: "/student/announcements",
            FEES: "/student/fees",
            EVENTS: "/student/events",
            ABOUT: "/student/about",
            CONTACT: "/student/contact",
            FAQs: "/student/faqs",
            TERMS_OF_SERVICE: "/student/terms-of-service",
            PRIVACY_POLICY: "/student/privacy-policy",
            REFUND_POLICY: "/student/refund-policy",
            COOKIE_POLICY: "/student/cookie-policy",
            SUPPORT: "/student/support",
        },
    }
}