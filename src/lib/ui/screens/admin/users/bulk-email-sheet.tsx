"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { Loader2Icon, SendIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Input } from "@/lib/ui/useable-components/input"
import { RichTextEditor } from "@/lib/ui/useable-components/rich-text-editor"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/lib/ui/useable-components/sheet"
import { GET_COURSES, SEND_BULK_EMAIL } from "@/lib/graphql"
import { cn } from "@/lib/helpers"
import { SheetContentSide } from "@/utils/enums"

export type BulkEmailAudience = "SELECTED" | "ALL_STUDENTS" | "COURSE_STUDENTS" | "BIN" | "PENDING_REGISTRATIONS"

const AUDIENCE_LABELS: Record<BulkEmailAudience, string> = {
  SELECTED: "Selected users",
  ALL_STUDENTS: "All active students",
  COURSE_STUDENTS: "Students of one course",
  BIN: "Everyone in the bin",
  PENDING_REGISTRATIONS: "Pending registration requests",
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Users ticked in the list; enables the "Selected users" audience. */
  selectedIds?: string[]
  /** Audiences offered, in order; the first is preselected. */
  audiences: BulkEmailAudience[]
  onSent?: () => void
}

/**
 * Compose one email and queue it to many users (sent in the background, ~1–2 per second).
 * Parents remount it (via `key`) each time it opens, so the form starts empty.
 */
export function BulkEmailSheet({ open, onOpenChange, selectedIds = [], audiences, onSent }: Props) {
  const [audience, setAudience] = useState<BulkEmailAudience>(audiences[0] ?? "ALL_STUDENTS")
  const [courseId, setCourseId] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isMarketing, setIsMarketing] = useState(true)

  const { data: coursesData } = useQuery<{ getCourses: { id: string; title: string }[] }>(GET_COURSES, {
    skip: !audiences.includes("COURSE_STUDENTS"),
  })
  const courses = coursesData?.getCourses ?? []

  const [sendBulkEmail, { loading }] = useMutation<{
    sendBulkEmail: { queued: number; skippedUnsubscribed: number; estimatedMinutes: number }
  }>(SEND_BULK_EMAIL)

  const plainBody = body.replace(/<[^>]+>/g, "").trim()
  const canSend =
    subject.trim().length > 0 &&
    plainBody.length > 0 &&
    (audience !== "SELECTED" || selectedIds.length > 0) &&
    (audience !== "COURSE_STUDENTS" || !!courseId)

  const handleSend = async () => {
    try {
      const res = await sendBulkEmail({
        variables: {
          input: {
            audience,
            subject: subject.trim(),
            bodyHtml: body,
            isMarketing,
            ...(audience === "SELECTED" ? { userIds: selectedIds } : {}),
            ...(audience === "COURSE_STUDENTS" ? { courseId } : {}),
          },
        },
      })
      const r = res.data?.sendBulkEmail
      if (r) {
        const skipped = r.skippedUnsubscribed ? ` (${r.skippedUnsubscribed} unsubscribed skipped)` : ""
        const eta = r.estimatedMinutes > 1 ? ` Sending takes about ${r.estimatedMinutes} minutes.` : ""
        toast.success(`Queued for ${r.queued} recipient${r.queued === 1 ? "" : "s"}${skipped}.${eta}`)
      }
      onSent?.()
      onOpenChange(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Email users</SheetTitle>
          <SheetDescription>Emails are queued and sent in the background.</SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <div className="text-muted-foreground mb-1.5 text-sm font-medium">Send to</div>
            <div className="flex flex-wrap gap-2">
              {audiences.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAudience(a)}
                  disabled={a === "SELECTED" && selectedIds.length === 0}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40",
                    audience === a ? "border-(--brand-primary) bg-(--brand-primary)/10" : "hover:bg-muted-surface/50"
                  )}
                >
                  {AUDIENCE_LABELS[a]}
                  {a === "SELECTED" ? ` (${selectedIds.length})` : ""}
                </button>
              ))}
            </div>
          </div>
          {audience === "COURSE_STUDENTS" && (
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="border-input bg-background h-10 w-full rounded-xl border px-3 text-sm"
            >
              <option value="">Choose a course…</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          )}
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. New batch starting next month" className="rounded-xl" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Message</label>
            <RichTextEditor value={body} onChange={setBody} placeholder="Write your message..." minHeight="200px" />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={isMarketing} onChange={(e) => setIsMarketing(e.target.checked)} />
            <span>
              Marketing email
              <span className="text-muted-foreground block text-xs">
                Adds an unsubscribe link and skips people who unsubscribed. Untick only for important course or account notices.
              </span>
            </span>
          </label>
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="brand-secondary" onClick={handleSend} disabled={loading || !canSend}>
            {loading ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
            <span className="ml-2">{loading ? "Queuing..." : "Send"}</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
