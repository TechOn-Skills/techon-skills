"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import { useLectures } from "@/lib/providers/lectures"
import { useUser } from "@/lib/providers/user"
import {
    getCourseRoutesBySlug,
    getChaptersByModuleFromCourseRoutes,
    getCourseSlugFromLectureRoutes,
    COURSE_SLUG_TO_TITLE,
    getCourseProgressPercent,
    API_COURSE_SLUG_TO_CONTENT_SLUG,
} from "@/utils/constants"
import { GET_PAYMENTS_BY_USER } from "@/lib/graphql"
import { isDueMonthReached } from "@/lib/helpers"
import { CONFIG } from "@/utils/constants"
import { LectureRoutesType } from "@/utils/types"
import { ChevronRightIcon, CreditCardIcon, File, FolderOpenIcon } from "lucide-react"
import { useMemo, useState } from "react"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/lib/ui/useable-components/card"
import { Button } from "@/lib/ui/useable-components/button"
import { cn } from "@/lib/helpers"

type Props = { courseSlug: string }

export const CourseDetailScreen = ({ courseSlug }: Props) => {
    const [activeTab, setActiveTab] = useState(0)
    const { userProfileInfo, enrolledCoursesFromApi } = useUser()
    const { getAllowedLecturesRoutes } = useLectures()
    const allowedRoutes = getAllowedLecturesRoutes() as Partial<LectureRoutesType>
    const courseRoutes = useMemo(() => getCourseRoutesBySlug(courseSlug), [courseSlug])

    const courseIdForSlug = useMemo(() => {
        const found = enrolledCoursesFromApi?.find(
            (c) => c.slug === courseSlug || API_COURSE_SLUG_TO_CONTENT_SLUG[c.slug] === courseSlug
        )
        return found?.id ?? null
    }, [enrolledCoursesFromApi, courseSlug])

    const { data: paymentsData } = useQuery<{
        getPaymentsByUser: Array<{ courseDetails?: { courseId: string } | null; isPaid: boolean; paymentDate: string }>;
    }>(GET_PAYMENTS_BY_USER, {
        variables: { userId: userProfileInfo?.id ?? "" },
        skip: !userProfileInfo?.id || !courseIdForSlug,
    })
    const hasPendingFeeForCourse = useMemo(() => {
        if (!courseIdForSlug || !paymentsData?.getPaymentsByUser?.length) return false
        return paymentsData.getPaymentsByUser.some(
            (p) =>
                p.courseDetails?.courseId === courseIdForSlug &&
                !p.isPaid &&
                isDueMonthReached(p.paymentDate)
        )
    }, [courseIdForSlug, paymentsData?.getPaymentsByUser])

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

    if (hasPendingFeeForCourse) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border bg-background/70 backdrop-blur p-8 text-center">
                <CreditCardIcon className="text-muted-foreground size-12 mb-4" />
                <h2 className="text-xl font-semibold">This course&apos;s fee is pending from your side</h2>
                <p className="text-muted-foreground mt-2 text-sm max-w-md">
                    Please clear your due fees first to continue accessing this course&apos;s chapters.
                </p>
                <Button asChild variant="brand-secondary" shape="pill" className="mt-6">
                    <Link href={CONFIG.ROUTES.STUDENT.FEES}>Go to Fee screen</Link>
                </Button>
                <Link href="/student/my-enrolled-courses" className="text-muted-foreground mt-4 text-sm hover:underline">
                    ← Back to My Enrolled Courses
                </Link>
            </div>
        )
    }

    const safeActiveTab = Math.min(activeTab, Math.max(0, modulesWithChapters.length - 1))
    const activeModule = modulesWithChapters[safeActiveTab] ?? null

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

            <div className="border-b border-(--border-default-light) dark:border-(--border-default-dark) mb-6">
                <div className="flex gap-1 overflow-x-auto pb-px" role="tablist">
                    {modulesWithChapters.map(({ moduleSlug, moduleTitle }, idx) => (
                        <button
                            key={moduleSlug}
                            type="button"
                            role="tab"
                            aria-selected={safeActiveTab === idx}
                            onClick={() => setActiveTab(idx)}
                            className={cn(
                                "flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
                                safeActiveTab === idx
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

            {activeModule && (
                <div className="space-y-2" role="tabpanel">
                    {activeModule.chapters.map(({ chapterSlug, title: chapterTitle }) => {
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
                                                Read chapter
                                            </CardDescription>
                                        </div>
                                        <ChevronRightIcon className="text-muted-foreground size-5 shrink-0" />
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
