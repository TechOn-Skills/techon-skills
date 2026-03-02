"use client"

import Link from "next/link"
import { useLectures } from "@/lib/providers/lectures"
import {
    getCourseRoutesBySlug,
    getChaptersByModuleFromCourseRoutes,
    getCourseSlugFromLectureRoutes,
    COURSE_SLUG_TO_TITLE,
    getCourseProgressPercent,
    getChapterProgress,
} from "@/utils/constants"
import { LectureRoutesType } from "@/utils/types"
import { CheckIcon, ChevronRightIcon, File, FolderOpenIcon } from "lucide-react"
import { useMemo, useState } from "react"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"

type Props = { courseSlug: string }

export const CourseDetailScreen = ({ courseSlug }: Props) => {
    const [activeTab, setActiveTab] = useState(0)
    const { getAllowedLecturesRoutes } = useLectures()
    const allowedRoutes = getAllowedLecturesRoutes() as Partial<LectureRoutesType>
    const courseRoutes = useMemo(() => getCourseRoutesBySlug(courseSlug), [courseSlug])

    const isAllowed = useMemo(() => {
        for (const routes of Object.values(allowedRoutes)) {
            if (typeof routes !== "object" || routes === null) continue
            if (getCourseSlugFromLectureRoutes(routes) === courseSlug) return true
        }
        return false
    }, [allowedRoutes, courseSlug])

    const modulesWithChapters = useMemo(
        () => (courseRoutes ? getChaptersByModuleFromCourseRoutes(courseRoutes) : []),
        [courseRoutes]
    )
    const totalChapters = useMemo(
        () => modulesWithChapters.reduce((sum, m) => sum + m.chapters.length, 0),
        [modulesWithChapters]
    )
    const overallPercent = useMemo(
        () => getCourseProgressPercent(courseSlug, totalChapters),
        [courseSlug, totalChapters]
    )

    const title = COURSE_SLUG_TO_TITLE[courseSlug] ?? courseSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

    if (!courseRoutes || !isAllowed) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border bg-background/70 backdrop-blur">
                <h2 className="text-xl font-semibold">Course not found or access denied</h2>
                <p className="text-muted-foreground mt-2 text-sm">You may not be enrolled in this course.</p>
                <Link href="/student/my-enrolled-courses" className="text-(--brand-highlight) mt-4 text-sm font-medium hover:underline">
                    Back to My Enrolled Courses
                </Link>
            </div>
        )
    }

    const activeModule = modulesWithChapters[activeTab]

    return (
        <div className="w-full max-w-full py-6">
            <div className="mb-6">
                <Link
                    href="/student/my-enrolled-courses"
                    className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm"
                >
                    ← My Enrolled Courses
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {totalChapters} chapter{totalChapters !== 1 ? "s" : ""} in {modulesWithChapters.length} module{modulesWithChapters.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{overallPercent}%</span>
                    </div>
                </div>
            </div>

            {/* Module tabs */}
            <div className="border-b border-(--border-default-light) dark:border-(--border-default-dark) mb-6">
                <div className="flex gap-1 overflow-x-auto pb-px" role="tablist">
                    {modulesWithChapters.map(({ moduleSlug, moduleTitle }, idx) => (
                        <button
                            key={moduleSlug}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === idx}
                            onClick={() => setActiveTab(idx)}
                            className={cn(
                                "flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
                                activeTab === idx
                                    ? "bg-(--background-secondary-light) dark:bg-(--background-secondary-dark) text-(--brand-secondary) dark:text-(--brand-highlight) border border-(--border-default-light) dark:border-(--border-default-dark) border-b-transparent -mb-px"
                                    : "text-muted-foreground hover:text-foreground hover:bg-(--background-hover-light) dark:hover:bg-(--background-hover-dark)"
                            )}
                        >
                            <FolderOpenIcon className="size-4 shrink-0" aria-hidden />
                            {moduleTitle}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chapters for active module */}
            {activeModule && (
                <div className="space-y-2" role="tabpanel">
                    {activeModule.chapters.map(({ chapterSlug, chapterNumber, title: chapterTitle }) => {
                        const completed = getChapterProgress(courseSlug, activeModule.moduleSlug, chapterSlug) >= 100
                        const href = `/student/course/${courseSlug}/${activeModule.moduleSlug}/${chapterSlug}`

                        return (
                            <Link key={chapterSlug} href={href}>
                                <Card className="transition-all hover:shadow-md">
                                    <CardHeader className="flex flex-row items-center gap-4 py-4">
                                        <div className="bg-background flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground/80" aria-hidden>
                                            <File className="size-5" strokeWidth={2} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="text-base">{chapterTitle}</CardTitle>
                                            <CardDescription className="mt-0.5 text-sm">
                                                {completed ? "Completed" : "Not started"}
                                            </CardDescription>
                                        </div>
                                        {completed ? (
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
                                                <CheckIcon className="size-4" />
                                            </div>
                                        ) : (
                                            <ChevronRightIcon className="text-muted-foreground size-5 shrink-0" />
                                        )}
                                    </CardHeader>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
