import type { IContactFormCourse } from "./courses"

/** Payload for POST /enrollment-application/submit */
export interface IEnrollmentApplicationSubmit {
  name: string
  email: string
  phone: string
  courses: IContactFormCourse[]
  message?: string
  feePaymentScreenshotDataUrl: string
}

export type EnrollmentApplicationStatus = "pending" | "approved" | "rejected"

export interface IEnrollmentApplication {
  _id: string
  name: string
  email: string
  phone: string
  courses: IContactFormCourse[]
  message?: string
  feePaymentScreenshotRelativePath: string
  status: EnrollmentApplicationStatus
  reviewedAt?: string
  createdUserId?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}
