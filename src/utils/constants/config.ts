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
    },
    ROUTES: {
        AUTH: {
            LOGIN: "/auth/login",
            VERIFY_MAGIC_LINK: "/auth/verify-magic-link",
        },
        ADMIN: {
            DASHBOARD: "/admin/dashboard",
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