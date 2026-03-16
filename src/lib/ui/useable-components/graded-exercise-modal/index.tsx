"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { Button } from "@/lib/ui/useable-components/button"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { setChapterProgress } from "@/utils/constants"
import type { ChapterExerciseJson } from "@/utils/interfaces"
import { useUser } from "@/lib/providers/user"
import { CREATE_SUBMISSION, GET_SUBMISSION_BY_REFERENCE } from "@/lib/graphql"
import { CheckCircle2Icon, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/helpers"
import toast from "react-hot-toast"

const MAX_MARKS = 100

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    courseSlug: string
    courseId: string | null
    moduleSlug: string
    chapterSlug: string
    fetchExerciseUrl: string
    nextChapter: { url: string; label: string } | null
}

export const GradedExerciseModal = ({
    open,
    onOpenChange,
    courseSlug,
    courseId,
    moduleSlug,
    chapterSlug,
    fetchExerciseUrl,
    nextChapter,
}: Props) => {
    const { userProfileInfo } = useUser()
    const referenceId = `${moduleSlug}/${chapterSlug}`
    const [data, setData] = useState<ChapterExerciseJson | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({})
    const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({})
    const [submitted, setSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const { data: submissionData, refetch: refetchSubmission } = useQuery<{
        getSubmissionByReference: { id: string; status: string; marks: number | null; maxMarks: number; markedAt: string | null } | null
    }>(GET_SUBMISSION_BY_REFERENCE, {
        variables: {
            userId: userProfileInfo?.id ?? "",
            courseId: courseId ?? "",
            type: "graded_exercise",
            referenceId,
        },
        skip: !open || !courseId || !userProfileInfo?.id,
    })
    const existingSubmission = submissionData?.getSubmissionByReference ?? null
    const isMarked = existingSubmission?.status === "marked"
    const isSubmittedPending = existingSubmission?.status === "submitted" || (submitted && !existingSubmission)

    const [createSubmission, { loading: submitting }] = useMutation(CREATE_SUBMISSION, {
        onCompleted: () => {
            setSubmitted(true)
            refetchSubmission()
            setChapterProgress(courseSlug, moduleSlug, chapterSlug, 100)
            toast.success("Submitted. You'll be notified when your marks are ready.")
        },
        onError: (e) => {
            setSubmitError(e.message || "Failed to submit")
            toast.error(e.message || "Failed to submit")
        },
    })

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        setSubmitted(false)
        setPassed(null)
        setSubmitError(null)
        try {
            const res = await fetch(fetchExerciseUrl)
            if (!res.ok) throw new Error("Failed to load exercise")
            const json = (await res.json()) as ChapterExerciseJson
            setData(json)
            setMcqAnswers({})
            setShortAnswers({})
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load exercise")
        } finally {
            setLoading(false)
        }
    }, [fetchExerciseUrl])

    useEffect(() => {
        if (open) void fetchData()
    }, [open, fetchData])

    const getMcqScorePercent = useCallback((): number | null => {
        if (!data || data.MCQs.length === 0) return 100
        let correct = 0
        for (const mcq of data.MCQs) {
            const correctKey = mcq.options.find((o) => o.isCorrect)?.key
            if (correctKey && mcqAnswers[mcq.id] === correctKey) correct += 1
        }
        return Math.round((correct / data.MCQs.length) * 100)
    }, [data, mcqAnswers])

    const allMcqsAttempted = useCallback((): boolean => {
        if (!data || data.MCQs.length === 0) return true
        return data.MCQs.every((mcq) => (mcqAnswers[mcq.id] ?? "").trim().length > 0)
    }, [data, mcqAnswers])

    const SHORT_ANSWER_MIN_LENGTH = 100

    const allShortAnswersFilled = useCallback((): boolean => {
        if (!data || data.ShortQuestions.length === 0) return true
        return data.ShortQuestions.every((sq) => (shortAnswers[sq.id] ?? "").trim().length >= SHORT_ANSWER_MIN_LENGTH)
    }, [data, shortAnswers])

    const shortAnswerErrors = useCallback((): string[] => {
        if (!data || data.ShortQuestions.length === 0) return []
        return data.ShortQuestions
            .map((sq) => {
                const len = (shortAnswers[sq.id] ?? "").trim().length
                if (len === 0) return `"${sq.question.slice(0, 40)}…" is empty.`
                if (len < SHORT_ANSWER_MIN_LENGTH) return `"${sq.question.slice(0, 40)}…" needs at least ${SHORT_ANSWER_MIN_LENGTH - len} more characters (${len}/${SHORT_ANSWER_MIN_LENGTH}).`
                return null
            })
            .filter((s): s is string => s !== null)
    }, [data, shortAnswers])

    const handleSubmit = () => {
        if (!data || !courseId || !userProfileInfo?.id) return
        setSubmitError(null)

        if (!allMcqsAttempted()) {
            setSubmitError("Please attempt all multiple choice questions.")
            return
        }

        const shortErrs = shortAnswerErrors()
        if (shortErrs.length > 0) {
            setSubmitError(shortErrs[0])
            return
        }

        const mcqPercent = getMcqScorePercent()
        createSubmission({
            variables: {
                input: {
                    courseId,
                    type: "graded_exercise",
                    referenceId,
                    title: data.chapterTitle,
                    mcqScore: mcqPercent ?? 0,
                    mcqMax: data.MCQs.length > 0 ? 100 : 0,
                    shortAnswers: data.ShortQuestions.map((sq) => ({
                        questionId: sq.id,
                        questionText: sq.question,
                        answer: shortAnswers[sq.id] ?? "",
                    })),
                    maxMarks: MAX_MARKS,
                },
            },
        })
    }

    const setMcq = (id: number, key: string) => {
        setMcqAnswers((prev) => ({ ...prev, [id]: key }))
        setSubmitError(null)
    }

    const setShort = (id: number, value: string) => {
        setShortAnswers((prev) => ({ ...prev, [id]: value }))
        setSubmitError(null)
    }

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:duration-200 data-[state=open]:duration-300"
                    )}
                />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[min(36rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-(--border-default-light) dark:border-(--border-default-dark) bg-card shadow-2xl outline-none",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
                        "data-[state=closed]:duration-200 data-[state=open]:duration-300"
                    )}
                >
                    {/* Header */}
                    <div className="shrink-0 border-b border-(--border-soft-divider-light) dark:border-(--border-soft-divider-dark) bg-linear-to-b from-(--brand-secondary)/12 to-transparent px-5 py-4">
                        <DialogPrimitive.Title className="text-base font-semibold tracking-tight text-foreground">
                            Graded Exercise
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">
                            {data?.chapterTitle ?? "Loading…"}
                        </DialogPrimitive.Description>
                    </div>

                    {/* Body */}
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                        {loading && (
                            <div className="flex flex-col items-center justify-center gap-3 py-14">
                                <Loader2Icon className="size-9 animate-spin text-(--brand-secondary)" />
                                <p className="text-sm text-muted-foreground">Loading questions…</p>
                            </div>
                        )}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                                {error}
                            </div>
                        )}
                        {!loading && !error && data && (
                            <div className="space-y-6">
                                {data.MCQs.length > 0 && (
                                    <section>
                                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Multiple choice <span className="font-normal normal-case">(required)</span>
                                        </h3>
                                        <ul className="space-y-3">
                                            {data.MCQs.map((mcq) => (
                                                <li
                                                    key={mcq.id}
                                                    className="rounded-xl border border-(--border-soft-divider-light) dark:border-(--border-soft-divider-dark) bg-(--background-secondary-light) dark:bg-(--background-secondary-dark) p-3.5"
                                                >
                                                    <p className="mb-2.5 text-sm font-medium leading-snug text-foreground">
                                                        {mcq.question}
                                                    </p>
                                                    <div className="flex flex-col gap-1.5" role="radiogroup" aria-label={`Question ${mcq.id}`}>
                                                        {mcq.options.map((opt) => {
                                                            const isSelected = mcqAnswers[mcq.id] === opt.key
                                                            return (
                                                                <button
                                                                    key={opt.key}
                                                                    type="button"
                                                                    role="radio"
                                                                    aria-checked={isSelected}
                                                                    disabled={submitted || isSubmittedPending || isMarked}
                                                                    onClick={() => setMcq(mcq.id, opt.key)}
                                                                    className={cn(
                                                                        "flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-150",
                                                                        "border-transparent",
                                                                        isSelected
                                                                            ? "bg-(--brand-secondary)/15 text-(--brand-primary) dark:text-(--text-primary-dark) ring-2 ring-(--brand-secondary)/50"
                                                                            : "hover:bg-(--background-hover-light) dark:hover:bg-(--background-hover-dark) hover:border-(--border-default-light) dark:hover:border-(--border-default-dark)"
                                                                    )}
                                                                >
                                                                    <span
                                                                        className={cn(
                                                                            "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                                                                            isSelected
                                                                                ? "bg-(--brand-secondary) text-(--text-on-dark)"
                                                                                : "border-2 border-(--border-default-light) dark:border-(--border-default-dark) bg-transparent text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {opt.key}
                                                                    </span>
                                                                    <span className="flex-1">{opt.text}</span>
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {data.ShortQuestions.length > 0 && (
                                    <section>
                                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Short answer <span className="font-normal normal-case">(required, min {SHORT_ANSWER_MIN_LENGTH} characters each)</span>
                                        </h3>
                                        <ul className="space-y-3">
                                            {data.ShortQuestions.map((sq) => {
                                                const len = (shortAnswers[sq.id] ?? "").trim().length
                                                const meetsMin = len >= SHORT_ANSWER_MIN_LENGTH
                                                return (
                                                    <li
                                                        key={sq.id}
                                                        className="rounded-xl border border-(--border-soft-divider-light) dark:border-(--border-soft-divider-dark) bg-(--background-secondary-light) dark:bg-(--background-secondary-dark) p-3.5"
                                                    >
                                                        <p className="mb-2 text-sm font-medium text-foreground">{sq.question}</p>
                                                        <Textarea
                                                            placeholder={`Type your answer (minimum ${SHORT_ANSWER_MIN_LENGTH} characters)…`}
                                                            value={shortAnswers[sq.id] ?? ""}
                                                            onChange={(e) => setShort(sq.id, e.target.value)}
                                                            disabled={submitted || isSubmittedPending || isMarked}
                                                            className={cn(
                                                                "min-h-[72px] resize-y rounded-lg border-(--border-default-light) dark:border-(--border-default-dark) text-sm transition-colors focus-visible:ring-2 focus-visible:ring-(--brand-secondary)",
                                                                !meetsMin && len > 0 && "border-amber-500/50 focus-visible:ring-amber-500/50"
                                                            )}
                                                        />
                                                        <p className={cn("mt-1.5 text-xs", meetsMin ? "text-muted-foreground" : "text-amber-600 dark:text-amber-400")}>
                                                            {len} / {SHORT_ANSWER_MIN_LENGTH} characters {!meetsMin && "(minimum required)"}
                                                        </p>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!loading && !error && data && (
                        <div className="shrink-0 border-t border-(--border-soft-divider-light) dark:border-(--border-soft-divider-dark) bg-(--background-secondary-light) dark:bg-(--background-secondary-dark) px-5 py-4">
                            {isMarked ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                        <CheckCircle2Icon className="size-5 shrink-0" />
                                        Marks: {existingSubmission?.marks ?? 0} / {existingSubmission?.maxMarks ?? MAX_MARKS}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {nextChapter ? (
                                            <Button asChild variant="brand-secondary" shape="pill" size="default" className="min-w-[140px]">
                                                <Link href={nextChapter.url}>Next: {nextChapter.label}</Link>
                                            </Button>
                                        ) : null}
                                        <Button asChild variant="outline" shape="pill" size="default">
                                            <Link href={`/student/course/${courseSlug}`}>Back to course</Link>
                                        </Button>
                                    </div>
                                </div>
                            ) : isSubmittedPending ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 rounded-lg bg-amber-500/15 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                                        <Loader2Icon className="size-5 shrink-0 animate-spin" />
                                        Submitted. You&apos;ll be notified when your marks are ready.
                                    </div>
                                    <Button asChild variant="outline" shape="pill" size="default">
                                        <Link href={`/student/course/${courseSlug}`}>Back to course</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {submitError && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
                                    )}
                                    <Button
                                        type="button"
                                        variant="brand-secondary"
                                        shape="pill"
                                        className="w-full font-semibold"
                                        onClick={handleSubmit}
                                        disabled={!courseId || submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2Icon className="size-4 animate-spin" />
                                                Submitting…
                                            </>
                                        ) : (
                                            "Submit exercise"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
