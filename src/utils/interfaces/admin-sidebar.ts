import type { ReactNode } from "react"

export interface IAdminSidebarItem {
  label: string
  href: string
  icon: ReactNode
  disabled?: boolean
}

export interface IAdminSidebarProps {
  className?: string
  footer?: ReactNode
}

