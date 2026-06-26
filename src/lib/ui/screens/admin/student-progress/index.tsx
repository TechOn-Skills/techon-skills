"use client"

import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { Loader2Icon, RefreshCwIcon, TrendingUpIcon, UsersIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { GET_COURSES, GET_STUDENTS_PROGRESS } from "@/lib/graphql"
import { filterCoursesForGrader } from "@/lib/helpers/grader-courses"
import { cn, formatDateLong } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"

type StudentRow = {
  userId: string
  fullName: string
  email: string
  quizzesAttempted: number
  quizzesPassed: number
  assignmentsSubmitted: number
  assignmentsGraded: number
  assignmentsPendingReview: number
  averageMarksPercent: number | null
  overallProgressPercent: number
  lastActivityAt: string | null
}

export const AdminStudentProgressScreen = () => {
  const { userProfileInfo } = useUser()
  const [selectedCourseId, setSelectedCourseId] = useState("")

  const { data: coursesData, refetch: refetchCourses } = useQuery<{
    getCourses: Array<{ id: string; title: string }>
  }>(GET_COURSES, { fetchPolicy: "network-only" })
  const allCourses = coursesData?.getCourses ?? []
  const courses = useMemo(
    () => filterCoursesForGrader(allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn),
    [allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn]
  )

  const { data, loading, refetch } = useQuery<{ getStudentsProgress: StudentRow[] }>(GET_STUDENTS_PROGRESS, {
    variables: { courseId: selectedCourseId || undefined },
    skip: !userProfileInfo?.id,
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    refetchCourses()
  }, [refetchCourses])

  const rows = data?.getStudentsProgress ?? []
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refetchCourses(), refetch()])
      toast.success("Refreshed.")
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-secondary">Evaluation</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Student progress</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Track each student&apos;s quiz attempts, assignment submissions, and overall completion — all from live data.
          </p>
        </div>
        <Button type="button" variant="outline" shape="pill" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
          <RefreshCwIcon className={cn("size-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {courses.length > 0 && (
        <div className="mb-6">
          <label className="text-muted-foreground mb-2 block text-sm font-medium">Filter by course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="border-input bg-background rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All my courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          Loading student progress…
        </div>
      ) : rows.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <UsersIcon className="text-muted-foreground/40 size-12" />
            <p className="text-muted-foreground">No enrolled students found for this filter.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-3xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted-surface/40 border-b">
                  <tr>
                    <th className="p-4 font-semibold">Student</th>
                    <th className="p-4 font-semibold">Progress</th>
                    <th className="p-4 font-semibold">Quizzes</th>
                    <th className="p-4 font-semibold">Assignments</th>
                    <th className="p-4 font-semibold">Pending review</th>
                    <th className="p-4 font-semibold">Avg score</th>
                    <th className="p-4 font-semibold">Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.userId} className="hover:bg-muted-surface/20 border-b">
                      <td className="p-4">
                        <div className="font-medium">{s.fullName}</div>
                        <div className="text-muted-foreground text-xs">{s.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-(--brand-secondary)">
                          <TrendingUpIcon className="size-3.5" />
                          {s.overallProgressPercent}%
                        </span>
                      </td>
                      <td className="p-4">
                        {s.quizzesAttempted} attempted · {s.quizzesPassed} passed
                      </td>
                      <td className="p-4">
                        {s.assignmentsSubmitted} submitted · {s.assignmentsGraded} graded
                      </td>
                      <td className="p-4">
                        {s.assignmentsPendingReview > 0 ? (
                          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {s.assignmentsPendingReview}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-4">{s.averageMarksPercent != null ? `${s.averageMarksPercent}%` : "—"}</td>
                      <td className="text-muted-foreground p-4 text-xs">
                        {s.lastActivityAt ? formatDateLong(s.lastActivityAt) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
