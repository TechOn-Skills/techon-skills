"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarIcon, ClockIcon, PlayIcon, SparklesIcon, TrophyIcon, TargetIcon, ZapIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"

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

  // Fun stats for gamification
  const level = 7 // Demo level
  const xp = 1450 // Demo XP
  const xpForNextLevel = 2000
  const xpProgress = (xp / xpForNextLevel) * 100
  const dailyStreak = 12 // Demo streak

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

          {/* Level & XP Card */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.30),rgba(79,195,232,0.20),transparent_70%)] p-px">
            <div className="bg-background/80 backdrop-blur rounded-3xl px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="size-16 rounded-full bg-linear-to-br from-(--brand-primary) to-(--brand-accent) flex items-center justify-center font-bold text-white text-xl shadow-lg">
                    {level}
                  </div>
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full size-6 flex items-center justify-center animate-pulse">
                    ⚡
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Level {level} Developer</div>
                  <div className="text-sm font-semibold mb-2">{xp} / {xpForNextLevel} XP</div>
                  <div className="w-32 h-2 bg-background/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Streak Banner */}
      <div className="mb-6 rounded-3xl bg-[linear-gradient(135deg,rgba(255,138,61,0.30),rgba(70,208,255,0.15),transparent_70%)] p-px animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-background/80 backdrop-blur rounded-3xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🔥</div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dailyStreak} Day Streak!</div>
              <div className="text-sm text-muted-foreground">Keep the momentum going! You&apos;re on fire! 🚀</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                  i < dailyStreak % 7
                    ? "bg-orange-500 text-white shadow-lg scale-110"
                    : "bg-background/40 text-muted-foreground"
                )}
              >
                {i < dailyStreak % 7 ? "✓" : (i + 1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lectures: 3 timer cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Lectures</h2>
          <span className="text-sm text-muted-foreground">Next 3 classes</span>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {upcoming.map((l, idx) => {
            const startAtMs = now + l.startOffsetSeconds * 1000
            const c = toCountdown(startAtMs)
            const startsAt = new Date(startAtMs)
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

                    <Button asChild variant="brand-secondary" size="lg" shape="pill" className="w-full">
                      <a href={l.meetUrl} target="_blank" rel="noreferrer">
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
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in duration-700">
            <div className="bg-background/70 backdrop-blur rounded-3xl p-6 text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-semibold text-sm">Browse Courses</div>
            </div>
          </button>
          <button className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in duration-700" style={{ animationDelay: "100ms" }}>
            <div className="bg-background/70 backdrop-blur rounded-3xl p-6 text-center">
              <div className="text-3xl mb-2">✍️</div>
              <div className="font-semibold text-sm">Submit Assignment</div>
            </div>
          </button>
          <button className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in duration-700" style={{ animationDelay: "200ms" }}>
            <div className="bg-background/70 backdrop-blur rounded-3xl p-6 text-center">
              <div className="text-3xl mb-2">🎫</div>
              <div className="font-semibold text-sm">Register Event</div>
            </div>
          </button>
          <button className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in duration-700" style={{ animationDelay: "300ms" }}>
            <div className="bg-background/70 backdrop-blur rounded-3xl p-6 text-center">
              <div className="text-3xl mb-2">💬</div>
              <div className="font-semibold text-sm">Get Support</div>
            </div>
          </button>
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
                  Focus on projects that matter. Build things you can show to employers, clients, and the world. Your portfolio is your passport to opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  )
}

