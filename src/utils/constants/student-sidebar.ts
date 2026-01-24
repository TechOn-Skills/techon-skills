import { BookIcon, CalendarIcon, CreditCardIcon, LayoutDashboardIcon, ListTodoIcon, MegaphoneIcon, SettingsIcon, UserIcon } from "lucide-react"
import { CONFIG } from "./config"

const STUDENT_ROUTES = CONFIG.ROUTES.STUDENT;

export const STUDENT_SIDEBAR_ITEMS = [
    { label: "My Lectures", href: STUDENT_ROUTES.DASHBOARD, icon: LayoutDashboardIcon, disabled: false },
    { label: "Courses", href: STUDENT_ROUTES.COURSES, icon: BookIcon, disabled: false },
    { label: "Announcements", href: STUDENT_ROUTES.ANNOUNCEMENTS, icon: MegaphoneIcon, disabled: false },
    { label: "My Assignments", href: STUDENT_ROUTES.ASSIGNMENTS, icon: ListTodoIcon, disabled: false },
    { label: "Fees", href: STUDENT_ROUTES.FEES, icon: CreditCardIcon, disabled: false },
    { label: "Events", href: STUDENT_ROUTES.EVENTS, icon: CalendarIcon, disabled: false },
    { label: "Profile", href: STUDENT_ROUTES.PROFILE, icon: UserIcon, disabled: false },
    { label: "Settings", href: STUDENT_ROUTES.SETTINGS, icon: SettingsIcon, disabled: false },
]