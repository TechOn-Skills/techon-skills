"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { ClipboardCheckIcon, Loader2Icon, UserIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { GET_SUBMISSIONS_FOR_COURSE, GET_COURSES, UPDATE_SUBMISSION_MARKS } from "@/lib/graphql"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { formatDateLong } from "@/lib/helpers"
import { cn } from "@/lib/helpers"

type ShortAnswer = { questionId: number; questionText: string; answer: string }
type SubmissionRow = {
  id: string
  userId: string
  courseId: string
  type: string
  referenceId: string
  title: string
  mcqScore: number | null
  mcqMax: number | null
  shortAnswers: ShortAnswer[]
  marks: number | null
  maxMarks: number
  status: string
  markedAt: string | null
  createdAt: string
  user?: { id: string; email: string; fullName: string | null } | null
}

export const AdminSubmissionsScreen = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [markModal, setMarkModal] = useState<{ submission: SubmissionRow; marksInput: string } | null>(null)

  const { data: coursesData } = useQuery<{ getCourses: Array<{ id: string; title: string; slug: string }> }>(GET_COURSES)
  const courses = coursesData?.getCourses ?? []

  const courseId = selectedCourseId || courses[0]?.id || ""
  const { data: submissionsData, loading, refetch } = useQuery<{
    getSubmissionsForCourse: SubmissionRow[]
  }>(GET_SUBMISSIONS_FOR_COURSE, {
    variables: { courseId, status: undefined },
    skip: !courseId,
  })

  const [updateMarks, { loading: updating }] = useMutation(UPDATE_SUBMISSION_MARKS, {
    onCompleted: () => {
      setMarkModal(null)
      toast.success("Marks saved. Student will be notified.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to save marks."),
  })

  const submissions = submissionsData?.getSubmissionsForCourse ?? []

  const handleMarkSubmit = () => {
    if (!markModal) return
    const num = parseInt(markModal.marksInput, 10)
    if (Number.isNaN(num) || num < 0 || num > markModal.submission.maxMarks) {
      toast.error(`Enter marks between 0 and ${markModal.submission.maxMarks}`)
      return
    }
    updateMarks({ variables: { input: { id: markModal.submission.id, marks: num } } })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Grade Submissions
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          View graded exercises and assignments by course. Award marks for short answers; students are notified when marked.
        </p>
      </div>

      <div className="mb-6">
        <label className="text-muted-foreground mb-2 block text-sm font-medium">Course</label>
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
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading submissions…</span>
        </div>
      ) : submissions.length === 0 ? (
        <Card className="bg-background/70 backdrop-blur rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardCheckIcon className="size-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No submissions for this course yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted-surface/40">
                  <tr>
                    <th className="p-4 font-semibold">Student</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">MCQ score</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Marks</th>
                    <th className="p-4 font-semibold">Submitted</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id} className="border-b transition-colors hover:bg-muted-surface/20">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <UserIcon className="size-4 text-muted-foreground" />
                          <span>{s.user?.fullName || s.user?.email || s.userId}</span>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{s.type.replace("_", " ")}</td>
                      <td className="p-4 font-medium">{s.title}</td>
                      <td className="p-4">
                        {s.mcqMax != null && s.mcqMax > 0
                          ? `${s.mcqScore ?? 0}%`
                          : "—"}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-xs font-medium",
                            s.status === "marked"
                              ? "bg-green-500/20 text-green-600 dark:text-green-400"
                              : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {s.status === "marked" ? "Marked" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        {s.status === "marked" ? `${s.marks ?? 0} / ${s.maxMarks}` : "—"}
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDateLong(s.createdAt)}</td>
                      <td className="p-4">
                        {s.status === "submitted" ? (
                          <Button
                            type="button"
                            variant="brand-secondary"
                            size="sm"
                            shape="pill"
                            onClick={() =>
                              setMarkModal({
                                submission: s,
                                marksInput: String(s.maxMarks),
                              })
                            }
                          >
                            Award marks
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mark modal */}
      <DialogPrimitive.Root
        open={!!markModal}
        onOpenChange={(open) => !open && setMarkModal(null)}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-6 shadow-xl outline-none">
            {markModal && (
              <>
                <DialogPrimitive.Title className="text-lg font-semibold">
                  Award marks: {markModal.submission.title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
                  MCQ score: {markModal.submission.mcqMax != null && markModal.submission.mcqMax > 0
                    ? `${markModal.submission.mcqScore ?? 0}%`
                    : "N/A"}
                  . Enter total marks for short answers (out of {markModal.submission.maxMarks}).
                </DialogPrimitive.Description>
                {markModal.submission.shortAnswers.length > 0 && (
                  <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border bg-muted-surface/30 p-3 text-sm">
                    <div className="font-medium mb-2">Short answers</div>
                    {markModal.submission.shortAnswers.map((sa) => (
                      <div key={sa.questionId} className="mb-3">
                        <p className="text-muted-foreground text-xs">{sa.questionText}</p>
                        <p className="mt-1">{sa.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">
                    Marks (0 – {markModal.submission.maxMarks})
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={markModal.submission.maxMarks}
                    value={markModal.marksInput}
                    onChange={(e) =>
                      setMarkModal((prev) =>
                        prev ? { ...prev, marksInput: e.target.value } : null
                      )
                    }
                    className="w-24"
                  />
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <DialogPrimitive.Close asChild>
                    <Button type="button" variant="outline" shape="pill">
                      Cancel
                    </Button>
                  </DialogPrimitive.Close>
                  <Button
                    type="button"
                    variant="brand-secondary"
                    shape="pill"
                    disabled={updating}
                    onClick={handleMarkSubmit}
                  >
                    {updating ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      "Save marks"
                    )}
                  </Button>
                </div>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
