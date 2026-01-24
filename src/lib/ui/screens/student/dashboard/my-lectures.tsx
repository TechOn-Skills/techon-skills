"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  CalendarIcon,
  ClockIcon,
  ExternalLinkIcon,
  PlayIcon,
  SparklesIcon,
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { CONFIG } from "@/utils/constants"

type Lecture = {
  id: string
  course: string
  title: string
  meetUrl: string
  durationMins: number
  startOffsetSeconds: number // demo offset from "now"
}

const LECTURES: Lecture[] = [
  {
    id: "l-1",
    course: "Web Development",
    title: "React Components & Props",
    meetUrl: "https://meet.google.com/xxx-yyyy-zzz",
    durationMins: 60,
    startOffsetSeconds: 2 * 60 * 60 + 15 * 60, // 2h 15m
  },
  {
    id: "l-2",
    course: "Mobile App Development",
    title: "Navigation + Screens Flow",
    meetUrl: "https://meet.google.com/aaa-bbbb-ccc",
    durationMins: 60,
    startOffsetSeconds: 5 * 60 * 60 + 30 * 60, // 5h 30m
  },
  {
    id: "l-3",
    course: "Software Engineering",
    title: "Git Workflow (Branching)",
    meetUrl: "https://meet.google.com/ddd-eeee-fff",
    durationMins: 60,
    startOffsetSeconds: 24 * 60 * 60 + 10 * 60, // tomorrow + 10m
  },
  {
    id: "l-4",
    course: "Web Development",
    title: "State Management Basics",
    meetUrl: "https://meet.google.com/ggg-hhhh-iii",
    durationMins: 60,
    startOffsetSeconds: 48 * 60 * 60 + 30 * 60,
  },
  {
    id: "l-5",
    course: "Software Engineering",
    title: "API Design: REST vs GraphQL",
    meetUrl: "https://meet.google.com/jjj-kkkk-lll",
    durationMins: 60,
    startOffsetSeconds: 72 * 60 * 60 + 20 * 60,
  },
]

export const StudentMyLecturesScreen = () => {
  // Demo schedule: timers computed from "now" + offsets
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const upcoming = useMemo(() => LECTURES.slice(0, 3), [])

  const toCountdown = (startAtMs: number) => {
    const diff = Math.max(0, startAtMs - now)
    const total = Math.floor(diff / 1000)
    const hrs = Math.floor(total / 3600)
    const mins = Math.floor((total % 3600) / 60)
    const secs = total % 60
    return { hrs, mins, secs, isLive: diff === 0 }
  }

  return (
    <div className="w-full py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">My Lectures</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Your scheduled classes
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          This is your dashboard home. Once enrolled, your lecture schedule and course access will appear here.
        </p>
      </div>

      {/* Top: 3 timer cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {upcoming.map((l, idx) => {
          const startAtMs = now + l.startOffsetSeconds * 1000
          const c = toCountdown(startAtMs)
          const startsAt = new Date(startAtMs)
          return (
            <div
              key={l.id}
              className="group rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.28),rgba(255,138,61,0.14),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
                <div className="relative h-1.5 w-full bg-[linear-gradient(to_right,rgba(70,208,255,0.75),rgba(255,138,61,0.6))] opacity-70 transition-opacity group-hover:opacity-100" />
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-lg">{l.title}</CardTitle>
                      <CardDescription className="text-sm">{l.course}</CardDescription>
                    </div>
                    <span className="bg-(--brand-secondary) text-(--text-on-dark) inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                      <SparklesIcon className="size-3.5" />
                      #{idx + 1}
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
                      <div className="mt-1 font-semibold">{startsAt.toLocaleTimeString()}</div>
                    </div>
                    <div className="rounded-2xl border bg-background/40 p-4">
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <ClockIcon className="size-4" />
                        Starts in
                      </div>
                      <div className="mt-1 font-semibold">
                        {c.isLive ? "Live now" : `${c.hrs}h ${c.mins}m ${c.secs}s`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="brand-secondary" size="lg" shape="pill" className="w-fit">
                      <a href={l.meetUrl} target="_blank" rel="noreferrer">
                        <PlayIcon className="size-4" />
                        Join live class
                      </a>
                    </Button>
                    <Button asChild variant="ghost" shape="pill" className="w-fit">
                      <Link href={CONFIG.ROUTES.STUDENT.COURSES}>
                        Open course
                        <ExternalLinkIcon className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

    </div>
  )
}

