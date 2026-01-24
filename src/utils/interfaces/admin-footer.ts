import type { ReactNode } from "react"

export interface IAdminFooterLink {
  label: string
  href: string
}

export interface IAdminFooterProps {
  className?: string
  links?: IAdminFooterLink[]
  children?: ReactNode
}

