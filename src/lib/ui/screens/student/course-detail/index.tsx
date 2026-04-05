"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import toast from "react-hot-toast"
import { useLectures } from "@/lib/providers/lectures"
import { useUser } from "@/lib/providers/user"
import { GET_MY_SUBMISSIONS } from "@/lib/graphql"
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
import { CheckIcon, ChevronRightIcon, ClockIcon, CreditCardIcon, File, FolderOpenIcon, XCircleIcon } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
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

    const PASSING_PERCENT = 40
    const { data: submissionsData } = useQuery<{
        getMySubmissions: Array<{ referenceId: string; status: string; type: string; marks: number | null; maxMarks: number }>
    }>(GET_MY_SUBMISSIONS, {
        variables: { courseId: courseIdForSlug ?? undefined },
        skip: !courseIdForSlug,
    })
    const submissionsByRef = useMemo(() => {
        const list = (submissionsData?.getMySubmissions ?? []).filter((s) => s.type === "graded_exercise")
        return new Map(list.map((s) => [s.referenceId, s]))
    }, [submissionsData?.getMySubmissions])
    const submissionPassed = useCallback(
        (s: { status: string; marks: number | null; maxMarks: number }) =>
            s.status === "marked" &&
            s.maxMarks > 0 &&
            s.marks != null &&
            Math.round((s.marks / s.maxMarks) * 100) >= PASSING_PERCENT,
        []
    )
    const chaptersInOrder = useMemo(
        () =>
            modulesWithChapters.flatMap((m) =>
                m.chapters.map((c) => ({ moduleSlug: m.moduleSlug, chapterSlug: c.chapterSlug, refId: `${m.moduleSlug}/${c.chapterSlug}` }))
            ),
        [modulesWithChapters]
    )
    const canNavigateToChapter = useCallback(
        (refId: string) => {
            const idx = chaptersInOrder.findIndex((c) => c.refId === refId)
            if (idx <= 0) return true
            const prevRefId = chaptersInOrder[idx - 1].refId
            const prevSubmission = submissionsByRef.get(prevRefId)
            return prevSubmission != null && submissionPassed(prevSubmission)
        },
        [chaptersInOrder, submissionsByRef, submissionPassed]
    )
    const getBlockedChapterMessage = useCallback(
        (refId: string) => {
            const idx = chaptersInOrder.findIndex((c) => c.refId === refId)
            if (idx <= 0) return ""
            const prevSubmission = submissionsByRef.get(chaptersInOrder[idx - 1].refId)
            if (prevSubmission == null) return "Please submit your graded exercise first before moving to the next chapter."
            if (prevSubmission.status === "submitted") return "Please wait for your graded exercise marks to be updated before moving to the next chapter."
            if (prevSubmission.status === "marked" && !submissionPassed(prevSubmission))
                return "You have not passed the previous graded exercise. Re-attempt it to unlock the next chapter."
            return "Please complete the previous chapter's graded exercise first."
        },
        [chaptersInOrder, submissionsByRef, submissionPassed]
    )
    const moduleUnlocked = useMemo(() => {
        const unlocked: boolean[] = []
        for (let i = 0; i < modulesWithChapters.length; i++) {
            if (i === 0) {
                unlocked.push(true)
                continue
            }
            const prevModule = modulesWithChapters[i - 1]
            const allPrevPassed = prevModule.chapters.every((ch) => {
                const refId = `${prevModule.moduleSlug}/${ch.chapterSlug}`
                const s = submissionsByRef.get(refId)
                return s != null && submissionPassed(s)
            })
            unlocked.push(allPrevPassed)
        }
        return unlocked
    }, [modulesWithChapters, submissionsByRef, submissionPassed])
    const visibleModules = useMemo(
        () => modulesWithChapters.filter((_, i) => moduleUnlocked[i]),
        [modulesWithChapters, moduleUnlocked]
    )

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

    const safeActiveTab = Math.min(activeTab, Math.max(0, visibleModules.length - 1))
    const activeModule = visibleModules[safeActiveTab] ?? null

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

            {/* Module tabs — only show modules that are unlocked (module 0 always; next when previous module's all exercises are marked) */}
            <div className="border-b border-(--border-default-light) dark:border-(--border-default-dark) mb-6">
                <div className="flex gap-1 overflow-x-auto pb-px" role="tablist">
                    {visibleModules.map(({ moduleSlug, moduleTitle }, idx) => (
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

            {/* Chapters for active module */}
            {activeModule && (
                <div className="space-y-2" role="tabpanel">
                    {activeModule.chapters.map(({ chapterSlug, title: chapterTitle }) => {
                        const refId = `${activeModule.moduleSlug}/${chapterSlug}`
                        const submission = submissionsByRef.get(refId)
                        const passed = submission != null && submissionPassed(submission)
                        const notPassed = submission?.status === "marked" && submission != null && !submissionPassed(submission)
                        const pendingMarks = submission?.status === "submitted"
                        const blocked = !canNavigateToChapter(refId)
                        const href = `/student/course/${courseSlug}/${activeModule.moduleSlug}/${chapterSlug}`

                        const statusLabel = passed ? "Completed" : notPassed ? "Not passed – re-attempt required" : pendingMarks ? "Pending marks" : "Not started"

                        const cardContent = (
                            <Card className={cn("transition-all", blocked ? "cursor-not-allowed opacity-75" : "hover:shadow-md")}>
                                <CardHeader className="flex flex-row items-center gap-4 py-4">
                                    <div className="bg-background flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground/80" aria-hidden>
                                        <File className="size-5" strokeWidth={2} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-base">{chapterTitle}</CardTitle>
                                        <CardDescription className="mt-0.5 text-sm">
                                            {statusLabel}
                                            {blocked && " • Complete previous graded exercise first"}
                                        </CardDescription>
                                    </div>
                                    {passed ? (
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400" title="Completed">
                                            <CheckIcon className="size-4" />
                                        </div>
                                    ) : notPassed ? (
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400" title="Not passed – re-attempt required">
                                            <XCircleIcon className="size-4" />
                                        </div>
                                    ) : pendingMarks ? (
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400" title="Pending marks">
                                            <ClockIcon className="size-4" />
                                        </div>
                                    ) : (
                                        <ChevronRightIcon className="text-muted-foreground size-5 shrink-0" />
                                    )}
                                </CardHeader>
                            </Card>
                        )

                        if (blocked) {
                            const blockedMessage = getBlockedChapterMessage(refId)
                            return (
                                <div
                                    key={chapterSlug}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => toast.error(blockedMessage)}
                                    onKeyDown={(e) => e.key === "Enter" && toast.error(blockedMessage)}
                                >
                                    {cardContent}
                                </div>
                            )
                        }
                        return (
                            <Link key={chapterSlug} href={href}>
                                {cardContent}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
