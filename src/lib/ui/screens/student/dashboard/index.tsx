"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import {
  AwardIcon,
  BookOpenIcon,
  CalendarIcon,
  ClipboardListIcon,
  ClockIcon,
  ListTodoIcon,
  Loader2Icon,
  PlayIcon,
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { CONFIG } from "@/utils/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { ProgressRing } from "@/lib/ui/useable-components/progress-ring"
import { cn, parseDate, formatTime } from "@/lib/helpers"
import { GET_MY_PROGRESS, GET_UPCOMING_LECTURES } from "@/lib/graphql"
import { useUser } from "@/lib/providers/user"

type LectureApi = {
  id: string
  courseName?: string | null
  title: string
  meetUrl?: string | null
  durationMins: number
  startAt: string
}

export const StudentMyLecturesScreen = () => {
  const [now, setNow] = useState<number>(() => Date.now())
  const { userProfileInfo } = useUser()
  const { data: lectureData, loading: loadingLectures, error: lectureError } = useQuery<{
    getUpcomingLectures: LectureApi[]
  }>(GET_UPCOMING_LECTURES)
  const { data: progressData, loading: loadingProgress } = useQuery<{
    getMyProgress: {
      enrolledCoursesCount: number
      publishedQuizzesTotal: number
      quizzesAttempted: number
      quizzesPassed: number
      publishedAssignmentsTotal: number
      assignmentsSubmitted: number
      assignmentsGraded: number
      assignmentsPendingReview: number
      averageMarksPercent: number | null
      courses: Array<{
        courseId: string
        courseTitle: string
        courseSlug: string
        progressPercent: number
        quizzesTotal: number
        quizzesAttempted: number
        assignmentsTotal: number
        assignmentsSubmitted: number
        assignmentsPendingReview: number
      }>
    }
  }>(GET_MY_PROGRESS, { skip: !userProfileInfo?.id, fetchPolicy: "network-only" })

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const progress = progressData?.getMyProgress
  const overallPercent = useMemo(() => {
    if (!progress?.courses.length) return 0
    const sum = progress.courses.reduce((a, c) => a + c.progressPercent, 0)
    return Math.round(sum / progress.courses.length)
  }, [progress?.courses])

  const upcoming = useMemo(() => {
    const list = lectureData?.getUpcomingLectures ?? []
    return list.map((l) => ({
      id: l.id,
      course: l.courseName ?? "Course",
      title: l.title,
      meetUrl: l.meetUrl,
      durationMins: l.durationMins ?? 60,
      startAt: l.startAt,
    }))
  }, [lectureData?.getUpcomingLectures])

  const toCountdown = (startAtMs: number) => {
    const diff = Math.max(0, startAtMs - now)
    const total = Math.floor(diff / 1000)
    const hrs = Math.floor(total / 3600)
    const mins = Math.floor((total % 3600) / 60)
    const secs = total % 60
    return { hrs, mins, secs, isLive: diff === 0 }
  }

  const firstName = userProfileInfo?.fullName?.split(" ")[0] ?? "Student"

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">My Dashboard</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Your real progress across quizzes and assignments — updated from your actual submissions and attempts.
        </p>
      </div>

      {loadingProgress ? (
        <div className="mb-8 flex items-center gap-2 text-muted-foreground">
          <Loader2Icon className="size-5 animate-spin" />
          Loading progress…
        </div>
      ) : progress ? (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardDescription>Overall progress</CardDescription>
                <div className="flex items-center gap-3">
                  <ProgressRing value={overallPercent} size={56} strokeWidth={4}>
                    <span className="text-sm font-bold">{overallPercent}%</span>
                  </ProgressRing>
                  <CardTitle className="text-2xl">{overallPercent}%</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs">
                {progress.enrolledCoursesCount} enrolled course{progress.enrolledCoursesCount !== 1 ? "s" : ""}
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <ClipboardListIcon className="size-3.5" /> Quizzes
                </CardDescription>
                <CardTitle className="text-2xl">
                  {progress.quizzesAttempted}/{progress.publishedQuizzesTotal}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs">
                {progress.quizzesPassed} passed · instant results on submit
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <ListTodoIcon className="size-3.5" /> Assignments
                </CardDescription>
                <CardTitle className="text-2xl">
                  {progress.assignmentsSubmitted}/{progress.publishedAssignmentsTotal}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs">
                {progress.assignmentsPendingReview} pending review · {progress.assignmentsGraded} graded
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <AwardIcon className="size-3.5" /> Average score
                </CardDescription>
                <CardTitle className="text-2xl">
                  {progress.averageMarksPercent != null ? `${progress.averageMarksPercent}%` : "—"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xs">From graded quizzes &amp; assignments</CardContent>
            </Card>
          </div>

          {progress.courses.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Progress by course</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {progress.courses.map((c) => (
                  <Link key={c.courseId} href={`/student/course/${c.courseSlug}`}>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                          <CardTitle className="text-base">{c.courseTitle}</CardTitle>
                          <CardDescription className="text-xs">
                            Quizzes {c.quizzesAttempted}/{c.quizzesTotal} · Assignments {c.assignmentsSubmitted}/
                            {c.assignmentsTotal}
                            {c.assignmentsPendingReview > 0 ? ` · ${c.assignmentsPendingReview} pending` : ""}
                          </CardDescription>
                        </div>
                        <ProgressRing value={c.progressPercent} size={44} strokeWidth={3}>
                          <span className="text-[10px] font-bold">{c.progressPercent}%</span>
                        </ProgressRing>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={CONFIG.ROUTES.STUDENT.QUIZZES} className="rounded-2xl border p-4 transition-all hover:shadow-md">
          <ClipboardListIcon className="text-(--brand-secondary) mb-2 size-5" />
          <div className="font-semibold text-sm">My Quizzes</div>
        </Link>
        <Link href={CONFIG.ROUTES.STUDENT.ASSIGNMENTS} className="rounded-2xl border p-4 transition-all hover:shadow-md">
          <ListTodoIcon className="text-(--brand-secondary) mb-2 size-5" />
          <div className="font-semibold text-sm">My Assignments</div>
        </Link>
        <Link href={CONFIG.ROUTES.STUDENT.MARKS} className="rounded-2xl border p-4 transition-all hover:shadow-md">
          <AwardIcon className="text-(--brand-secondary) mb-2 size-5" />
          <div className="font-semibold text-sm">My Marks</div>
        </Link>
        <Link href={CONFIG.ROUTES.STUDENT.MY_ENROLLED_COURSES} className="rounded-2xl border p-4 transition-all hover:shadow-md">
          <BookOpenIcon className="text-(--brand-secondary) mb-2 size-5" />
          <div className="font-semibold text-sm">My Courses</div>
        </Link>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Upcoming lectures</h2>
          <span className="text-muted-foreground max-w-md text-right text-sm">Next scheduled class per enrolled course</span>
        </div>
        {loadingLectures ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2Icon className="size-6 animate-spin" />
            Loading lectures…
          </div>
        ) : lectureError ? (
          <div className="py-12 text-center text-destructive">Failed to load lectures.</div>
        ) : upcoming.length === 0 ? (
          <div className="text-muted-foreground rounded-3xl border border-dashed py-12 text-center">No upcoming lectures scheduled.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((l) => {
              const startAtMs = parseDate(l.startAt)?.getTime() ?? 0
              const c = toCountdown(startAtMs)
              const startsAt = startAtMs ? new Date(startAtMs) : null
              const canJoin = Boolean(l.meetUrl)
              return (
                <Card key={l.id} className="rounded-3xl">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-lg">{l.title}</CardTitle>
                    <CardDescription>{l.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border p-3 text-sm">
                        <div className="text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="size-3.5" /> Starts
                        </div>
                        <div className="mt-1 font-semibold">{formatTime(startsAt ?? l.startAt).split(":").slice(0, 2).join(":")}</div>
                      </div>
                      <div className="rounded-xl border p-3 text-sm">
                        <div className="text-muted-foreground flex items-center gap-1">
                          <ClockIcon className="size-3.5" /> Countdown
                        </div>
                        <div className="mt-1 font-semibold">
                          {c.isLive ? "Live now" : `${c.hrs}h ${c.mins}m ${c.secs}s`}
                        </div>
                      </div>
                    </div>
                    {canJoin ? (
                      <Button asChild variant="brand-secondary" shape="pill" className="w-full">
                        <a href={l.meetUrl!} target="_blank" rel="noreferrer">
                          <PlayIcon className="size-4" />
                          Join live class
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" shape="pill" className="w-full" disabled>
                        Meet link not set yet
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
