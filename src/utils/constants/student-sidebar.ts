import { BookIcon, CalendarIcon, LayoutDashboardIcon, ListTodoIcon, SettingsIcon, UserIcon, NewspaperIcon } from "lucide-react"
import { CONFIG } from "./config"

const STUDENT_ROUTES = CONFIG.ROUTES.STUDENT;

export const STUDENT_SIDEBAR_ITEMS = [
    { label: "My Lectures", href: STUDENT_ROUTES.DASHBOARD, icon: LayoutDashboardIcon, disabled: false },
    { label: "Courses", href: STUDENT_ROUTES.COURSES, icon: BookIcon, disabled: false },
    { label: "News", href: STUDENT_ROUTES.NEWS, icon: NewspaperIcon, disabled: false },
    { label: "Events", href: STUDENT_ROUTES.EVENTS, icon: CalendarIcon, disabled: false },
    { label: "Profile", href: STUDENT_ROUTES.PROFILE, icon: UserIcon, disabled: false },
    { label: "Settings", href: STUDENT_ROUTES.SETTINGS, icon: SettingsIcon, disabled: false },
    { label: "My Assignments", href: STUDENT_ROUTES.ASSIGNMENTS, icon: ListTodoIcon, disabled: false },
]