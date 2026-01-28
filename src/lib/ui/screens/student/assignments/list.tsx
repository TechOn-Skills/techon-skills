"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowRightIcon, FlameIcon, TrophyIcon, TargetIcon, StarIcon, ZapIcon } from "lucide-react"

import { STUDENT_ASSIGNMENTS } from "@/lib/data/student-assignments"
import { useLocalStorageRecord } from "@/lib/hooks/use-local-storage"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"
import type { ISubmission } from "@/utils/interfaces"

function storageKey(id: string) {
  return `student_assignment_submission:${id}`
}

function getGradeEmoji(marks: number) {
  if (marks >= 90) return "🌟"
  if (marks >= 80) return "🎯"
  if (marks >= 70) return "✨"
  if (marks >= 60) return "👍"
  return "📝"
}

function getGradeBadge(marks: number) {
  if (marks >= 90) return { label: "Excellent!", color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" }
  if (marks >= 80) return { label: "Great Job!", color: "bg-green-500/20 text-green-600 dark:text-green-400" }
  if (marks >= 70) return { label: "Good Work", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" }
  if (marks >= 60) return { label: "Keep Going", color: "bg-purple-500/20 text-purple-600 dark:text-purple-400" }
  return { label: "Try Again", color: "bg-orange-500/20 text-orange-600 dark:text-orange-400" }
}

export const StudentAssignmentsListScreen = () => {
  const keys = useMemo(
    () => STUDENT_ASSIGNMENTS.map((a) => storageKey(a.id)),
    []
  )
  const { value: rawByKey } = useLocalStorageRecord(keys)

  const rows = useMemo(() => {
    return STUDENT_ASSIGNMENTS.map((a) => ({
      assignment: a,
      submission: (() => {
        const raw = rawByKey[storageKey(a.id)]
        return raw ? (JSON.parse(raw) as ISubmission) : null
      })(),
    }))
  }, [rawByKey])

  // Fun stats calculations
  const stats = useMemo(() => {
    const submitted = rows.filter(r => r.submission).length
    const graded = rows.filter(r => typeof r.submission?.marks === "number").length
    const avgMarks = graded > 0
      ? Math.round(rows.reduce((sum, r) => sum + (r.submission?.marks || 0), 0) / graded)
      : 0
    const perfectScores = rows.filter(r => (r.submission?.marks || 0) >= 90).length
    const streak = Math.min(submitted, 5) // Demo: max 5 streak

    return { submitted, graded, avgMarks, perfectScores, streak, total: rows.length }
  }, [rows])

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">My Assignments</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Track your progress & grades
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Every assignment completed is a step closer to mastery. Keep the momentum going! 🚀
        </p>
      </div>

      {/* Fun Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(255,138,61,0.25),rgba(70,208,255,0.12),transparent_70%)] p-px animate-in fade-in slide-in-from-left-4 duration-700">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <FlameIcon className="size-8 text-orange-500" />
                <span className="text-3xl font-bold">{stats.streak}</span>
              </div>
              <div className="text-muted-foreground text-xs">Day Streak 🔥</div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: "100ms" }}>
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TargetIcon className="size-8 text-blue-500" />
                <span className="text-3xl font-bold">{stats.submitted}/{stats.total}</span>
              </div>
              <div className="text-muted-foreground text-xs">Completed</div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: "200ms" }}>
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrophyIcon className="size-8 text-yellow-500" />
                <span className="text-3xl font-bold">{stats.avgMarks}%</span>
              </div>
              <div className="text-muted-foreground text-xs">Average Score</div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: "300ms" }}>
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <StarIcon className="size-8 text-purple-500" />
                <span className="text-3xl font-bold">{stats.perfectScores}</span>
              </div>
              <div className="text-muted-foreground text-xs">90+ Scores 🌟</div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: "400ms" }}>
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <ZapIcon className="size-8 text-green-500" />
                <span className="text-3xl font-bold">{Math.round((stats.submitted / stats.total) * 100)}%</span>
              </div>
              <div className="text-muted-foreground text-xs">Completion</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assignment Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {rows.map(({ assignment, submission }, idx) => {
          const gradeInfo = typeof submission?.marks === "number" ? getGradeBadge(submission.marks) : null
          const emoji = typeof submission?.marks === "number" ? getGradeEmoji(submission.marks) : null

          return (
            <div
              key={assignment.id}
              className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span className="truncate">{assignment.title}</span>
                    {typeof submission?.marks === "number" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-2xl">{emoji}</span>
                        <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex shrink-0 items-center rounded-full px-2 py-1 text-xs font-semibold">
                          {submission.marks}/100
                        </span>
                      </div>
                    ) : submission ? (
                      <span className="bg-blue-500/20 text-blue-600 dark:text-blue-400 inline-flex shrink-0 items-center rounded-full px-2 py-1 text-xs font-semibold">
                        ⏳ Grading...
                      </span>
                    ) : (
                      <span className="text-muted-foreground shrink-0 text-xs">
                        📝 Pending
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {assignment.course} • Due {assignment.dueDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gradeInfo && (
                    <div className={cn("rounded-2xl px-3 py-2 text-center text-xs font-semibold", gradeInfo.color)}>
                      {gradeInfo.label}
                    </div>
                  )}
                  <div className="text-muted-foreground text-sm">
                    {assignment.brief}
                  </div>
                  <Button asChild variant="ghost" shape="pill" className="justify-between w-full">
                    <Link href={`/student/assignments/${assignment.id}`}>
                      {submission ? "View Submission" : "Start Assignment"}
                      <ArrowRightIcon className="size-4 text-muted-foreground" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Motivational Footer */}
      {stats.submitted > 0 && (
        <div className="mt-10 rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-2">You&apos;re doing amazing!</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-7">
                {stats.avgMarks >= 80
                  ? "Outstanding work! Your dedication is paying off. Keep pushing forward and you'll achieve incredible things!"
                  : stats.submitted >= stats.total / 2
                    ? "You're over halfway there! Every assignment makes you stronger. Don't stop now—you've got this!"
                    : "Great start! Consistency is key. Keep submitting and watch your skills soar to new heights!"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

