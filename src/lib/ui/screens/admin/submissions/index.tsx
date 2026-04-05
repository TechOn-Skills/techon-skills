"use client"

import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { Loader2Icon, RefreshCwIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { GET_SUBMISSIONS_FOR_COURSE, GET_COURSES } from "@/lib/graphql"
import { cn } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"
import { UserRole } from "@/utils/enums/user"

import { SubmissionGradingBlock, type SubmissionRow } from "./submission-grading-block"

export const AdminSubmissionsScreen = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const { userProfileInfo } = useUser()

  const { data: coursesData, refetch: refetchCourses } = useQuery<{
    getCourses: Array<{ id: string; title: string; slug: string }>
  }>(GET_COURSES, { fetchPolicy: "network-only" })
  const allCourses = coursesData?.getCourses ?? []
  const courses = useMemo(() => {
    if (userProfileInfo?.role === UserRole.SUPER_ADMIN) return allCourses
    const allowed = userProfileInfo?.allowedMarkGradesOn ?? []
    if (allowed.length === 0) return []
    return allCourses.filter((c) => allowed.includes(c.id))
  }, [allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn])

  const courseId = selectedCourseId || courses[0]?.id || ""
  const { data: submissionsData, loading, refetch } = useQuery<{
    getSubmissionsForCourse: SubmissionRow[]
  }>(GET_SUBMISSIONS_FOR_COURSE, {
    variables: { courseId, status: undefined },
    skip: !courseId,
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    refetchCourses()
  }, [refetchCourses])
  useEffect(() => {
    if (courseId) void refetch()
  }, [courseId, refetch])

  const submissions = submissionsData?.getSubmissionsForCourse ?? []
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refetchCourses(), courseId ? refetch() : Promise.resolve()])
      toast.success("Refreshed.")
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-secondary">Admin</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Grade Submissions
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Assignments: enter total marks; if below 40% of max you can allow a resubmit. Graded exercises: MCQ band is automatic;
            award short-answer marks per question.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="default"
          shape="pill"
          onClick={handleRefresh}
          disabled={isRefreshing || courses.length === 0}
          className="shrink-0 gap-2"
        >
          <RefreshCwIcon className={cn("size-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="mb-6">
        <label className="text-muted-foreground mb-2 block text-sm font-medium">Course</label>
        {courses.length === 0 ? (
          <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-4 text-sm">
            You are not assigned to grade any course. Ask an admin to add you to &quot;allowed mark grades on&quot; for the relevant courses.
          </p>
        ) : (
          <select
            value={courseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="border-input bg-background rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-secondary)"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {courses.length === 0 ? null : (
        <SubmissionGradingBlock
          submissions={submissions}
          loading={loading}
          emptyMessage="No submissions for this course yet."
          refetch={refetch}
        />
      )}
    </div>
  )
}
