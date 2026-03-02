"use client"

import { useLectures } from "@/lib/providers/lectures"
import {
    getCourseSlugFromLectureRoutes,
    getCourseRoutesBySlug,
    getChaptersByModuleFromCourseRoutes,
    getCourseProgressPercent,
    COURSE_SLUG_TO_TITLE,
} from "@/utils/constants"
import { LectureRoutesType } from "@/utils/types"
import { BookOpenIcon } from "lucide-react"
import { useMemo } from "react"
import { EnrolledCourseCard } from "@/lib/ui/useable-components/enrolled-course-card"

export const MyEnrolledCoursesScreen = () => {
    const { getAllowedLecturesRoutes } = useLectures()
    const allowedLecturesRoutes = getAllowedLecturesRoutes() as Partial<LectureRoutesType>

    const entries = Object.entries(allowedLecturesRoutes).filter(
        (entry): entry is [string, Record<string, Record<string, string>>] =>
            typeof entry[1] === "object" && entry[1] !== null && !Array.isArray(entry[1])
    )

    const courses = useMemo(() => {
        return entries
            .map(([, routes]) => {
                const slug = getCourseSlugFromLectureRoutes(routes)
                if (!slug) return null
                const courseRoutes = getCourseRoutesBySlug(slug)
                const modulesWithChapters = courseRoutes ? getChaptersByModuleFromCourseRoutes(courseRoutes) : []
                const totalChapters = modulesWithChapters.reduce((sum, m) => sum + m.chapters.length, 0)
                const progressPercent = getCourseProgressPercent(slug, totalChapters)
                const title = COURSE_SLUG_TO_TITLE[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                return { slug, title, progressPercent }
            })
            .filter((c): c is { slug: string; title: string; progressPercent: number } => c !== null)
    }, [entries])

    if (courses.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border bg-background/70 backdrop-blur">
                <BookOpenIcon className="text-muted-foreground/50 size-16" />
                <h2 className="mt-4 text-xl font-semibold">No enrolled courses</h2>
                <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
                    You don’t have any enrolled courses yet. Contact your admin to get access.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full py-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">My Enrolled Courses</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Open a course to see chapters and continue learning.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map(({ slug, title, progressPercent }) => (
                    <EnrolledCourseCard
                        key={slug}
                        slug={slug}
                        title={title}
                        progressPercent={progressPercent}
                    />
                ))}
            </div>
        </div>
    )
}
