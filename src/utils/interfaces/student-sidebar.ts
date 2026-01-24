import type { ReactNode } from "react"

export interface IStudentSidebarItem {
  label: string
  href: string
  icon: ReactNode
  disabled?: boolean
}

export interface IStudentSidebarProps {
  className?: string
  footer?: ReactNode
}

