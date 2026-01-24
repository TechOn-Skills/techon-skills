"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowRightIcon } from "lucide-react"

import { STUDENT_ASSIGNMENTS } from "@/lib/data/student-assignments"
import { useLocalStorageRecord } from "@/lib/hooks/use-local-storage"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"

type Submission = {
  text: string
  submittedAt: string
  marks?: number
}

function storageKey(id: string) {
  return `student_assignment_submission:${id}`
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
        return raw ? (JSON.parse(raw) as Submission) : null
      })(),
    }))
  }, [rawByKey])

  return (
    <div className="w-full py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">My Assignments</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Assignments & marks
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Click an assignment to view details, submit your work, and see your marks.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {rows.map(({ assignment, submission }) => (
          <Card key={assignment.id} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span className="truncate">{assignment.title}</span>
                {typeof submission?.marks === "number" ? (
                  <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex shrink-0 items-center rounded-full px-2 py-1 text-xs font-semibold">
                    {submission.marks}/100
                  </span>
                ) : (
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {submission ? "Submitted" : "Pending"}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {assignment.course} • Due {assignment.dueDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-muted-foreground text-sm">
                {assignment.brief}
              </div>
              <Button asChild variant="ghost" shape="pill" className="justify-between">
                <Link href={`/student/assignments/${assignment.id}`}>
                  View details
                  <ArrowRightIcon className="size-4 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

