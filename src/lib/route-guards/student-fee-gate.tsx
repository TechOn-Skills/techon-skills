"use client"

import { useQuery } from "@apollo/client/react"
import { usePathname, useRouter } from "next/navigation"
import { Fragment, ReactNode, useEffect } from "react"

import { GET_PAYMENTS_BY_USER } from "@/lib/graphql"
import { isDueMonthReached } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"
import { CONFIG } from "@/utils/constants"
import { UserRole, UserStatus } from "@/utils/enums/user"
import { StudentLayout } from "@/lib/layouts"
import { ContentAreaLoader } from "@/lib/ui/useable-components/content-area-loader"

const STUDENT_FEES_PATH = CONFIG.ROUTES.STUDENT.FEES

function normalizePath(path: string | null): string {
  if (!path) return ""
  return path.split("?")[0]?.replace(/\/$/, "") ?? ""
}

function isFeesPath(path: string | null): boolean {
  return normalizePath(path) === STUDENT_FEES_PATH
}

function hasOverdueUnpaidPayment(
  payments: Array<{ paymentDate: string; isPaid: boolean }> | undefined
): boolean {
  if (!payments?.length) return false
  return payments.some((p) => !p.isPaid && isDueMonthReached(p.paymentDate))
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
  const path = normalizePath(pathname)
  const onFeesRoute = isFeesPath(pathname)

  const inactiveStudent =
    userProfileInfo?.role === UserRole.STUDENT && userProfileInfo?.status === UserStatus.INACTIVE

  const { data, loading } = useQuery<{
    getPaymentsByUser: Array<{ paymentDate: string; isPaid: boolean }>
  }>(GET_PAYMENTS_BY_USER, {
    variables: { userId },
    skip: !userId || inactiveStudent,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })

  const payments = data?.getPaymentsByUser ?? []
  const hasOverdue = hasOverdueUnpaidPayment(payments)

  useEffect(() => {
    if (!profileLoaded || loading) return
    if (!userId || inactiveStudent) return
    if (!hasOverdue) return
    if (onFeesRoute) return
    router.replace(STUDENT_FEES_PATH)
  }, [profileLoaded, loading, userId, inactiveStudent, hasOverdue, onFeesRoute, router])

  if (!profileLoaded || (userId && !inactiveStudent && loading)) {
    return (
      <StudentLayout>
        <ContentAreaLoader />
      </StudentLayout>
    )
  }

  if (userId && !inactiveStudent && hasOverdue && !onFeesRoute) {
    return (
      <StudentLayout>
        <ContentAreaLoader />
      </StudentLayout>
    )
  }

  return <Fragment key={path}>{children}</Fragment>
}
