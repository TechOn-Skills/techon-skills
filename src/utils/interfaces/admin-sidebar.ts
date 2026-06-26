import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { UserRole } from "@/utils/enums/user"

export interface IAdminSidebarItem {
  label: string
  href: string
  icon: LucideIcon
  disabled?: boolean
  roles?: readonly UserRole[]
}

export interface IAdminSidebarProps {
  className?: string
  footer?: ReactNode
}

