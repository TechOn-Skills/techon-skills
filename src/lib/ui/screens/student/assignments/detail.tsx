"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { STUDENT_ASSIGNMENTS } from "@/lib/data/student-assignments"
import { useLocalStorageItem } from "@/lib/hooks/use-local-storage"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Separator } from "@/lib/ui/useable-components/separator"
import { Textarea } from "@/lib/ui/useable-components/textarea"

type Submission = {
  text: string
  submittedAt: string
  marks?: number
}

function storageKey(id: string) {
  return `student_assignment_submission:${id}`
}

export const StudentAssignmentDetailScreen = ({ assignmentId }: { assignmentId: string }) => {
  const assignment = useMemo(
    () => STUDENT_ASSIGNMENTS.find((a) => a.id === assignmentId),
    [assignmentId]
  )

  const key = storageKey(assignmentId)
  const { value: raw, setValue } = useLocalStorageItem(key)
  const saved = useMemo(() => (raw ? (JSON.parse(raw) as Submission) : null), [raw])
  const [text, setText] = useState(() => saved?.text ?? "")

  if (!assignment) {
    return (
      <div className="w-full py-10">
        <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
          <CardHeader>
            <CardTitle>Assignment not found</CardTitle>
            <CardDescription>Go back to your assignments list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" shape="pill">
              <Link href="/student/assignments">
                <ArrowLeftIcon className="size-4" />
                Back
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = () => {
    const next: Submission = {
      text,
      submittedAt: new Date().toISOString(),
      marks: saved?.marks ?? Math.floor(60 + Math.random() * 40),
    }
    setValue(JSON.stringify(next))
  }

  return (
    <div className="w-full py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" shape="pill">
          <Link href="/student/assignments">
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
        {typeof saved?.marks === "number" && (
          <div className="bg-(--brand-primary) text-(--text-on-dark) inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold">
            Marks: {saved.marks}/100
          </div>
        )}
      </div>

      <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
        <CardHeader>
          <CardTitle>{assignment.title}</CardTitle>
          <CardDescription>
            {assignment.course} • Due {assignment.dueDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Brief</div>
            <div className="text-muted-foreground text-sm leading-7">{assignment.brief}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Requirements</div>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {assignment.requirements.map((r) => (
                <li key={r} className="text-muted-foreground">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-sm font-semibold">Submit your assignment</div>
            <div className="text-muted-foreground text-sm">
              Add details of what you completed. This will be stored locally for now.
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-56 font-mono"
              placeholder="Explain your solution, approach, and anything you want the instructor to review..."
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-muted-foreground text-xs">
              {saved?.submittedAt ? `Last submitted: ${new Date(saved.submittedAt).toLocaleString()}` : "Not submitted yet"}
            </div>
            <Button
              type="button"
              variant="brand-secondary"
              shape="pill"
              className="w-fit"
              onClick={handleSubmit}
              disabled={!text.trim()}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

