"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { Loader2Icon, ListTodoIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { formatDateLong } from "@/lib/helpers"
import { cn } from "@/lib/helpers"
import { GET_MY_COURSE_ASSIGNMENTS, GET_MY_SUBMISSIONS } from "@/lib/graphql"
import { useUser } from "@/lib/providers/user"

type AssignmentRow = {
  id: string
  courseId: string
  title: string
  description: string | null
  maxMarks: number
  referenceId: string
  dueDate: string | null
  course?: { id: string; title: string } | null
}

type SubRow = {
  id: string
  courseId: string
  type: string
  referenceId: string
  title: string
  marks: number | null
  maxMarks: number
  status: string
  markedAt: string | null
  canStudentSubmit: boolean
}

function statusLabel(sub: SubRow | undefined): "Pending" | "Submitted" | "Graded" | "Resubmit allowed" {
  if (!sub) return "Pending"
  if (sub.status === "marked") {
    if (sub.canStudentSubmit) return "Resubmit allowed"
    return "Graded"
  }
  return "Submitted"
}

export const StudentAssignmentsListScreen = () => {
  const { userProfileInfo } = useUser()
  const { data: assignData, loading: loadingA, error: errA } = useQuery<{
    getMyCourseAssignments: AssignmentRow[]
  }>(GET_MY_COURSE_ASSIGNMENTS, { skip: !userProfileInfo?.id, fetchPolicy: "network-only" })
  const { data: subData, loading: loadingS } = useQuery<{ getMySubmissions: SubRow[] }>(GET_MY_SUBMISSIONS, {
    skip: !userProfileInfo?.id,
    fetchPolicy: "network-only",
  })

  const loading = loadingA || loadingS
  const assignments = assignData?.getMyCourseAssignments ?? []
  const subs = useMemo(() => {
    const list = subData?.getMySubmissions ?? []
    const map = new Map<string, SubRow>()
    for (const s of list) {
      if (s.type === "assignment") map.set(`${s.courseId}:${s.referenceId}`, s)
    }
    return map
  }, [subData?.getMySubmissions])

  const rows = useMemo(() => {
    return assignments.map((a) => {
      const sub = subs.get(`${a.courseId}:${a.referenceId}`)
      return { assignment: a, submission: sub }
    })
  }, [assignments, subs])

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">My Assignments</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Course assignments</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Assignments are managed by your instructors here—separate from chapter exercises. Submit files and notes from the
          detail page.
        </p>
      </div>

      {errA && (
        <p className="text-destructive mb-4 text-sm">
          {errA.message || "Could not load assignments. Ensure you are enrolled in a course."}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          Loading assignments…
        </div>
      ) : rows.length === 0 ? (
        <Card className="bg-background/70 rounded-3xl backdrop-blur">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <ListTodoIcon className="text-muted-foreground/50 size-12" />
            <p className="text-muted-foreground max-w-md">
              No assignments yet. When your instructor publishes one for a course you&apos;re enrolled in, it will appear
              here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-background/70 overflow-hidden rounded-3xl backdrop-blur">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted-surface/40 border-b">
                  <tr>
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Due</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Marks</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ assignment: a, submission: s }) => {
                    const st = statusLabel(s)
                    return (
                      <tr key={a.id} className="hover:bg-muted-surface/20 border-b transition-colors">
                        <td className="text-muted-foreground p-4 font-mono text-xs">{a.id.slice(-8)}</td>
                        <td className="p-4 font-medium">{a.title}</td>
                        <td className="text-muted-foreground p-4">{a.course?.title ?? "—"}</td>
                        <td className="text-muted-foreground p-4">
                          {a.dueDate ? formatDateLong(a.dueDate) : "—"}
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "rounded-full px-2 py-1 text-xs font-medium",
                              st === "Graded"
                                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                : st === "Resubmit allowed"
                                  ? "bg-sky-500/20 text-sky-700 dark:text-sky-400"
                                  : st === "Submitted"
                                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                    : "bg-muted-surface text-muted-foreground"
                            )}
                          >
                            {st}
                          </span>
                        </td>
                        <td className="p-4">
                          {(st === "Graded" || st === "Resubmit allowed") && s
                            ? `${s.marks ?? 0} / ${s.maxMarks}`
                            : "—"}
                        </td>
                        <td className="p-4">
                          <Button asChild variant="brand-secondary" size="sm" shape="pill">
                            <Link href={`/student/assignments/${a.id}`}>Open</Link>
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
