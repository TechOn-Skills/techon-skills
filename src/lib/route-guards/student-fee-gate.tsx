"use client"

import { useQuery } from "@apollo/client/react"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

import { GET_PAYMENTS_BY_USER } from "@/lib/graphql"
import { useUser } from "@/lib/providers/user"
import { CONFIG } from "@/utils/constants"
import { StudentLayout } from "@/lib/layouts"
import { ContentAreaLoader } from "@/lib/ui/useable-components/content-area-loader"

const STUDENT_FEES_PATH = "/student/fees"

/**
 * Fee is due when the month of the due date (12th) is equal to or less than the current month.
 * Example: due date March 12 → due from March 1 onwards; due date April 12 → due from April 1 onwards.
 */
function hasOverdueUnpaidPayment(
  payments: Array<{ paymentDate: string; isPaid: boolean }> | undefined
): boolean {
  if (!payments?.length) return false
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  return payments.some((p) => {
    if (p.isPaid) return false
    const due = new Date(p.paymentDate)
    const dueYear = due.getFullYear()
    const dueMonth = due.getMonth()
    return dueYear < currentYear || (dueYear === currentYear && dueMonth <= currentMonth)
  })
}

/**
 * Blocks access to student dashboard (and all student routes except /student/fees) until
 * the student has no overdue unpaid fees. Admin must verify payment and mark as paid.
 */
export function StudentFeeGate({ children }: { children: ReactNode }) {
  const { userProfileInfo, profileLoaded } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const userId = userProfileInfo?.id ?? ""

  const { data, loading } = useQuery<{
    getPaymentsByUser: Array<{ paymentDate: string; isPaid: boolean }>
  }>(GET_PAYMENTS_BY_USER, {
    variables: { userId },
    skip: !userId,
  })

  const payments = data?.getPaymentsByUser ?? []
  const hasOverdue = hasOverdueUnpaidPayment(payments)

  useEffect(() => {
    if (!profileLoaded || loading) return
    if (!userId) return
    if (!hasOverdue) return
    if (pathname === STUDENT_FEES_PATH) return
    router.replace(STUDENT_FEES_PATH)
  }, [profileLoaded, loading, userId, hasOverdue, pathname, router])

  if (!profileLoaded || (userId && loading)) {
    return (
      <StudentLayout>
        <ContentAreaLoader />
      </StudentLayout>
    )
  }

  if (userId && hasOverdue && pathname !== STUDENT_FEES_PATH) {
    return (
      <StudentLayout>
        <ContentAreaLoader />
      </StudentLayout>
    )
  }

  return <>{children}</>
}
