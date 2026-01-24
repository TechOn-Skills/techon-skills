import type { ReactNode } from "react"

export interface IStudentFooterLink {
  label: string
  href: string
}

export interface IStudentFooterProps {
  className?: string
  links?: IStudentFooterLink[]
  children?: ReactNode
}

