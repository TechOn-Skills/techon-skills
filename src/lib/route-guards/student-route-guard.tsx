"use client";

import { useUser } from "@/lib/providers/user";
import { CONFIG } from "@/utils/constants";
import { UserRole } from "@/utils/enums/user";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const ADMIN_ROLES = [UserRole.SUPER_ADMIN, UserRole.ADMIN];

export function StudentRouteGuard({ children }: { children: ReactNode }) {
  const { userProfileInfo, profileLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!profileLoaded) return;

    const role = userProfileInfo?.role;

    if (!userProfileInfo) {
      router.replace(CONFIG.ROUTES.PUBLIC.HOME);
      return;
    }

    if (role && ADMIN_ROLES.includes(role)) {
      router.replace(CONFIG.ROUTES.ADMIN.DASHBOARD);
      return;
    }

    if (role && role !== UserRole.STUDENT) {
      router.replace(CONFIG.ROUTES.PUBLIC.HOME);
    }
  }, [profileLoaded, userProfileInfo, router]);

  if (!profileLoaded) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--brand-primary) border-t-transparent" />
      </div>
    );
  }

  const role = userProfileInfo?.role;
  if (
    !userProfileInfo ||
    (role && ADMIN_ROLES.includes(role)) ||
    (role && role !== UserRole.STUDENT)
  ) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--brand-primary) border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
