import { Suspense } from "react"
import { PublicContactScreen } from "@/lib/ui/screens/public/contact"

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">Loading...</div>}>
      <PublicContactScreen />
    </Suspense>
  )
}

