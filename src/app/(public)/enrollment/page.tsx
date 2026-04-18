import { Suspense } from "react"

import { PublicEnrollmentScreen } from "@/lib/ui/screens/public/enrollment"

export default function EnrollmentPage() {
  return (
    <Suspense fallback={<div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">Loading…</div>}>
      <PublicEnrollmentScreen />
    </Suspense>
  )
}
