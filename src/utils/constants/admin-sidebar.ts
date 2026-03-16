import { CalendarIcon, FileTextIcon, LogsIcon, NewspaperIcon, SettingsIcon, TicketIcon, UsersIcon, LayoutDashboardIcon, UserPlusIcon, InboxIcon, ImageIcon, BookOpenIcon, BanknoteIcon, ClipboardCheckIcon } from "lucide-react"
import { CONFIG } from "./config"

export const ADMIN_SIDEBAR_ITEMS = [
    { label: "Dashboard", href: CONFIG.ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboardIcon, disabled: false },
    { label: "Registration requests", href: CONFIG.ROUTES.ADMIN.REGISTRATION_REQUESTS, icon: UserPlusIcon, disabled: false },
    { label: "Enrollment requests", href: CONFIG.ROUTES.ADMIN.ENROLLMENT_REQUESTS, icon: BookOpenIcon, disabled: false },
    { label: "Contact submissions", href: CONFIG.ROUTES.ADMIN.CONTACT_SUBMISSIONS, icon: InboxIcon, disabled: false },
    { label: "Users", href: CONFIG.ROUTES.ADMIN.USERS, icon: UsersIcon, disabled: false },
    { label: "Tickets", href: CONFIG.ROUTES.ADMIN.TICKETS, icon: TicketIcon, disabled: false },
    { label: "News", href: CONFIG.ROUTES.ADMIN.NEWS, icon: NewspaperIcon, disabled: false },
    { label: "Articles", href: CONFIG.ROUTES.ADMIN.ARTICLES, icon: FileTextIcon, disabled: false },
    { label: "Logs", href: CONFIG.ROUTES.ADMIN.LOGS, icon: LogsIcon, disabled: false },
    { label: "Settings", href: CONFIG.ROUTES.ADMIN.SETTINGS, icon: SettingsIcon, disabled: false },
    { label: "Events", href: CONFIG.ROUTES.ADMIN.EVENTS, icon: CalendarIcon, disabled: false },
    { label: "Courses", href: CONFIG.ROUTES.ADMIN.COURSES, icon: TicketIcon, disabled: false },
    { label: "Payments", href: CONFIG.ROUTES.ADMIN.PAYMENTS, icon: BanknoteIcon, disabled: false },
    { label: "Submissions", href: CONFIG.ROUTES.ADMIN.SUBMISSIONS, icon: ClipboardCheckIcon, disabled: false },
    { label: "Uploaded images", href: CONFIG.ROUTES.ADMIN.IMAGES, icon: ImageIcon, disabled: false },
]