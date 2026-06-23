"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.min.css"
import { Button } from "@/lib/ui/useable-components/button"
import { getNextChapter, API_COURSE_SLUG_TO_CONTENT_SLUG } from "@/utils/constants"
import { CONFIG } from "@/utils/constants"
import { ChevronLeftIcon, ChevronRightIcon, CreditCardIcon, Loader2Icon } from "lucide-react"
import { useUser } from "@/lib/providers/user"
import { GET_PAYMENTS_BY_USER } from "@/lib/graphql"
import { isDueMonthReached } from "@/lib/helpers"

type Props = {
    courseSlug: string
    moduleSlug: string
    chapterSlug: string
    chapterTitle: string
}

const contentUrl = (courseSlug: string, moduleSlug: string, chapterSlug: string, type: "md" | "json") =>
    `/api/course-content?courseSlug=${encodeURIComponent(courseSlug)}&moduleSlug=${encodeURIComponent(moduleSlug)}&chapterSlug=${encodeURIComponent(chapterSlug)}&type=${type}`

export const ChapterReaderScreen = ({ courseSlug, moduleSlug, chapterSlug, chapterTitle }: Props) => {
    const [markdown, setMarkdown] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { userProfileInfo, enrolledCoursesFromApi } = useUser()
    const courseIdForSlug = useMemo(
        () =>
            enrolledCoursesFromApi?.find(
                (c) => c.slug === courseSlug || API_COURSE_SLUG_TO_CONTENT_SLUG[c.slug] === courseSlug
            )?.id ?? null,
        [enrolledCoursesFromApi, courseSlug]
    )

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

            <h1 className="mb-6 text-2xl font-semibold tracking-tight">{chapterTitle}</h1>

            <article className="chapter-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {markdown}
                </ReactMarkdown>
            </article>

            {nextChapter && (
                <div className="mt-12 flex justify-end">
                    <Button asChild variant="brand-secondary" shape="pill">
                        <Link
                            href={`/student/course/${courseSlug}/${nextChapter.moduleSlug}/${nextChapter.chapterSlug}`}
                            className="inline-flex items-center gap-2"
                        >
                            Next chapter
                            <ChevronRightIcon className="size-4" />
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
