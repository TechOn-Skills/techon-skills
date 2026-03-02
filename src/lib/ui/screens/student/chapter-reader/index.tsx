"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.min.css"
import { GradedExerciseModal } from "@/lib/ui/useable-components/graded-exercise-modal"
import { Button } from "@/lib/ui/useable-components/button"
import { getNextChapter } from "@/utils/constants"
import { ChevronLeftIcon, FileQuestionIcon, Loader2Icon } from "lucide-react"
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
    const [exerciseOpen, setExerciseOpen] = useState(false)

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
                    onClick={() => setExerciseOpen(true)}
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
                moduleSlug={moduleSlug}
                chapterSlug={chapterSlug}
                fetchExerciseUrl={contentUrl(courseSlug, moduleSlug, chapterSlug, "json")}
                nextChapter={nextChapter}
            />
        </div>
    )
}
