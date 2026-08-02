"use client"

import { useMemo, useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  VideoIcon,
  LinkIcon,
  CalendarClockIcon,
  ListXIcon,
  FilterIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { ConfirmDialog } from "@/lib/ui/useable-components/confirm-dialog"
import {
  GET_COURSES,
  GET_LECTURES_FOR_STAFF,
  CREATE_RECURRING_LECTURE_SCHEDULE,
  UPDATE_LECTURE,
  DELETE_LECTURE,
  DELETE_LECTURE_SERIES,
} from "@/lib/graphql"
import { cn, getStaffEyebrow, getClientTimezone } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"
import { filterCoursesForGrader } from "@/lib/helpers/grader-courses"

const WEEKDAYS = [
  { v: 0, label: "Sunday" },
  { v: 1, label: "Monday" },
  { v: 2, label: "Tuesday" },
  { v: 3, label: "Wednesday" },
  { v: 4, label: "Thursday" },
  { v: 5, label: "Friday" },
  { v: 6, label: "Saturday" },
] as const

function clientTz(): string | undefined {
  const tz = getClientTimezone()
  return tz || undefined
}

/** UTC ISO → datetime-local value in the client's personal timezone. */
function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const tz = clientTz()
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(d)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value])
  ) as Record<string, string>
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

/** datetime-local wall time in client TZ → UTC ISO (browser interprets as local). */
function fromDatetimeLocalValue(s: string): string {
  const d = new Date(s)
  return d.toISOString()
}

function formatSession(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: clientTz(),
    })
  } catch {
    return iso
  }
}

/** Inclusive local calendar-day bounds for `yyyy-mm-dd` inputs */
function startOfLocalDay(yyyyMmDd: string): Date | null {
  if (!yyyyMmDd.trim()) return null
  const p = yyyyMmDd.trim().split("-").map(Number)
  if (p.length !== 3 || p.some((n) => Number.isNaN(n))) return null
  const [y, m, d] = p
  return new Date(y, m - 1, d, 0, 0, 0, 0)
}

function endOfLocalDay(yyyyMmDd: string): Date | null {
  if (!yyyyMmDd.trim()) return null
  const p = yyyyMmDd.trim().split("-").map(Number)
  if (p.length !== 3 || p.some((n) => Number.isNaN(n))) return null
  const [y, m, d] = p
  return new Date(y, m - 1, d, 23, 59, 59, 999)
}

type SortKey = "start_desc" | "start_asc" | "course_asc" | "title_asc"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "start_desc", label: "Start time (newest first)" },
  { value: "start_asc", label: "Start time (oldest first)" },
  { value: "course_asc", label: "Course (A–Z)" },
  { value: "title_asc", label: "Title (A–Z)" },
]

type LectureRow = {
  id: string
  courseId?: string | null
  courseName?: string | null
  title: string
  meetUrl?: string | null
  durationMins: number
  startAt: string
  seriesId?: string | null
  reminderEmailSent: boolean
}

type CourseOpt = { id: string; title: string; courseDurationInMonths?: number | null }

const emptySchedule = {
  courseId: "",
  title: "",
  meetUrl: "",
  durationMins: 60,
  /** 0=Sun … 6=Sat (client local calendar); any combination */
  selectedWeekdays: [1, 2, 3] as number[],
  startDate: "",
  timeOfDay: "14:00",
  repeatUntil: "",
}

function toggleWeekdayInList(current: number[], day: number): number[] {
  const has = current.includes(day)
  const next = has ? current.filter((d) => d !== day) : [...current, day]
  return [...new Set(next)].sort((a, b) => a - b)
}

