"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { CalendarIcon, ClockIcon, Loader2Icon, PlayIcon, SparklesIcon, TrophyIcon, TargetIcon, ZapIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { CONFIG } from "@/utils/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn, parseDate, formatTime } from "@/lib/helpers"
import { GET_UPCOMING_LECTURES } from "@/lib/graphql"

type LectureApi = {
  id: string
  courseId?: string | null
  courseName?: string | null
  title: string
  meetUrl?: string | null
  durationMins: number
  startAt: string
}

export const StudentMyLecturesScreen = () => {
  const [now, setNow] = useState<number>(() => Date.now())
  const { data, loading, error } = useQuery<{ getUpcomingLectures: LectureApi[] }>(GET_UPCOMING_LECTURES)

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [now])

  const upcoming = useMemo(() => {
    const list = data?.getUpcomingLectures ?? []
    return list.map((l) => ({
      id: l.id,
      course: l.courseName ?? "Course",
      title: l.title,
      meetUrl: l.meetUrl ?? "#",
      durationMins: l.durationMins ?? 60,
      startAt: l.startAt,
    }))
  }, [data?.getUpcomingLectures])

  const toCountdown = (startAtMs: number) => {
    const diff = Math.max(0, startAtMs - now)
    const total = Math.floor(diff / 1000)
    const hrs = Math.floor(total / 3600)
    const mins = Math.floor((total % 3600) / 60)
    const secs = total % 60
    return { hrs, mins, secs, isLive: diff === 0 }
  }


  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm font-semibold text-secondary">My Dashboard</div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Your learning journey
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
              Stay focused, stay consistent. Every lecture brings you closer to mastering your craft and achieving your dreams.
            </p>
          </div>

        </div>

        {/* Lectures: 3 timer cards */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-xl font-semibold">Upcoming Lectures</h2>
            <span className="text-sm text-muted-foreground max-w-md text-right">
              Next scheduled class per course. When a session starts, the following one appears automatically.
            </span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2Icon className="size-6 animate-spin" />
              <span>Loading lectures...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-destructive">Failed to load lectures. Please try again.</p>
            </div>
          ) : upcoming.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground rounded-3xl border border-dashed">
              <p>No upcoming lectures scheduled.</p>
            </div>
          ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((l, idx) => {
              const startAtMs = parseDate(l.startAt)?.getTime() ?? 0
              const c = toCountdown(startAtMs)
              const startsAt = startAtMs ? new Date(startAtMs) : null
              return (
                <div
                  key={l.id}
                  className="group rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.28),rgba(255,138,61,0.14),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
                    <div className="relative h-1.5 w-full bg-[linear-gradient(to_right,rgba(70,208,255,0.75),rgba(255,138,61,0.6))] opacity-70 transition-opacity group-hover:opacity-100" />
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="text-lg">{l.title}</CardTitle>
                          <CardDescription className="text-sm">{l.course ?? "Course"}</CardDescription>
                        </div>
                        <span className="bg-(--brand-secondary) text-(--text-on-dark) inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                          <SparklesIcon className="size-3.5" />
                          Next
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border bg-background/40 p-4">
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <CalendarIcon className="size-4" />
                            Starts at
                          </div>
                          <div className="mt-1 font-semibold">
                            {formatTime(startsAt ?? l.startAt)}
                          </div>
                        </div>
                        <div className="rounded-2xl border bg-background/40 p-4">
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <ClockIcon className="size-4" />
                            Starts in
                          </div>
                          <div className="mt-1 font-semibold">
                            {c.isLive
                              ? "Live now"
                              : `${c.hrs}h ${c.mins}m ${c.secs}s`}
                          </div>
                        </div>
                      </div>

                      <Button asChild variant="brand-secondary" size="lg" shape="pill" className="w-full">
                        <a href={l.meetUrl ?? "#"} target="_blank" rel="noreferrer">
                          <PlayIcon className="size-4" />
                          Join live class
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={CONFIG.ROUTES.PUBLIC.COURSES} className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in duration-700 block">
              <div className="bg-background/70 backdrop-blur rounded-3xl p-6 text-center">
                <div className="text-3xl mb-2">📚</div>
                <div className="font-semibold text-sm">Browse Courses</div>
              </div>
            </Link>
            <Link href={CONFIG.ROUTES.STUDENT.ASSIGNMENTS} className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in duration-700 block" style={{ animationDelay: "100ms" }}>
              <div className="bg-background/70 backdrop-blur rounded-3xl p-6 text-center">
                <div className="text-3xl mb-2">✍️</div>
                <div className="font-semibold text-sm">Submit Assignment</div>
              </div>
            </Link>
            <Link href={CONFIG.ROUTES.STUDENT.EVENTS} className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in duration-700 block" style={{ animationDelay: "200ms" }}>
              <div className="bg-background/70 backdrop-blur rounded-3xl p-6 text-center">
                <div className="text-3xl mb-2">🎫</div>
                <div className="font-semibold text-sm">Register Event</div>
              </div>
            </Link>
            <Link href={CONFIG.ROUTES.STUDENT.SUPPORT} className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in duration-700 block" style={{ animationDelay: "300ms" }}>
              <div className="bg-background/70 backdrop-blur rounded-3xl p-6 text-center">
                <div className="text-3xl mb-2">💬</div>
                <div className="font-semibold text-sm">Get Support</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Your Success Mindset</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: "400ms" }}>
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                <CardContent className="p-6 text-center">
                  <div className="bg-(--brand-primary) text-(--text-on-dark) size-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrophyIcon className="size-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Stay Consistent</h3>
                  <p className="text-muted-foreground text-sm leading-7">
                    Success in tech isn&apos;t about being perfect—it&apos;s about showing up every day and putting in the work. Your future self will thank you.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "500ms" }}>
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                <CardContent className="p-6 text-center">
                  <div className="bg-(--brand-accent) text-(--text-on-dark) size-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TargetIcon className="size-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Focus on Growth</h3>
                  <p className="text-muted-foreground text-sm leading-7">
                    Every challenge you overcome, every concept you master, adds to your skillset. Embrace the learning process and celebrate small wins.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px animate-in fade-in slide-in-from-right-4 duration-700" style={{ animationDelay: "600ms" }}>
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                <CardContent className="p-6 text-center">
                  <div className="bg-(--brand-secondary) text-(--text-on-dark) size-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ZapIcon className="size-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Build Real Skills</h3>
                  <p className="text-muted-foreground text-sm leading-7">
                    Focus on projects that matter. Build things you can show to employers, clients, and the world.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

