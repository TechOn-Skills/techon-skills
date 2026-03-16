"use client"

import { usePathname } from "next/navigation"
import NextTopLoader from "nextjs-toploader"

/** Renders the top progress bar only when not on student courses page (no use there when clicking Enroll). */
export function TopLoaderWrapper() {
  const pathname = usePathname()
  const show = pathname !== "/student/courses"
  if (!show) return null
  return (
    <NextTopLoader
      color="#2299DD"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #2299DD, 0 0 5px #2299DD"
    />
  )
}
