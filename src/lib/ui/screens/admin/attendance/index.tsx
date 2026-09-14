"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useMutation, useQuery } from "@apollo/client/react"
import { Loader2Icon, RefreshCwIcon, UserCheckIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import {
  GET_ATTENDANCE_SHEET,
  GET_COURSES,
  GET_LECTURES_FOR_COURSE,
  SAVE_LECTURE_ATTENDANCE,
} from "@/lib/graphql"
import { filterCoursesForGrader } from "@/lib/helpers/grader-courses"
import { cn, getStaffEyebrow } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"

const STATUSES = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const

type RowStatus = (typeof STATUSES)[number] | ""

type SheetRow = {
  studentId: string
  fullName: string | null
  email: string
  status: string | null
}

export const AdminAttendanceScreen = () => {
  const { userProfileInfo } = useUser()
  const searchParams = useSearchParams()
  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get("courseId") ?? "")
  const [selectedLectureId, setSelectedLectureId] = useState(searchParams.get("lectureId") ?? "")
  const [draft, setDraft] = useState<Record<string, RowStatus>>({})

  const { data: coursesData, refetch: refetchCourses } = useQuery<{
    getCourses: Array<{ id: string; title: string; slug: string }>
  }>(GET_COURSES, { fetchPolicy: "network-only" })
  const allCourses = coursesData?.getCourses ?? []
  const courses = useMemo(
    () => filterCoursesForGrader(allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn),
    [allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn]
  )
  const courseId = selectedCourseId || courses[0]?.id || ""

  const { data: lecturesData, loading: loadingLectures, refetch: refetchLectures } = useQuery<{
    getLecturesForCourse: Array<{ id: string; title: string; startAt: string }>
  }>(GET_LECTURES_FOR_COURSE, {
    variables: { courseId },
    skip: !courseId,
    fetchPolicy: "network-only",
  })

  const lectures = lecturesData?.getLecturesForCourse ?? []
  const lectureId = selectedLectureId || lectures[0]?.id || ""

  const { data: sheetData, loading: loadingSheet, refetch: refetchSheet } = useQuery<{
    getAttendanceSheet: {
      lectureId: string
      lectureTitle: string
      lectureStartAt: string
      rows: SheetRow[]
    }
  }>(GET_ATTENDANCE_SHEET, {
    variables: { lectureId },
    skip: !lectureId,
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    const rows = sheetData?.getAttendanceSheet?.rows ?? []
    const next: Record<string, RowStatus> = {}
    for (const row of rows) {
      next[row.studentId] = (row.status as RowStatus) || "PRESENT"
    }
    setDraft(next)
  }, [sheetData])

  const [saveAttendance, { loading: saving }] = useMutation(SAVE_LECTURE_ATTENDANCE, {
    onCompleted: () => {
      toast.success("Attendance saved.")
      refetchSheet()
    },
    onError: (e) => toast.error(e.message ?? "Failed to save attendance."),
  })

  const sheet = sheetData?.getAttendanceSheet
  const rows = sheet?.rows ?? []

  const markAll = (status: RowStatus) => {
    if (!status) return
    setDraft((prev) => {
      const next = { ...prev }
      for (const row of rows) next[row.studentId] = status
      return next
    })
  }

  const handleSave = () => {
    if (!lectureId) return
    const records = rows
      .map((row) => ({
        studentId: row.studentId,
        status: draft[row.studentId] || "ABSENT",
      }))
      .filter((r) => STATUSES.includes(r.status as (typeof STATUSES)[number]))
    saveAttendance({ variables: { lectureId, records } })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-secondary">{getStaffEyebrow(userProfileInfo?.role)}</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Attendance</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Active enrolled students are listed automatically for each lecture. Mark attendance lecture by lecture —
            students need 80% to qualify for a certificate.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="default"
          shape="pill"
          className="shrink-0 gap-2"
          onClick={() => {
            void Promise.all([
              refetchCourses(),
              courseId ? refetchLectures() : Promise.resolve(),
              lectureId ? refetchSheet() : Promise.resolve(),
            ])
            toast.success("Refreshed.")
          }}
        >
          <RefreshCwIcon className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div>
          <label className="text-muted-foreground mb-2 block text-sm font-medium">Course</label>
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-sm">No courses available.</p>
          ) : (
            <select
              value={courseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value)
                setSelectedLectureId("")
              }}
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
        <div>
          <label className="text-muted-foreground mb-2 block text-sm font-medium">Lecture</label>
          {loadingLectures ? (
            <p className="text-muted-foreground text-sm">Loading lectures…</p>
          ) : lectures.length === 0 ? (
            <p className="text-muted-foreground text-sm">Schedule a lecture first.</p>
          ) : (
            <select
              value={lectureId}
              onChange={(e) => setSelectedLectureId(e.target.value)}
              className="border-input bg-background max-w-md rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-secondary)"
            >
              {lectures.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} · {new Date(l.startAt).toLocaleString()}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {!lectureId ? null : (
        <Card className="bg-background/70 overflow-hidden rounded-3xl backdrop-blur">
          <CardContent className="p-0">
            <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <UserCheckIcon className="size-5 text-(--brand-secondary)" />
                {sheet?.lectureTitle ?? "Attendance sheet"}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" shape="pill" onClick={() => markAll("PRESENT")}>
                  Mark all present
                </Button>
                <Button type="button" variant="outline" size="sm" shape="pill" onClick={() => markAll("ABSENT")}>
                  Mark all absent
                </Button>
                <Button
                  type="button"
                  variant="brand-secondary"
                  size="sm"
                  shape="pill"
                  disabled={saving || rows.length === 0}
                  onClick={handleSave}
                >
                  {saving ? <Loader2Icon className="size-4 animate-spin" /> : "Save attendance"}
                </Button>
              </div>
            </div>

            {loadingSheet ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-16">
                <Loader2Icon className="size-6 animate-spin" />
                Loading sheet…
              </div>
            ) : rows.length === 0 ? (
              <div className="text-muted-foreground px-4 py-16 text-center text-sm">
                No active enrolled students for this course yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted-surface/40 border-b">
                    <tr>
                      <th className="p-4 font-semibold">Student</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.studentId} className="hover:bg-muted-surface/20 border-b transition-colors">
                        <td className="p-4 font-medium">{row.fullName || "—"}</td>
                        <td className="text-muted-foreground p-4">{row.email}</td>
                        <td className="p-4">
                          <select
                            value={draft[row.studentId] || ""}
                            onChange={(e) =>
                              setDraft((prev) => ({
                                ...prev,
                                [row.studentId]: e.target.value as RowStatus,
                              }))
                            }
                            className={cn(
                              "border-input bg-background rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-secondary)"
                            )}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0) + s.slice(1).toLowerCase()}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
