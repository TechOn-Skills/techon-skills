"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { GraduationCapIcon } from "lucide-react"

import { useCourses } from "@/lib/providers/courses"
import { CONFIG } from "@/utils/constants"
import { EnrollmentFormCard } from "@/lib/ui/screens/public/enrollment/enrollment-form-card"
import { Button } from "@/lib/ui/useable-components/button"

export { EnrollmentFormCard } from "@/lib/ui/screens/public/enrollment/enrollment-form-card"

export function PublicEnrollmentScreen() {
  const searchParams = useSearchParams()
  const courseSlug = searchParams.get("course")
  const { getCourseBySlug } = useCourses()
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined
  const initialCourse =
    course != null ? { slug: course.slug, title: course.title } : null

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-144 w-240 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(70,208,255,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-112 w-md rounded-full bg-[radial-gradient(circle_at_center,rgba(255,138,61,0.14),transparent_65%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
            <GraduationCapIcon className="size-3.5 text-(--brand-highlight)" />
            Enrollment
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Enroll in a course</h1>
          <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
            Complete your details, confirm course selection, pay the first fee total shown, and upload your payment screenshot.
            Your account stays pending until an administrator approves it.
          </p>
          {initialCourse ? (
            <p className="text-foreground text-sm font-medium">
              Selected course: <span className="text-(--brand-highlight)">{initialCourse.title}</span> — you can add or change
              courses in the form.
            </p>
          ) : null}
          <Button asChild variant="outline" shape="pill" size="sm">
            <Link href={CONFIG.ROUTES.PUBLIC.COURSES}>Browse all courses</Link>
          </Button>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.14),transparent_70%)] p-px">
          <div className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl p-6 sm:p-8">
            <EnrollmentFormCard initialCourse={initialCourse} variant="page" />
          </div>
        </div>
      </div>
    </div>
  )
}
