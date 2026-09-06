import { Suspense } from "react"
import { AdminAttendanceScreen } from "@/lib/ui/screens/admin/attendance"

export default function AdminAttendancePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--brand-primary) border-t-transparent" />
        </div>
      }
    >
      <AdminAttendanceScreen />
    </Suspense>
  )
}
