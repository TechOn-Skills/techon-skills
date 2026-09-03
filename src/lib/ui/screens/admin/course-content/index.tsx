"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { FolderOpenIcon, Loader2Icon, RefreshCwIcon, Trash2Icon, UploadIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import {
  CREATE_COURSE_CONTENT,
  DELETE_COURSE_CONTENT,
  GET_COURSE_CONTENTS_FOR_STAFF,
  GET_COURSES,
  PUBLISH_COURSE_CONTENT,
} from "@/lib/graphql"
import { filterCoursesForGrader } from "@/lib/helpers/grader-courses"
import { cn, getStaffEyebrow } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"
import { apiService } from "@/lib/services"

type Attachment = { url: string; filename: string; contentType: string }

type ContentRow = {
  id: string
  courseId: string
  title: string
  description: string | null
  attachments: Attachment[]
  sortOrder: number
  isPublished: boolean
  createdAt: string
}

const ACCEPT = "image/*,.pdf,application/pdf,.ppt,.pptx,.doc,.docx,.zip"

export const AdminCourseContentScreen = () => {
  const { userProfileInfo } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploading, setUploading] = useState(false)

  const { data: coursesData, refetch: refetchCourses } = useQuery<{
    getCourses: Array<{ id: string; title: string; slug: string }>
  }>(GET_COURSES, { fetchPolicy: "network-only" })
  const allCourses = coursesData?.getCourses ?? []
  const courses = useMemo(
    () => filterCoursesForGrader(allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn),
    [allCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn]
  )
  const courseId = selectedCourseId || courses[0]?.id || ""

  const { data, loading, refetch } = useQuery<{ getCourseContentsForStaff: ContentRow[] }>(
    GET_COURSE_CONTENTS_FOR_STAFF,
    { variables: { courseId }, skip: !courseId, fetchPolicy: "network-only" }
  )

  useEffect(() => {
    refetchCourses()
  }, [refetchCourses])

  const [createContent, { loading: creating }] = useMutation(CREATE_COURSE_CONTENT, {
    onCompleted: () => {
      setTitle("")
      setDescription("")
      setAttachments([])
      toast.success("Content saved as draft. Publish so students can see it.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to create content."),
  })

  const [publishContent, { loading: publishing }] = useMutation(PUBLISH_COURSE_CONTENT, {
    onCompleted: () => {
      toast.success("Content published.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to publish."),
  })

  const [deleteContent, { loading: deleting }] = useMutation(DELETE_COURSE_CONTENT, {
    onCompleted: () => {
      toast.success("Content removed.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to delete."),
  })

  const rows = data?.getCourseContentsForStaff ?? []

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !courseId) return
    setUploading(true)
    try {
      const uploaded: Attachment[] = []
      for (const file of Array.from(files)) {
        const res = await apiService.uploadImage(file, "course-content", courseId)
        if (!res?.success || !res.data?.url) {
          throw new Error(res?.message || `Failed to upload ${file.name}`)
        }
        uploaded.push({
          url: res.data.url,
          filename: res.data.filename || file.name,
          contentType: file.type || "",
        })
      }
      setAttachments((prev) => [...prev, ...uploaded])
      toast.success(uploaded.length === 1 ? "File uploaded." : `${uploaded.length} files uploaded.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId) return
    if (!title.trim()) {
      toast.error("Title is required.")
      return
    }
    createContent({
      variables: {
        input: {
          courseId,
          title: title.trim(),
          description: description.trim() || undefined,
          attachments: attachments.length ? attachments : undefined,
        },
      },
    })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-secondary">{getStaffEyebrow(userProfileInfo?.role)}</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Course content</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Upload slides and materials for your course. Publish when ready — enrolled students can open them from Course content.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="default"
          shape="pill"
          onClick={() => {
            void Promise.all([refetchCourses(), courseId ? refetch() : Promise.resolve()])
            toast.success("Refreshed.")
          }}
          className="shrink-0 gap-2"
        >
          <RefreshCwIcon className="size-4" />
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <Card className="bg-background/70 h-fit rounded-3xl backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 font-semibold">
                <FolderOpenIcon className="size-5 text-(--brand-secondary)" />
                New material
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Week 3 slides"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Notes (optional)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What this material covers…"
                    className="min-h-[88px] resize-y"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-medium">Files</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT}
                    multiple
                    className="hidden"
                    onChange={(e) => void handleFiles(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    shape="pill"
                    className="w-full gap-2"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? <Loader2Icon className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
                    Upload slides / files
                  </Button>
                  {attachments.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {attachments.map((a) => (
                        <li
                          key={a.url}
                          className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs"
                        >
                          <a href={a.url} target="_blank" rel="noreferrer" className="truncate text-(--brand-secondary) hover:underline">
                            {a.filename || a.url}
                          </a>
                          <button
                            type="button"
                            className="text-destructive shrink-0"
                            onClick={() => setAttachments((prev) => prev.filter((x) => x.url !== a.url))}
                          >
                            <Trash2Icon className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <Button type="submit" variant="brand-secondary" shape="pill" className="w-full" disabled={creating || uploading}>
                  {creating ? <Loader2Icon className="size-4 animate-spin" /> : "Save as draft"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-background/70 overflow-hidden rounded-3xl backdrop-blur">
            <CardContent className="p-0">
              {loading ? (
                <div className="text-muted-foreground flex items-center justify-center gap-2 py-16">
                  <Loader2Icon className="size-6 animate-spin" />
                  <span>Loading content…</span>
                </div>
              ) : rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
                  <FolderOpenIcon className="text-muted-foreground/40 size-12" />
                  <p className="text-muted-foreground">No course materials yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted-surface/40 border-b">
                      <tr>
                        <th className="p-4 font-semibold">Title</th>
                        <th className="p-4 font-semibold">Files</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.id} className="hover:bg-muted-surface/20 border-b transition-colors">
                          <td className="p-4">
                            <div className="font-medium">{row.title}</div>
                            {row.description ? (
                              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{row.description}</p>
                            ) : null}
                          </td>
                          <td className="p-4 text-xs">
                            {row.attachments.length === 0 ? (
                              <span className="text-muted-foreground">—</span>
                            ) : (
                              <ul className="space-y-1">
                                {row.attachments.map((a) => (
                                  <li key={a.url}>
                                    <a href={a.url} target="_blank" rel="noreferrer" className="text-(--brand-secondary) hover:underline">
                                      {a.filename || "File"}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                "rounded-full px-2 py-1 text-xs font-medium",
                                row.isPublished ? "bg-green-500/20 text-green-700" : "bg-amber-500/20 text-amber-700"
                              )}
                            >
                              {row.isPublished ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {!row.isPublished ? (
                                <Button
                                  type="button"
                                  variant="brand-secondary"
                                  size="sm"
                                  shape="pill"
                                  disabled={publishing}
                                  onClick={() => publishContent({ variables: { id: row.id } })}
                                >
                                  Publish
                                </Button>
                              ) : null}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                shape="pill"
                                className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1"
                                disabled={deleting}
                                onClick={() => {
                                  if (!confirm("Delete this content?")) return
                                  deleteContent({ variables: { id: row.id } })
                                }}
                              >
                                <Trash2Icon className="size-4" />
                                Delete
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
