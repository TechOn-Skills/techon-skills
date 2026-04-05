"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import { ArrowLeftIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { GET_COURSE_ASSIGNMENT_BY_ID, GET_SUBMISSIONS_FOR_ASSIGNMENT } from "@/lib/graphql"
import { SubmissionGradingBlock, type SubmissionRow } from "@/lib/ui/screens/admin/submissions/submission-grading-block"

export const AdminAssignmentSubmissionsScreen = ({ assignmentId }: { assignmentId: string }) => {
  const { data: assignData, loading: loadingA } = useQuery<{
    getCourseAssignmentById: {
      id: string
      courseId: string
      title: string
      description: string | null
      maxMarks: number
      referenceId: string
      dueDate: string | null
      course?: { id: string; title: string } | null
    } | null
  }>(GET_COURSE_ASSIGNMENT_BY_ID, {
    variables: { id: assignmentId },
    skip: !assignmentId,
    fetchPolicy: "network-only",
  })

  const assignment = assignData?.getCourseAssignmentById ?? null

  const { data: subData, loading: loadingS, refetch } = useQuery<{
    getSubmissionsForAssignment: SubmissionRow[]
  }>(GET_SUBMISSIONS_FOR_ASSIGNMENT, {
    variables: { assignmentId },
    skip: !assignmentId || !assignment,
    fetchPolicy: "network-only",
  })

  const submissions = subData?.getSubmissionsForAssignment ?? []
  const loadingList = assignment ? loadingS : loadingA

  if (!assignmentId) {
    return null
  }

  if (!loadingA && !assignment) {
    return (
      <div className="w-full py-10">
        <Button asChild variant="ghost" shape="pill" className="mb-6">
          <Link href="/admin/assignments">
            <ArrowLeftIcon className="size-4" />
            Back to assignments
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Assignment not found</CardTitle>
            <CardDescription>You may not have access or it was removed.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <Button asChild variant="ghost" shape="pill" className="mb-6">
        <Link href="/admin/assignments">
          <ArrowLeftIcon className="size-4" />
          Back to assignments
        </Link>
      </Button>

      {assignment ? (
        <Card className="bg-background/70 mb-8 rounded-3xl backdrop-blur">
          <CardHeader>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>
              {assignment.course?.title ?? "Course"} · Max {assignment.maxMarks} marks · Ref{" "}
              <span className="font-mono text-xs">{assignment.referenceId}</span>
            </CardDescription>
          </CardHeader>
          {assignment.description ? (
            <CardContent className="text-muted-foreground text-sm whitespace-pre-wrap">{assignment.description}</CardContent>
          ) : null}
        </Card>
      ) : (
        <div className="mb-8 flex items-center gap-2 text-muted-foreground">
          <Loader2Icon className="size-5 animate-spin" />
          Loading assignment…
        </div>
      )}

      <div className="mb-2 text-sm font-semibold text-secondary">Student submissions</div>
      <SubmissionGradingBlock
        submissions={submissions}
        loading={loadingList}
        emptyMessage="No students have submitted this assignment yet."
        refetch={refetch}
      />
    </div>
  )
}
