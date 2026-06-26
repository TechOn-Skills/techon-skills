"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { ArrowLeftIcon, CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import {
  GET_MY_QUIZ_ATTEMPT,
  GET_QUIZ_FOR_ATTEMPT,
  SUBMIT_QUIZ_ATTEMPT,
} from "@/lib/graphql"
import { cn } from "@/lib/helpers"

type Question = {
  id: string
  prompt: string
  marks: number
  options: { id: string; text: string }[]
}

type AttemptAnswer = {
  questionId: string
  selectedOptionIds: string[]
  marksAwarded: number
  isCorrect: boolean
}

type Attempt = {
  id: string
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  submittedAt: string
  answers: AttemptAnswer[]
}

export const StudentQuizDetailScreen = ({ quizId }: { quizId: string }) => {
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [result, setResult] = useState<Attempt | null>(null)

  const { data: quizData, loading: loadingQuiz } = useQuery<{
    getQuizForAttempt: {
      id: string
      title: string
      description: string
      instructions: string
      totalMarks: number
      passPercentage: number
      course?: { title: string } | null
      questions: Question[]
    } | null
  }>(GET_QUIZ_FOR_ATTEMPT, {
    variables: { id: quizId },
    fetchPolicy: "network-only",
  })

  const { data: attemptData, loading: loadingAttempt, refetch: refetchAttempt } = useQuery<{
    getMyQuizAttempt: Attempt | null
  }>(GET_MY_QUIZ_ATTEMPT, {
    variables: { quizId },
    fetchPolicy: "network-only",
  })

  const quiz = quizData?.getQuizForAttempt
  const existingAttempt = attemptData?.getMyQuizAttempt ?? null
  const attempt = result ?? existingAttempt

  const questionsById = useMemo(() => {
    const map = new Map<string, Question>()
    for (const q of quiz?.questions ?? []) map.set(q.id, q)
    return map
  }, [quiz?.questions])

  const [submitAttempt, { loading: submitting }] = useMutation<{
    submitQuizAttempt: Attempt
  }>(SUBMIT_QUIZ_ATTEMPT, {
    onCompleted: (data) => {
      const att = data.submitQuizAttempt
      setResult(att)
      toast.success(att.passed ? "Quiz passed!" : "Quiz submitted — see your results below.")
      void refetchAttempt()
    },
    onError: (e) => toast.error(e.message ?? "Submit failed"),
  })

  const toggleOption = (questionId: string, optionId: string) => {
    setSelections((prev) => {
      const current = prev[questionId] ?? []
      const has = current.includes(optionId)
      const next = has ? current.filter((id) => id !== optionId) : [...current, optionId]
      return { ...prev, [questionId]: next }
    })
  }

  const handleSubmit = () => {
    if (!quiz) return
    for (const q of quiz.questions) {
      if (!(selections[q.id]?.length ?? 0)) {
        toast.error(`Answer question: ${q.prompt.slice(0, 40)}…`)
        return
      }
    }
    submitAttempt({
      variables: {
        input: {
          quizId,
          answers: quiz.questions.map((q) => ({
            questionId: q.id,
            selectedOptionIds: selections[q.id] ?? [],
          })),
        },
      },
    })
  }

  if (loadingQuiz || loadingAttempt) {
    return (
      <div className="flex items-center gap-2 py-16 text-muted-foreground">
        <Loader2Icon className="size-6 animate-spin" />
        Loading…
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="w-full py-10">
        <Card>
          <CardHeader>
            <CardTitle>Quiz not found</CardTitle>
            <CardDescription>It may be unpublished or you are not enrolled in this course.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" shape="pill">
              <Link href="/student/quizzes">Back to quizzes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (attempt) {
    return (
      <div className="w-full py-10 animate-in fade-in duration-700">
        <Button asChild variant="ghost" shape="pill" className="mb-6">
          <Link href="/student/quizzes">
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>

        <Card className="bg-background/70 mb-6 rounded-3xl backdrop-blur">
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>{quiz.course?.title ?? "Course"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={cn(
                "text-lg font-semibold",
                attempt.passed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
              )}
            >
              Score: {attempt.score} / {attempt.maxScore} ({attempt.percentage}%)
              {attempt.passed ? " — Passed" : ` — Need ${quiz.passPercentage}% to pass`}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Submitted {new Date(attempt.submittedAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {attempt.answers.map((ans, idx) => {
            const q = questionsById.get(ans.questionId)
            return (
              <Card key={ans.questionId} className="rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2">
                    {ans.isCorrect ? (
                      <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-green-600" />
                    ) : (
                      <XCircleIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
                    )}
                    <div>
                      <CardTitle className="text-base">
                        Q{idx + 1}. {q?.prompt ?? "Question"}
                      </CardTitle>
                      <CardDescription>
                        {ans.marksAwarded} / {q?.marks ?? 0} marks
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  {(q?.options ?? []).map((opt) => {
                    const selected = ans.selectedOptionIds.includes(opt.id)
                    return (
                      <p
                        key={opt.id}
                        className={cn(
                          "rounded-lg px-2 py-1",
                          selected && ans.isCorrect && "bg-green-500/15",
                          selected && !ans.isCorrect && "bg-destructive/10"
                        )}
                      >
                        {selected ? "• " : "  "}
                        {opt.text}
                      </p>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <Button asChild variant="ghost" shape="pill" className="mb-6">
        <Link href="/student/quizzes">
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>
      </Button>

      <Card className="bg-background/70 mb-6 rounded-3xl backdrop-blur">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            {quiz.course?.title ?? "Course"} · {quiz.totalMarks} marks · Pass {quiz.passPercentage}%
          </CardDescription>
        </CardHeader>
        {(quiz.description || quiz.instructions) && (
          <CardContent className="space-y-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {quiz.description ? <p>{quiz.description}</p> : null}
            {quiz.instructions ? <p>{quiz.instructions}</p> : null}
          </CardContent>
        )}
      </Card>

      <div className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <Card key={q.id} className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Q{idx + 1}. {q.prompt}
              </CardTitle>
              <CardDescription>{q.marks} mark{q.marks !== 1 ? "s" : ""}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {q.options.map((opt) => {
                const checked = (selections[q.id] ?? []).includes(opt.id)
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors",
                      checked && "border-(--brand-secondary) bg-(--brand-secondary)/5"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOption(q.id, opt.id)}
                    />
                    <span className="text-sm">{opt.text}</span>
                  </label>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="brand-secondary"
        shape="pill"
        className="mt-8 w-full sm:w-auto"
        disabled={submitting}
        onClick={handleSubmit}
      >
        {submitting ? <Loader2Icon className="size-4 animate-spin" /> : "Submit quiz — instant results"}
      </Button>
    </div>
  )
}