export const AdminScheduleLecturesScreen = () => {
  const { userProfileInfo } = useUser()
  const timezoneLabel = getClientTimezone() || "your local timezone"
  const [createOpen, setCreateOpen] = useState(false)
  const [editRow, setEditRow] = useState<LectureRow | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteSeriesId, setDeleteSeriesId] = useState<string | null>(null)
  const [scheduleForm, setScheduleForm] = useState(emptySchedule)
  const [editForm, setEditForm] = useState({
    title: "",
    meetUrl: "",
    durationMins: 60,
    startAtLocal: "",
  })

  const [filterCourseId, setFilterCourseId] = useState("")
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("start_desc")

  const { data: coursesData, loading: coursesLoading } = useQuery<{ getCourses: CourseOpt[] }>(GET_COURSES)
  const courses = useMemo(
    () => filterCoursesForGrader(coursesData?.getCourses ?? [], userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn),
    [coursesData?.getCourses, userProfileInfo?.role, userProfileInfo?.allowedMarkGradesOn]
  )
  const { data, loading, error, refetch } = useQuery<{ getLecturesForStaff: LectureRow[] }>(GET_LECTURES_FOR_STAFF, {
    fetchPolicy: "network-only",
  })

  const [createSchedule, { loading: creating }] = useMutation(CREATE_RECURRING_LECTURE_SCHEDULE, {
    onCompleted: () => {
      toast.success("Recurring schedule created")
      setCreateOpen(false)
      setScheduleForm(emptySchedule)
      void refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const [updateLecture, { loading: updating }] = useMutation(UPDATE_LECTURE, {
    onCompleted: () => {
      toast.success("Lecture updated")
      setEditRow(null)
      void refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const [deleteLecture, { loading: deleting }] = useMutation(DELETE_LECTURE, {
    onCompleted: () => {
      toast.success("Lecture removed")
      setDeleteId(null)
      void refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const [deleteLectureSeries, { loading: deletingSeries }] = useMutation(DELETE_LECTURE_SERIES, {
    onCompleted: () => {
      toast.success("Series deleted")
      setDeleteSeriesId(null)
      void refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const rawRows = data?.getLecturesForStaff ?? []

  const filteredRows = useMemo(() => {
    const from = startOfLocalDay(filterDateFrom)
    const to = endOfLocalDay(filterDateTo)
    return rawRows.filter((row) => {
      if (filterCourseId && String(row.courseId ?? "") !== filterCourseId) return false
      const t = new Date(row.startAt).getTime()
      if (Number.isNaN(t)) return false
      if (from && t < from.getTime()) return false
      if (to && t > to.getTime()) return false
      return true
    })
  }, [rawRows, filterCourseId, filterDateFrom, filterDateTo])

  const rows = useMemo(() => {
    const list = [...filteredRows]
    const cmp = (a: LectureRow, b: LectureRow) => {
      switch (sortKey) {
        case "start_asc":
          return new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        case "start_desc":
          return new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
        case "course_asc": {
          const ca = (a.courseName ?? "").toLowerCase()
          const cb = (b.courseName ?? "").toLowerCase()
          if (ca !== cb) return ca.localeCompare(cb)
          return new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        }
        case "title_asc": {
          const ta = a.title.toLowerCase()
          const tb = b.title.toLowerCase()
          if (ta !== tb) return ta.localeCompare(tb)
          return new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
        }
        default:
          return 0
      }
    }
    list.sort(cmp)
    return list
  }, [filteredRows, sortKey])

  const hasActiveFilters = Boolean(filterCourseId || filterDateFrom || filterDateTo)

  const clearFilters = () => {
    setFilterCourseId("")
    setFilterDateFrom("")
    setFilterDateTo("")
  }

  const openEdit = (row: LectureRow) => {
    setEditRow(row)
    setEditForm({
      title: row.title,
      meetUrl: row.meetUrl ?? "",
      durationMins: row.durationMins,
      startAtLocal: toDatetimeLocalValue(row.startAt),
    })
  }

  const handleCreateSchedule = () => {
    const wds = [...new Set(scheduleForm.selectedWeekdays)].sort((a, b) => a - b)
    if (!scheduleForm.courseId.trim() || !scheduleForm.title.trim() || !scheduleForm.startDate.trim()) {
      toast.error("Course, title, and start date are required")
      return
    }
    if (wds.length === 0) {
      toast.error("Select at least one day of the week")
      return
    }
    if (!scheduleForm.meetUrl.trim()) {
      toast.error("Meeting URL is required")
      return
    }
    const input: Record<string, unknown> = {
      courseId: scheduleForm.courseId,
      title: scheduleForm.title.trim(),
      meetUrl: scheduleForm.meetUrl.trim(),
      durationMins: scheduleForm.durationMins || 60,
      weekdays: wds,
      startDate: scheduleForm.startDate,
      timeOfDay: scheduleForm.timeOfDay.trim(),
    }
    if (scheduleForm.repeatUntil.trim()) {
      input.repeatUntil = scheduleForm.repeatUntil.trim()
    }
    void createSchedule({ variables: { input } })
  }

  const handleSaveEdit = () => {
    if (!editRow) return
    if (!editForm.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!editForm.startAtLocal) {
      toast.error("Start date & time is required")
      return
    }
    if (!editForm.meetUrl.trim()) {
      toast.error("Meeting URL is required")
      return
    }
    void updateLecture({
      variables: {
        id: editRow.id,
        input: {
          title: editForm.title.trim(),
          meetUrl: editForm.meetUrl.trim(),
          durationMins: editForm.durationMins,
          startAt: fromDatetimeLocalValue(editForm.startAtLocal),
        },
      },
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-secondary">{getStaffEyebrow(userProfileInfo?.role)}</div>
          <h1 className="text-2xl font-semibold tracking-tight">Schedule live lectures</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Create weekly recurring sessions on whichever days you select, using your local time ({timezoneLabel}).
            Leave &quot;Repeat until&quot; empty to use each course&apos;s duration. Students get an email about five
            minutes before each session with the meeting link and dashboard URL.
          </p>
        </div>
        <Button type="button" className="shrink-0 gap-2" onClick={() => setCreateOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          New schedule
        </Button>
      </div>

      <Card className="border-(--brand-primary)/20 bg-(--brand-primary)/5">
        <CardContent className="flex gap-3 pt-6 text-sm text-muted-foreground">
          <CalendarClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--brand-primary)" />
          <div>
            <p className="font-medium text-foreground">Your local timezone</p>
            <p>
              Weekdays, dates, and <span className="font-medium">Time (HH:mm)</span> use{" "}
              <span className="font-medium text-foreground">{timezoneLabel}</span>. The server stores them in UTC and
              converts back for each viewer. Editing a single session changes only that occurrence; use &quot;Delete
              series&quot; to remove every session in the same recurring group.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 shrink-0 text-(--brand-primary)" />
            <div>
              <CardTitle>Scheduled sessions</CardTitle>
              {!loading && !error && (
                <p className="text-muted-foreground mt-1 text-sm">
                  Showing <span className="text-foreground font-medium">{rows.length}</span> of{" "}
                  <span className="text-foreground font-medium">{rawRows.length}</span> session{rawRows.length === 1 ? "" : "s"}
                  {hasActiveFilters ? " (filtered)" : ""}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {!loading && !error && rawRows.length > 0 && (
            <div className="border-border bg-muted/30 mb-6 rounded-lg border p-4">
              <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                <FilterIcon className="h-4 w-4" />
                Filters & sorting
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
                <div className="grid min-w-[min(100%,220px)] flex-1 gap-1.5 lg:max-w-md">
                  <span className="text-muted-foreground text-xs font-medium">Course</span>
                  <select
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    value={filterCourseId}
                    onChange={(e) => setFilterCourseId(e.target.value)}
                  >
                    <option value="">All courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="grid min-w-[140px] gap-1.5">
                    <span className="text-muted-foreground text-xs font-medium">From date</span>
                    <Input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="grid min-w-[140px] gap-1.5">
                    <span className="text-muted-foreground text-xs font-medium">To date</span>
                    <Input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="grid min-w-[min(100%,260px)] flex-1 gap-1.5 lg:max-w-xs">
                  <span className="text-muted-foreground text-xs font-medium">Sort by</span>
                  <select
                    className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full shrink-0 lg:w-auto"
                  disabled={!hasActiveFilters}
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                Date range uses your local calendar day (session start must fall on or between the chosen days).
              </p>
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 py-12 text-muted-foreground">
              <Loader2Icon className="h-5 w-5 animate-spin" />
              Loading…
            </div>
          )}
          {error && <p className="text-destructive py-6 text-sm">Failed to load lectures.</p>}
          {!loading && !error && rawRows.length === 0 && (
            <p className="text-muted-foreground py-10 text-center text-sm">No lectures yet. Create a recurring schedule.</p>
          )}
          {!loading && !error && rawRows.length > 0 && rows.length === 0 && (
            <p className="text-muted-foreground py-10 text-center text-sm">
              No sessions match your filters.{" "}
              <button type="button" className="text-(--brand-primary) underline" onClick={clearFilters}>
                Clear filters
              </button>
            </p>
          )}
          {!loading && rows.length > 0 && (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">When</th>
                  <th className="pb-3 pr-4 font-medium">Course</th>
                  <th className="pb-3 pr-4 font-medium">Title</th>
                  <th className="pb-3 pr-4 font-medium">Meet</th>
                  <th className="pb-3 pr-4 font-medium">Series</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border/60">
                    <td className="py-3 pr-4 align-top">
                      <div>{formatSession(row.startAt)}</div>
                      <div className="text-muted-foreground text-xs">{row.durationMins} min</div>
                    </td>
                    <td className="py-3 pr-4 align-top">{row.courseName ?? "—"}</td>
                    <td className="py-3 pr-4 align-top font-medium">{row.title}</td>
                    <td className="py-3 pr-4 align-top">
                      {row.meetUrl ? (
                        <a
                          href={row.meetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-(--brand-primary) inline-flex max-w-[200px] items-center gap-1 truncate underline"
                        >
                          <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                          Open
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 align-top font-mono text-xs text-muted-foreground">
                      {row.seriesId ? `${row.seriesId.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="py-3 align-top text-right">
                      <div className="flex justify-end gap-1">
                        <Button type="button" variant="ghost" size="icon" onClick={() => openEdit(row)} title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        {row.seriesId && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteSeriesId(row.seriesId!)}
                            title="Delete entire series"
                          >
                            <ListXIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(row.id)}
                          title="Delete this session"
                        >
                          <span className="sr-only">Delete session</span>
                          <Trash2Icon className="h-4 w-4 opacity-70" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <DialogPrimitive.Root open={createOpen} onOpenChange={setCreateOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
          <DialogPrimitive.Content
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-[50%] top-[50%] z-50 flex w-[min(32rem,calc(100vw-2rem))] max-h-[min(90vh,52rem)] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden border bg-background shadow-lg duration-200 sm:rounded-lg",
            )}
          >
            <div className="shrink-0 border-b px-6 py-4">
              <DialogPrimitive.Title className="text-lg font-semibold">New recurring schedule</DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
                Sessions repeat on the selected weekdays in {timezoneLabel} until the end date (or the course&apos;s
                default duration). Times are converted to UTC when saved.
              </DialogPrimitive.Description>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Course</span>
                <select
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  value={scheduleForm.courseId}
                  onChange={(e) => setScheduleForm((s) => ({ ...s, courseId: e.target.value }))}
                  disabled={coursesLoading}
                >
                  <option value="">Select course…</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                      {c.courseDurationInMonths != null ? ` (${c.courseDurationInMonths} mo)` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Lecture title</span>
                <Input
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm((s) => ({ ...s, title: e.target.value }))}
                  placeholder="e.g. Live lab — React hooks"
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Meeting URL</span>
                <Input
                  type="url"
                  required
                  value={scheduleForm.meetUrl}
                  onChange={(e) => setScheduleForm((s) => ({ ...s, meetUrl: e.target.value }))}
                  placeholder="https://…"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <span className="text-sm font-medium">Duration (minutes)</span>
                  <Input
                    type="number"
                    min={15}
                    step={5}
                    value={scheduleForm.durationMins}
                    onChange={(e) => setScheduleForm((s) => ({ ...s, durationMins: Number(e.target.value) || 60 }))}
                  />
                </div>
                <div className="grid gap-2">
                  <span className="text-sm font-medium">Time (HH:mm, {timezoneLabel})</span>
                  <Input
                    value={scheduleForm.timeOfDay}
                    onChange={(e) => setScheduleForm((s) => ({ ...s, timeOfDay: e.target.value }))}
                    placeholder="14:00"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Days of the week</span>
                <p className="text-muted-foreground text-xs">Pick any combination; sessions repeat on those days each week in your timezone.</p>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((d) => {
                    const checked = scheduleForm.selectedWeekdays.includes(d.v)
                    return (
                      <label
                        key={d.v}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                          checked ? "border-(--brand-primary) bg-(--brand-primary)/10" : "border-border hover:bg-muted/50",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="accent-(--brand-primary)"
                          checked={checked}
                          onChange={() =>
                            setScheduleForm((s) => ({ ...s, selectedWeekdays: toggleWeekdayInList(s.selectedWeekdays, d.v) }))
                          }
                        />
                        <span>{d.label.slice(0, 3)}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">First week (start date)</span>
                <Input
                  type="date"
                  value={scheduleForm.startDate}
                  onChange={(e) => setScheduleForm((s) => ({ ...s, startDate: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Repeat until (optional)</span>
                <Input
                  type="date"
                  value={scheduleForm.repeatUntil}
                  onChange={(e) => setScheduleForm((s) => ({ ...s, repeatUntil: e.target.value }))}
                />
                <p className="text-muted-foreground text-xs">If empty, the course&apos;s duration in months is used.</p>
              </div>
            </div>
            </div>
            <div className="flex shrink-0 justify-end gap-2 border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="button" disabled={creating} onClick={handleCreateSchedule}>
                {creating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Create schedule"}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <DialogPrimitive.Root open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
          <DialogPrimitive.Content
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-[50%] top-[50%] z-50 flex w-[min(28rem,calc(100vw-2rem))] max-h-[min(90vh,40rem)] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden border bg-background shadow-lg duration-200 sm:rounded-lg",
            )}
          >
            <div className="shrink-0 border-b px-6 py-4">
              <DialogPrimitive.Title className="text-lg font-semibold">Edit lecture</DialogPrimitive.Title>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <span className="text-sm font-medium">Title</span>
                <Input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Meeting URL</span>
                <Input type="url" required value={editForm.meetUrl} onChange={(e) => setEditForm((f) => ({ ...f, meetUrl: e.target.value }))} placeholder="https://…" />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Duration (minutes)</span>
                <Input
                  type="number"
                  min={15}
                  step={5}
                  value={editForm.durationMins}
                  onChange={(e) => setEditForm((f) => ({ ...f, durationMins: Number(e.target.value) || 60 }))}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-sm font-medium">Start ({timezoneLabel})</span>
                <Input
                  type="datetime-local"
                  value={editForm.startAtLocal}
                  onChange={(e) => setEditForm((f) => ({ ...f, startAtLocal: e.target.value }))}
                />
              </div>
            </div>
            </div>
            <div className="flex shrink-0 justify-end gap-2 border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => setEditRow(null)}>
                Cancel
              </Button>
              <Button type="button" disabled={updating} onClick={handleSaveEdit}>
                {updating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this session?"
        description="Only this occurrence will be removed. Other sessions in the series stay scheduled."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleting}
        onOpenChange={(o) => !o && setDeleteId(null)}
        onConfirm={() => deleteId && void deleteLecture({ variables: { id: deleteId } })}
      />

      <ConfirmDialog
        open={!!deleteSeriesId}
        title="Delete entire series?"
        description="All lectures sharing this series id will be removed. This cannot be undone."
        confirmLabel="Delete series"
        variant="destructive"
        loading={deletingSeries}
        onOpenChange={(o) => !o && setDeleteSeriesId(null)}
        onConfirm={() => deleteSeriesId && void deleteLectureSeries({ variables: { seriesId: deleteSeriesId } })}
      />
    </div>
  )
}
