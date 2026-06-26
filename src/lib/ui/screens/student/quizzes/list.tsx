"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { ClipboardListIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { formatDateLong } from "@/lib/helpers"
import { cn } from "@/lib/helpers"
import { GET_MY_QUIZZES } from "@/lib/graphql"
import { useUser } from "@/lib/providers/user"

type QuizRow = {
  id: string
  title: string
  totalMarks: number
  passPercentage: number
  dueDate: string | null
  course?: { title: string } | null
  myAttempt?: {
    score: number
    maxScore: number
    percentage: number
    passed: boolean
    submittedAt: string
  } | null
}

function statusLabel(q: QuizRow): string {
  if (q.myAttempt) return q.myAttempt.passed ? "Passed" : "Completed"
  return "Not attempted"
}

export const StudentQuizzesListScreen = () => {
  const { userProfileInfo } = useUser()
  const { data, loading, error } = useQuery<{ getMyQuizzes: QuizRow[] }>(GET_MY_QUIZZES, {
    skip: !userProfileInfo?.id,
    fetchPolicy: "network-only",
  })

  const quizzes = data?.getMyQuizzes ?? []
  const rows = useMemo(() => quizzes, [quizzes])

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">My Quizzes</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Course quizzes</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          MCQ quizzes are graded instantly when you submit. You get one attempt per quiz.
        </p>
      </div>

      {error && <p className="text-destructive mb-4 text-sm">{error.message}</p>}

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <Card className="bg-background/70 rounded-3xl backdrop-blur">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <ClipboardListIcon className="text-muted-foreground/50 size-12" />
            <p className="text-muted-foreground max-w-md">No published quizzes yet for your enrolled courses.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-background/70 overflow-hidden rounded-3xl backdrop-blur">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted-surface/40 border-b">
                  <tr>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Due</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Score</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((q) => {
                    const st = statusLabel(q)
                    return (
                      <tr key={q.id} className="hover:bg-muted-surface/20 border-b">
                        <td className="p-4 font-medium">{q.title}</td>
                        <td className="text-muted-foreground p-4">{q.course?.title ?? "—"}</td>
                        <td className="text-muted-foreground p-4">{q.dueDate ? formatDateLong(q.dueDate) : "—"}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "rounded-full px-2 py-1 text-xs font-medium",
                              st === "Passed"
                                ? "bg-green-500/20 text-green-600"
                                : st === "Completed"
                                  ? "bg-sky-500/20 text-sky-700"
                                  : "bg-muted-surface text-muted-foreground"
                            )}
                          >
                            {st}
                          </span>
                        </td>
                        <td className="p-4">
                          {q.myAttempt ? `${q.myAttempt.score} / ${q.myAttempt.maxScore} (${q.myAttempt.percentage}%)` : "—"}
                        </td>
                        <td className="p-4">
                          <Button asChild variant="brand-secondary" size="sm" shape="pill">
                            <Link href={`/student/quizzes/${q.id}`}>{q.myAttempt ? "View results" : "Take quiz"}</Link>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
