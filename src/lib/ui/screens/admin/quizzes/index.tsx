"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { Loader2Icon, PlusIcon, RefreshCwIcon, Trash2Icon, ClipboardListIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import {
  CREATE_QUIZ,
  DELETE_QUIZ,
  GET_COURSES,
  GET_QUIZZES_FOR_COURSE,
  PUBLISH_QUIZ,
} from "@/lib/graphql"
import { filterCoursesForGrader } from "@/lib/helpers/grader-courses"
import { cn } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"

type QuestionDraft = {
  prompt: string
  marks: string
  options: string[]
  correctIndexes: number[]
}

type QuizRow = {
  id: string
  title: string
  totalMarks: number
  passPercentage: number
  isPublished: boolean
  dueDate: string | null
  createdAt: string
}

const emptyQuestion = (): QuestionDraft => ({
  prompt: "",
  marks: "1",
  options: ["", ""],
  correctIndexes: [],
})

export const AdminQuizzesScreen = () => {
  const { userProfileInfo } = useUser()
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [instructions, setInstructions] = useState("")
  const [passPercentage, setPassPercentage] = useState("50")
  const [dueDate, setDueDate] = useState("")
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()])

  const { data: coursesData, refetch: refetchCourses } = useQuery<{
    getCourses: Array<{ id: string; title: string }>
  }>(GET_COURSES, { fetchPolicy: "network-only" })
  const allCourses = coursesData?.getCourses ?? []
  const courses = useMemo(
    () => filterCoursesForGrader(allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn),
    [allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn]
  )
  const courseId = selectedCourseId || courses[0]?.id || ""

  const { data: quizData, loading, refetch } = useQuery<{ getQuizzesForCourse: QuizRow[] }>(GET_QUIZZES_FOR_COURSE, {
    variables: { courseId },
    skip: !courseId,
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    refetchCourses()
  }, [refetchCourses])

  const [createQuiz, { loading: creating }] = useMutation(CREATE_QUIZ, {
    onCompleted: () => {
      setTitle("")
      setDescription("")
      setInstructions("")
      setPassPercentage("50")
      setDueDate("")
      setQuestions([emptyQuestion()])
      toast.success("Quiz created as draft. Publish it when ready.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to create quiz."),
  })

  const [publishQuiz, { loading: publishing }] = useMutation(PUBLISH_QUIZ, {
    onCompleted: () => {
      toast.success("Quiz published. Students can attempt it now.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to publish."),
  })

  const [deleteQuiz, { loading: deleting }] = useMutation(DELETE_QUIZ, {
    onCompleted: () => {
      toast.success("Quiz removed.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to delete."),
  })

  const quizzes = quizData?.getQuizzesForCourse ?? []
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

  const updateQuestion = (idx: number, patch: Partial<QuestionDraft>) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)))
  }

  const toggleCorrect = (qIdx: number, optIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        const has = q.correctIndexes.includes(optIdx)
        const correctIndexes = has ? q.correctIndexes.filter((x) => x !== optIdx) : [...q.correctIndexes, optIdx]
        return { ...q, correctIndexes }
      })
    )
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId || !title.trim()) {
      toast.error("Course and title are required.")
      return
    }
    const pass = parseInt(passPercentage, 10)
    if (Number.isNaN(pass) || pass < 0 || pass > 100) {
      toast.error("Pass percentage must be 0–100.")
      return
    }
    const built = questions.map((q, qi) => {
      const opts = q.options.map((t) => t.trim()).filter(Boolean)
      if (!q.prompt.trim()) throw new Error(`Question ${qi + 1} needs a prompt.`)
      if (opts.length < 2) throw new Error(`Question ${qi + 1} needs at least 2 options.`)
      if (q.correctIndexes.length < 1) throw new Error(`Question ${qi + 1}: mark at least one correct option.`)
      const marks = parseInt(q.marks, 10)
      return {
        prompt: q.prompt.trim(),
        marks: Number.isNaN(marks) || marks < 1 ? 1 : marks,
        options: opts.map((text) => ({ text })),
        correctOptionIndexes: q.correctIndexes,
      }
    })

    try {
      createQuiz({
        variables: {
          input: {
            courseId,
            title: title.trim(),
            description: description.trim() || undefined,
            instructions: instructions.trim() || undefined,
            passPercentage: pass,
            dueDate: dueDate.trim() ? new Date(dueDate).toISOString() : undefined,
            questions: built,
          },
        },
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid quiz.")
    }
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-secondary">Instructor</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Course quizzes</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Create MCQ quizzes, mark the correct options, then publish. Students get instant results when they submit.
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
            No courses available for your account.
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr]">
          <Card className="bg-background/70 h-fit rounded-3xl backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 font-semibold">
                <ClipboardListIcon className="size-5 text-(--brand-secondary)" />
                New quiz (draft)
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Week 2 MCQ" />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Description</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[60px]" />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Instructions</label>
                  <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="min-h-[60px]" />
                </div>
                <div className="flex gap-3">
                  <div>
                    <label className="text-muted-foreground mb-1 block text-xs font-medium">Pass %</label>
                    <Input type="number" min={0} max={100} value={passPercentage} onChange={(e) => setPassPercentage(e.target.value)} className="w-20" />
                  </div>
                  <div className="flex-1">
                    <label className="text-muted-foreground mb-1 block text-xs font-medium">Due (optional)</label>
                    <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <p className="text-sm font-medium">Questions</p>
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 rounded-xl border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">Q{qIdx + 1}</span>
                        {questions.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => setQuestions((p) => p.filter((_, i) => i !== qIdx))}>
                            Remove
                          </Button>
                        )}
                      </div>
                      <Input
                        value={q.prompt}
                        onChange={(e) => updateQuestion(qIdx, { prompt: e.target.value })}
                        placeholder="Question prompt"
                      />
                      <Input
                        type="number"
                        min={1}
                        value={q.marks}
                        onChange={(e) => updateQuestion(qIdx, { marks: e.target.value })}
                        className="w-24"
                        placeholder="Marks"
                      />
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={q.correctIndexes.includes(oIdx)}
                            onChange={() => toggleCorrect(qIdx, oIdx)}
                            aria-label={`Correct option ${oIdx + 1}`}
                          />
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const next = [...q.options]
                              next[oIdx] = e.target.value
                              updateQuestion(qIdx, { options: next })
                            }}
                            placeholder={`Option ${oIdx + 1}`}
                            className="flex-1"
                          />
                          {q.options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuestion(qIdx, {
                                  options: q.options.filter((_, i) => i !== oIdx),
                                  correctIndexes: q.correctIndexes.filter((i) => i !== oIdx).map((i) => (i > oIdx ? i - 1 : i)),
                                })
                              }
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        shape="pill"
                        onClick={() => updateQuestion(qIdx, { options: [...q.options, ""] })}
                      >
                        <PlusIcon className="size-3" /> Add option
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" shape="pill" className="w-full" onClick={() => setQuestions((p) => [...p, emptyQuestion()])}>
                    Add question
                  </Button>
                </div>

                <Button type="submit" variant="brand-secondary" shape="pill" className="w-full" disabled={creating}>
                  {creating ? <Loader2Icon className="size-4 animate-spin" /> : "Save draft quiz"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-background/70 overflow-hidden rounded-3xl backdrop-blur">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                  <Loader2Icon className="size-6 animate-spin" />
                  Loading…
                </div>
              ) : quizzes.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <ClipboardListIcon className="size-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground">No quizzes for this course yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted-surface/40">
                      <tr>
                        <th className="p-4 font-semibold">Title</th>
                        <th className="p-4 font-semibold">Marks</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Due</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map((q) => (
                        <tr key={q.id} className="border-b hover:bg-muted-surface/20">
                          <td className="p-4 font-medium">{q.title}</td>
                          <td className="p-4">{q.totalMarks}</td>
                          <td className="p-4">
                            <span
                              className={cn(
                                "rounded-full px-2 py-1 text-xs font-medium",
                                q.isPublished ? "bg-green-500/20 text-green-700" : "bg-amber-500/20 text-amber-700"
                              )}
                            >
                              {q.isPublished ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="text-muted-foreground p-4 text-xs">{q.dueDate ? new Date(q.dueDate).toLocaleString() : "—"}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {!q.isPublished && (
                                <Button
                                  type="button"
                                  variant="brand-secondary"
                                  size="sm"
                                  shape="pill"
                                  disabled={publishing}
                                  onClick={() => publishQuiz({ variables: { id: q.id } })}
                                >
                                  Publish
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                shape="pill"
                                className="gap-1 text-destructive"
                                disabled={deleting}
                                onClick={() => {
                                  if (!confirm("Delete this quiz?")) return
                                  deleteQuiz({ variables: { id: q.id } })
                                }}
                              >
                                <Trash2Icon className="size-4" />
                              </Button>
                            </div>
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
