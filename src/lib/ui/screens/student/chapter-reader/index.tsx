"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.min.css"
import { GradedExerciseModal } from "@/lib/ui/useable-components/graded-exercise-modal"
import { Button } from "@/lib/ui/useable-components/button"
import { getNextChapter, API_COURSE_SLUG_TO_CONTENT_SLUG } from "@/utils/constants"
import { CONFIG } from "@/utils/constants"
import { ChevronLeftIcon, CreditCardIcon, FileQuestionIcon, Loader2Icon } from "lucide-react"
import { useUser } from "@/lib/providers/user"
import { GET_PAYMENTS_BY_USER, GET_SUBMISSION_BY_REFERENCE } from "@/lib/graphql"
import { isDueMonthReached } from "@/lib/helpers"
import toast from "react-hot-toast"

type Props = {
    courseSlug: string
    moduleSlug: string
    chapterSlug: string
    chapterTitle: string
}

const contentUrl = (courseSlug: string, moduleSlug: string, chapterSlug: string, type: "md" | "json") =>
    `/api/course-content?courseSlug=${encodeURIComponent(courseSlug)}&moduleSlug=${encodeURIComponent(moduleSlug)}&chapterSlug=${encodeURIComponent(chapterSlug)}&type=${type}`

const PASSING_PERCENT = 40

export const ChapterReaderScreen = ({ courseSlug, moduleSlug, chapterSlug, chapterTitle }: Props) => {
    const [markdown, setMarkdown] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [exerciseOpen, setExerciseOpen] = useState(false)
    const { userProfileInfo, enrolledCoursesFromApi } = useUser()
    const courseIdForSlug = useMemo(
        () =>
            enrolledCoursesFromApi?.find(
                (c) => c.slug === courseSlug || API_COURSE_SLUG_TO_CONTENT_SLUG[c.slug] === courseSlug
            )?.id ?? null,
        [enrolledCoursesFromApi, courseSlug]
    )
    const referenceId = `${moduleSlug}/${chapterSlug}`
    const { data: submissionData } = useQuery<{
        getSubmissionByReference: { status: string; marks: number | null; maxMarks: number } | null
    }>(GET_SUBMISSION_BY_REFERENCE, {
        variables: {
            userId: userProfileInfo?.id ?? "",
            courseId: courseIdForSlug ?? "",
            type: "graded_exercise",
            referenceId,
        },
        skip: !courseIdForSlug || !userProfileInfo?.id,
    })
    const existingSubmission = submissionData?.getSubmissionByReference ?? null
    const submissionStatus = existingSubmission?.status
    const marksPercent =
        existingSubmission?.maxMarks != null &&
        existingSubmission.maxMarks > 0 &&
        existingSubmission.marks != null
            ? Math.round((existingSubmission.marks / existingSubmission.maxMarks) * 100)
            : null
    const passed = submissionStatus === "marked" && marksPercent != null && marksPercent >= PASSING_PERCENT
    const canOpenExerciseModal =
        !existingSubmission ||
        (submissionStatus === "marked" && !passed)

    const handleAttemptClick = useCallback(() => {
        if (canOpenExerciseModal) {
            setExerciseOpen(true)
            return
        }
        if (submissionStatus === "submitted") {
            toast.error("Please wait for your marks to be updated before attempting again.")
            return
        }
        if (passed) {
            toast.success("You have already passed this exercise.")
        }
    }, [canOpenExerciseModal, submissionStatus, passed])
    const { data: paymentsData } = useQuery<{
        getPaymentsByUser: Array<{ courseDetails?: { courseId: string } | null; isPaid: boolean; paymentDate: string }>;
    }>(GET_PAYMENTS_BY_USER, {
        variables: { userId: userProfileInfo?.id ?? "" },
        skip: !userProfileInfo?.id || !courseIdForSlug,
    })
    const hasPendingFeeForCourse = useMemo(
        () =>
            !!courseIdForSlug &&
            !!paymentsData?.getPaymentsByUser?.some(
                (p) =>
                    p.courseDetails?.courseId === courseIdForSlug &&
                    !p.isPaid &&
                    isDueMonthReached(p.paymentDate)
            ),
        [courseIdForSlug, paymentsData?.getPaymentsByUser]
    )

    const fetchContent = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(contentUrl(courseSlug, moduleSlug, chapterSlug, "md"))
            if (!res.ok) throw new Error("Failed to load chapter")
            const text = await res.text()
            setMarkdown(text)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load chapter")
        } finally {
            setLoading(false)
        }
    }, [courseSlug, moduleSlug, chapterSlug])

    useEffect(() => {
        void fetchContent()
    }, [fetchContent])

    const nextChapter = useMemo(
        () => getNextChapter(courseSlug, moduleSlug, chapterSlug),
        [courseSlug, moduleSlug, chapterSlug]
    )

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2Icon className="size-10 animate-spin text-(--brand-highlight)" />
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
                <Link href={`/student/course/${courseSlug}`} className="text-muted-foreground mt-4 text-sm hover:underline">
                    ← Back to course
                </Link>
            </div>
        )
    }

    if (error || !markdown) {
        return (
            <div className="rounded-3xl border bg-background/70 p-8 text-center">
                <p className="text-destructive">{error ?? "Content not found."}</p>
                <Link
                    href={`/student/course/${courseSlug}`}
                    className="text-(--brand-highlight) mt-4 inline-block text-sm font-medium hover:underline"
                >
                    Back to course
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full py-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href={`/student/course/${courseSlug}`}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
                >
                    <ChevronLeftIcon className="size-4" />
                    Back to course
                </Link>
            </div>

            <article className="chapter-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {markdown}
                </ReactMarkdown>
            </article>

            <div className="mt-12 rounded-2xl border border-(--border-default-light) dark:border-(--border-default-dark) bg-(--background-secondary-light) dark:bg-(--background-secondary-dark) p-6">
                <h3 className="mb-2 font-semibold">Finished this chapter?</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                    Attempt the graded exercise (MCQs and short questions) to complete this chapter and unlock the next.
                </p>
                <Button
                    type="button"
                    variant="brand-secondary"
                    shape="pill"
                    onClick={handleAttemptClick}
                    className="inline-flex items-center gap-2"
                >
                    <FileQuestionIcon className="size-4" />
                    Attempt Graded Exercise
                </Button>
            </div>

            <GradedExerciseModal
                open={exerciseOpen}
                onOpenChange={setExerciseOpen}
                courseSlug={courseSlug}
                courseId={courseIdForSlug}
                moduleSlug={moduleSlug}
                chapterSlug={chapterSlug}
                fetchExerciseUrl={contentUrl(courseSlug, moduleSlug, chapterSlug, "json")}
                nextChapter={nextChapter}
            />
        </div>
    )
}
