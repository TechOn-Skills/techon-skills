import type { IContactFormCourse } from "./courses"

export interface ICourseMultiSelectProps {
  value: IContactFormCourse[]
  onChange: (value: IContactFormCourse[]) => void
  placeholder?: string
  required?: boolean
  className?: string
  disabled?: boolean
}
