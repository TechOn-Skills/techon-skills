import { CalendarIcon, LogsIcon, NewspaperIcon, SettingsIcon, TicketIcon, UsersIcon, LayoutDashboardIcon } from "lucide-react"
import { CONFIG } from "./config"

export const ADMIN_SIDEBAR_ITEMS = [
    { label: "Dashboard", href: CONFIG.ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboardIcon, disabled: false },
    { label: "Users", href: CONFIG.ROUTES.ADMIN.USERS, icon: UsersIcon, disabled: false },
    { label: "Tickets", href: CONFIG.ROUTES.ADMIN.TICKETS, icon: TicketIcon, disabled: false },
    { label: "News", href: CONFIG.ROUTES.ADMIN.NEWS, icon: NewspaperIcon, disabled: false },
    { label: "Logs", href: CONFIG.ROUTES.ADMIN.LOGS, icon: LogsIcon, disabled: false },
    { label: "Settings", href: CONFIG.ROUTES.ADMIN.SETTINGS, icon: SettingsIcon, disabled: false },
    { label: "Events", href: CONFIG.ROUTES.ADMIN.EVENTS, icon: CalendarIcon, disabled: false },
    { label: "Courses", href: CONFIG.ROUTES.ADMIN.COURSES, icon: TicketIcon, disabled: false },
]