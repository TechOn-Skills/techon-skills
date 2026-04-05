"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { Loader2Icon, NotebookPenIcon, RefreshCwIcon, Trash2Icon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import {
  CREATE_COURSE_ASSIGNMENT,
  DELETE_COURSE_ASSIGNMENT,
  GET_COURSE_ASSIGNMENTS,
  GET_COURSES,
} from "@/lib/graphql"
import { cn } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"
import { UserRole } from "@/utils/enums/user"

type AssignmentRow = {
  id: string
  courseId: string
  title: string
  description: string | null
  maxMarks: number
  referenceId: string
  dueDate: string | null
  createdAt: string
}

export const AdminAssignmentsScreen = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [maxMarks, setMaxMarks] = useState<string>("100")
  const [dueDate, setDueDate] = useState("")
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

  const { data: assignmentsData, loading, refetch } = useQuery<{
    getCourseAssignments: AssignmentRow[]
  }>(GET_COURSE_ASSIGNMENTS, {
    variables: { courseId },
    skip: !courseId,
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    refetchCourses()
  }, [refetchCourses])

  const [createAssignment, { loading: creating }] = useMutation(CREATE_COURSE_ASSIGNMENT, {
    onCompleted: () => {
      setTitle("")
      setDescription("")
      setMaxMarks("100")
      setDueDate("")
      toast.success("Assignment created. Students can submit using this course’s assignment flow when wired to referenceId.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to create assignment."),
  })

  const [deleteAssignment, { loading: deleting }] = useMutation(DELETE_COURSE_ASSIGNMENT, {
    onCompleted: () => {
      toast.success("Assignment removed.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to delete."),
  })

  const assignments = assignmentsData?.getCourseAssignments ?? []

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId) return
    const max = parseInt(maxMarks, 10)
    if (Number.isNaN(max) || max < 1) {
      toast.error("Enter a positive max marks value.")
      return
    }
    if (!title.trim()) {
      toast.error("Title is required.")
      return
    }
    createAssignment({
      variables: {
        input: {
          courseId,
          title: title.trim(),
          description: description.trim() || undefined,
          maxMarks: max,
          dueDate: dueDate.trim() ? new Date(dueDate).toISOString() : undefined,
        },
      },
    })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-secondary">Admin</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Course assignments
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Create assignments for courses you are allowed to grade. Each assignment gets a stable{" "}
            <span className="font-mono text-xs">referenceId</span> for linking student submissions.
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
            You are not assigned to any course for grading. Ask an admin to add your courses to &quot;allowed mark grades on&quot;.
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <Card className="bg-background/70 h-fit rounded-3xl backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 font-semibold">
                <NotebookPenIcon className="size-5 text-(--brand-secondary)" />
                New assignment
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Module 3 written report"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Description (optional)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Instructions for students…"
                    className="min-h-[88px] resize-y"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Total marks</label>
                  <Input
                    type="number"
                    min={1}
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full max-w-[8rem]"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Due date (optional)</label>
                  <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full max-w-[14rem]" />
                </div>
                <Button type="submit" variant="brand-secondary" shape="pill" className="w-full" disabled={creating}>
                  {creating ? <Loader2Icon className="size-4 animate-spin" /> : "Create assignment"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-background/70 rounded-3xl backdrop-blur overflow-hidden">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                  <Loader2Icon className="size-6 animate-spin" />
                  <span>Loading assignments…</span>
                </div>
              ) : assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
                  <NotebookPenIcon className="size-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground">No assignments for this course yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted-surface/40">
                      <tr>
                        <th className="p-4 font-semibold">Title</th>
                        <th className="p-4 font-semibold">Max marks</th>
                        <th className="p-4 font-semibold">Reference</th>
                        <th className="p-4 font-semibold">Due</th>
                        <th className="p-4 font-semibold">Created</th>
                        <th className="p-4 font-semibold w-24">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((a) => (
                        <tr key={a.id} className="border-b transition-colors hover:bg-muted-surface/20">
                          <td className="p-4">
                            <Link
                              href={`/admin/assignments/${a.id}`}
                              className="font-medium text-(--brand-secondary) hover:underline"
                            >
                              {a.title}
                            </Link>
                            {a.description ? (
                              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{a.description}</p>
                            ) : null}
                          </td>
                          <td className="p-4">{a.maxMarks}</td>
                          <td className="p-4 font-mono text-xs break-all max-w-[14rem]">{a.referenceId}</td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {a.dueDate ? new Date(a.dueDate).toLocaleString() : "—"}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {new Date(a.createdAt).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              shape="pill"
                              className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                              disabled={deleting}
                              onClick={() => {
                                if (!confirm("Delete this assignment definition? Existing submissions are not removed.")) return
                                deleteAssignment({ variables: { id: a.id } })
                              }}
                            >
                              <Trash2Icon className="size-4" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
