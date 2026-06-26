"use client"

import { useUser } from "@/lib/providers/user"
import { BookOpenIcon } from "lucide-react"
import { EnrolledCourseCard } from "@/lib/ui/useable-components/enrolled-course-card"

export const MyEnrolledCoursesScreen = () => {
  const { enrolledCoursesFromApi } = useUser()
  const courses = enrolledCoursesFromApi ?? []

  if (courses.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border bg-background/70 backdrop-blur">
        <BookOpenIcon className="text-muted-foreground/50 size-16" />
        <h2 className="mt-4 text-xl font-semibold">No enrolled courses</h2>
        <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
          You don&apos;t have any enrolled courses yet. Contact your admin to get access.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Enrolled Courses</h1>
        <p className="text-muted-foreground mt-1 text-sm">Open a course to see quizzes and assignments.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <EnrolledCourseCard key={c.id} slug={c.slug} title={c.title} />
        ))}
      </div>
    </div>
  )
}
