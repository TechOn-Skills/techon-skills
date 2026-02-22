"use client"

import { useState, useEffect, useCallback } from "react"
import {
  SearchIcon,
  MailIcon,
  CalendarIcon,
  UserIcon,
  Loader2Icon,
  InboxIcon,
  SendIcon,
  BookOpenIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { getApiDisplayMessage } from "@/lib/helpers"
import { apiService } from "@/lib/services"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/lib/ui/useable-components/sheet"
import { CourseMultiSelect } from "@/lib/ui/useable-components/course-multi-select"
import type { IContactFormSubmission } from "@/utils/interfaces/contact-form"
import type { IContactFormCourse } from "@/utils/interfaces/courses"
import { SheetContentSide } from "@/utils/enums"

const PAGE_SIZE = 10

export const AdminContactSubmissionsScreen = () => {
  const [submissions, setSubmissions] = useState<IContactFormSubmission[]>([])
  const [total, setTotal] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sendEmailOpen, setSendEmailOpen] = useState<IContactFormSubmission | null>(null)
  const [assignCoursesOpen, setAssignCoursesOpen] = useState<IContactFormSubmission | null>(null)

  const fetchSubmissions = useCallback(async (pageNum: number) => {
    setLoading(true)
    const response = await apiService.getContactFormSubmissions(pageNum, PAGE_SIZE)
    setLoading(false)
    if (response.success && response.data) {
      setSubmissions(response.data)
      setTotal(response.total)
    } else {
      setSubmissions([])
      if (response.total !== undefined) setTotal(response.total)
      if (!response.success) {
        toast.error(getApiDisplayMessage(response, "Failed to load contact submissions."))
      }
    }
  }, [])

  useEffect(() => {
    fetchSubmissions(page)
  }, [fetchSubmissions, page])

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Contact form submissions
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          View submissions from the public contact form. Send emails and assign courses to students from here.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="text-muted-foreground text-xs mb-1">
                {total != null ? "Total submissions" : "Submissions on this page"}
              </div>
              <div className="text-3xl font-semibold tracking-tight text-(--brand-primary)">
                {loading ? "—" : total != null ? total : submissions.length}
              </div>
              <div className="text-muted-foreground text-xs mt-1">Page {page}{total != null ? ` of ${Math.ceil(total / PAGE_SIZE) || 1}` : ""}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, phone or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
        <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                <Loader2Icon className="size-6 animate-spin" />
                {page === 1 && <span>Loading submissions...</span>}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-border border-b bg-background/40">
                    <tr>
                      <th className="p-4 font-semibold">Contact</th>
                      <th className="p-4 font-semibold">Message</th>
                      <th className="p-4 font-semibold">Courses</th>
                      <th className="p-4 font-semibold">Submitted</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((sub, idx) => (
                      <tr
                        key={sub._id}
                        className="border-border border-b transition-colors hover:bg-background/60 animate-in fade-in slide-in-from-bottom-2 duration-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-(--brand-primary) text-(--text-on-dark) size-10 rounded-xl flex items-center justify-center shrink-0">
                              <UserIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-semibold">{sub.name}</div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MailIcon className="size-3" />
                                <span className="truncate max-w-[180px]">{sub.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <PhoneIcon className="size-3" />
                                {sub.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 max-w-[220px]">
                          <span className="text-muted-foreground text-xs line-clamp-2">
                            {sub.message || "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {sub.courses?.length
                              ? sub.courses.slice(0, 3).map((c) => (
                                <span
                                  key={c.slug}
                                  className="rounded-full bg-(--brand-primary)/15 px-2 py-0.5 text-xs font-medium text-(--brand-primary)"
                                >
                                  {c.title}
                                </span>
                              ))
                              : "—"}
                            {sub.courses?.length > 3 && (
                              <span className="text-muted-foreground text-xs">+{sub.courses.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarIcon className="size-3" />
                            {sub.createdAt
                              ? new Date(sub.createdAt).toLocaleString()
                              : "—"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="brand-secondary"
                              size="sm"
                              shape="pill"
                              onClick={() => setSendEmailOpen(sub)}
                            >
                              <SendIcon className="size-4" />
                              <span className="ml-2">Send email</span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              shape="pill"
                              onClick={() => setAssignCoursesOpen(sub)}
                            >
                              <BookOpenIcon className="size-4" />
                              <span className="ml-2">Assign courses</span>
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
          {!loading && (submissions.length > 0 || page > 1) && (
            <div className="border-border flex items-center justify-between border-t px-4 py-3">
              <div className="text-muted-foreground text-sm">
                {total != null
                  ? `Page ${page} of ${Math.ceil(total / PAGE_SIZE) || 1}`
                  : `Page ${page}`}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeftIcon className="size-4" />
                  <span className="ml-1">Previous</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={total != null ? page * PAGE_SIZE >= total : submissions.length < PAGE_SIZE}
                >
                  <span className="mr-1">Next</span>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {!loading && filteredSubmissions.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed bg-background/40 py-16 text-center">
          <InboxIcon className="size-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium">
            {submissions.length === 0
              ? "No contact form submissions yet."
              : "No submissions match your search."}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {submissions.length === 0
              ? "Submissions will appear here when visitors use the contact form."
              : "Try a different search term."}
          </p>
        </div>
      )}

      <SendEmailSheet
        submission={sendEmailOpen}
        open={!!sendEmailOpen}
        onOpenChange={(open) => !open && setSendEmailOpen(null)}
        onSuccess={() => setSendEmailOpen(null)}
      />
      <AssignCoursesSheet
        submission={assignCoursesOpen}
        open={!!assignCoursesOpen}
        onOpenChange={(open) => !open && setAssignCoursesOpen(null)}
        onSuccess={() => {
          setAssignCoursesOpen(null)
          fetchSubmissions(page)
        }}
      />
    </div>
  )
}

function SendEmailSheet({
  submission,
  open,
  onOpenChange,
  onSuccess,
}: {
  submission: IContactFormSubmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (submission) {
      setSubject("")
      setBody("")
    }
  }, [submission?._id])

  const handleSend = async () => {
    if (!submission) return
    setSending(true)
    const toastId = toast.loading("Sending email...")
    const response = await apiService.sendEmailToContact(submission._id, subject, body)
    toast.dismiss(toastId)
    setSending(false)
    if (response.success) {
      toast.success(getApiDisplayMessage(response, "Email sent successfully."))
      onSuccess()
      onOpenChange(false)
    } else {
      toast.error(getApiDisplayMessage(response, "Failed to send email. Please try again."))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Send email</SheetTitle>
          <SheetDescription>
            {submission ? (
              <>
                To: <span className="font-medium text-foreground">{submission.email}</span>
                {submission.name && (
                  <span className="text-muted-foreground"> ({submission.name})</span>
                )}
              </>
            ) : null}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Message</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={6}
              className="rounded-xl resize-y"
            />
          </div>
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand-secondary"
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
          >
            {sending ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
            <span className="ml-2">{sending ? "Sending..." : "Send email"}</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function AssignCoursesSheet({
  submission,
  open,
  onOpenChange,
  onSuccess,
}: {
  submission: IContactFormSubmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [selectedCourses, setSelectedCourses] = useState<IContactFormCourse[]>([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (submission) {
      setSelectedCourses(submission.courses ?? [])
    }
  }, [submission?._id, submission?.courses])

  const handleAssign = async () => {
    if (!submission) return
    setSending(true)
    const toastId = toast.loading("Assigning courses...")
    const response = await apiService.assignCoursesToContact(
      submission._id,
      selectedCourses.map((c) => c.slug)
    )
    toast.dismiss(toastId)
    setSending(false)
    if (response.success) {
      toast.success(getApiDisplayMessage(response, "Courses assigned successfully."))
      onSuccess()
      onOpenChange(false)
    } else {
      toast.error(getApiDisplayMessage(response, "Failed to assign courses. Please try again."))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Assign courses</SheetTitle>
          <SheetDescription>
            {submission ? (
              <>
                For: <span className="font-medium text-foreground">{submission.name}</span>
                <span className="text-muted-foreground"> ({submission.email})</span>
              </>
            ) : null}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Courses</label>
            <CourseMultiSelect
              value={selectedCourses}
              onChange={setSelectedCourses}
              placeholder="Search and select courses to assign..."
            />
          </div>
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand-secondary"
            onClick={handleAssign}
            disabled={sending}
          >
            {sending ? <Loader2Icon className="size-4 animate-spin" /> : <BookOpenIcon className="size-4" />}
            <span className="ml-2">{sending ? "Saving..." : "Assign courses"}</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
