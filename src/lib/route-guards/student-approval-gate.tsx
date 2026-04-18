"use client"

import { usePathname, useRouter } from "next/navigation"
import { Fragment, ReactNode, useEffect } from "react"

import { useUser } from "@/lib/providers/user"
import { CONFIG } from "@/utils/constants"
import { UserRole, UserStatus } from "@/utils/enums/user"
import { StudentLayout } from "@/lib/layouts"
import { ContentAreaLoader } from "@/lib/ui/useable-components/content-area-loader"

function normalizePath(path: string | null): string {
  if (!path) return ""
  return path.split("?")[0]?.replace(/\/$/, "") ?? ""
}

/**
 * Students created by registration (contact form) stay INACTIVE until an admin approves them.
 * They may sign in but only see the pending-approval screen until status becomes ACTIVE.
 */
export function StudentApprovalGate({ children }: { children: ReactNode }) {
  const { userProfileInfo, profileLoaded } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const path = normalizePath(pathname)
  const pendingPath = CONFIG.ROUTES.STUDENT.PENDING_APPROVAL

  const role = userProfileInfo?.role
  const status = userProfileInfo?.status
  const needsApproval =
    role === UserRole.STUDENT && status === UserStatus.INACTIVE

  useEffect(() => {
    if (!profileLoaded || !userProfileInfo) return
    if (!needsApproval) return
    if (path === pendingPath) return
    router.replace(pendingPath)
  }, [profileLoaded, userProfileInfo, needsApproval, path, pendingPath, router])

  if (!profileLoaded) {
    return (
      <StudentLayout>
        <ContentAreaLoader />
      </StudentLayout>
    )
  }

  if (needsApproval && path !== pendingPath) {
    return (
      <StudentLayout>
        <ContentAreaLoader />
      </StudentLayout>
    )
  }

  return <Fragment key={path}>{children}</Fragment>
}
