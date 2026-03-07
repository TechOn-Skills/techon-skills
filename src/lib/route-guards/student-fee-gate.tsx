"use client"

import { useQuery } from "@apollo/client/react"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

import { GET_PAYMENTS_BY_USER } from "@/lib/graphql"
import { useUser } from "@/lib/providers/user"
import { CONFIG } from "@/utils/constants"

const STUDENT_FEES_PATH = "/student/fees"

/** Returns true if the user has at least one payment that is due (paymentDate <= today) and not paid. */
function hasOverdueUnpaidPayment(
  payments: Array<{ paymentDate: string; isPaid: boolean }> | undefined
): boolean {
  if (!payments?.length) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return payments.some((p) => {
    if (p.isPaid) return false
    const due = new Date(p.paymentDate)
    due.setHours(0, 0, 0, 0)
    return due.getTime() <= today.getTime()
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
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--brand-primary) border-t-transparent" />
      </div>
    )
  }

  if (userId && hasOverdue && pathname !== STUDENT_FEES_PATH) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--brand-primary) border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
