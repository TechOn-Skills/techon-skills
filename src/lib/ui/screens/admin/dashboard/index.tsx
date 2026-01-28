"use client"

import { useMemo, useState } from "react"
import {
  TrendingUpIcon,
  UsersIcon,
  BookOpenIcon,
  DollarSignIcon,
  CalendarIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ActivityIcon
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"
import type { StatTrend } from "@/utils/types"

export const AdminDashboardScreen = () => {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d")

  const stats = [
    {
      label: "Total Students",
      value: "1,247",
      change: "+12.5%",
      trend: "up" as StatTrend,
      icon: UsersIcon,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Active Courses",
      value: "24",
      change: "+3",
      trend: "up" as StatTrend,
      icon: BookOpenIcon,
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      label: "Revenue (Monthly)",
      value: "PKR 3.1M",
      change: "+8.2%",
      trend: "up" as StatTrend,
      icon: DollarSignIcon,
      color: "text-green-600 dark:text-green-400"
    },
    {
      label: "Completion Rate",
      value: "87%",
      change: "-2.1%",
      trend: "down" as StatTrend,
      icon: TrendingUpIcon,
      color: "text-orange-600 dark:text-orange-400"
    },
  ]

  const recentActivity = [
    { id: 1, type: "enrollment", user: "Ahmad Hassan", action: "enrolled in Web Development", time: "2 minutes ago", icon: CheckCircle2Icon, color: "text-green-500" },
    { id: 2, type: "payment", user: "Fatima Ali", action: "paid February fee (PKR 2,500)", time: "15 minutes ago", icon: DollarSignIcon, color: "text-blue-500" },
    { id: 3, type: "assignment", user: "Muhammad Khan", action: "submitted React assignment", time: "1 hour ago", icon: BookOpenIcon, color: "text-purple-500" },
    { id: 4, type: "support", user: "Sara Ahmed", action: "opened support ticket #247", time: "2 hours ago", icon: AlertCircleIcon, color: "text-orange-500" },
    { id: 5, type: "enrollment", user: "Ali Raza", action: "enrolled in Mobile Development", time: "3 hours ago", icon: CheckCircle2Icon, color: "text-green-500" },
  ]

  const upcomingEvents = [
    { id: 1, title: "React Workshop", date: "Feb 5, 2026", time: "2:00 PM", attendees: 28 },
    { id: 2, title: "Career Webinar", date: "Feb 8, 2026", time: "6:00 PM", attendees: 56 },
    { id: 3, title: "Hackathon", date: "Feb 15, 2026", time: "9:00 AM", attendees: 42 },
  ]

  const coursePerformance = [
    { id: 1, name: "Web Development", students: 487, completion: 89, rating: 4.8 },
    { id: 2, name: "Mobile Development", students: 312, completion: 85, rating: 4.7 },
    { id: 3, name: "Software Engineering", students: 256, completion: 82, rating: 4.9 },
    { id: 4, name: "Ecommerce", students: 192, completion: 91, rating: 4.6 },
  ]

  const pendingTasks = [
    { id: 1, title: "Review 12 pending assignments", priority: "high" as const },
    { id: 2, title: "Process 8 fee verification requests", priority: "high" as const },
    { id: 3, title: "Approve 3 new instructor applications", priority: "medium" as const },
    { id: 4, title: "Update course curriculum for Q2", priority: "medium" as const },
    { id: 5, title: "Review student feedback (45 new)", priority: "low" as const },
  ]

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-secondary">Admin Dashboard</div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, Admin
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
              Here&apos;s what&apos;s happening with your platform today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["7d", "30d", "90d"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  timeframe === tf
                    ? "bg-(--brand-primary) text-(--text-on-dark)"
                    : "bg-background/70 border hover:bg-background/90"
                )}
              >
                {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("size-12 rounded-2xl flex items-center justify-center bg-background/60", stat.color)}>
                    <stat.icon className="size-6" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-semibold",
                    stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-muted-foreground"
                  )}>
                    {stat.trend === "up" ? <ArrowUpIcon className="size-3" /> : stat.trend === "down" ? <ArrowDownIcon className="size-3" /> : null}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-1">{stat.label}</div>
                  <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Course Performance */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>Overview of all active courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coursePerformance.map((course, idx) => (
                    <div
                      key={course.id}
                      className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60 animate-in fade-in slide-in-from-left-4 duration-700"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{course.name}</div>
                          <div className="text-muted-foreground text-xs mt-0.5">{course.students} students enrolled</div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <span className="font-semibold">{course.rating}</span>
                          <span className="text-xs">★</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Completion Rate</span>
                          <span className="font-semibold">{course.completion}%</span>
                        </div>
                        <div className="h-2 bg-background/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-(--brand-primary) to-(--brand-accent) transition-all duration-500"
                            style={{ width: `${course.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pending Tasks */}
        <div>
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingTasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border bg-background/40 p-3 transition-all hover:bg-background/60 cursor-pointer animate-in fade-in slide-in-from-right-4 duration-700"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "size-2 rounded-full mt-2 shrink-0",
                          task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold">{task.title}</div>
                          <div className="text-muted-foreground text-xs mt-0.5 capitalize">{task.priority} priority</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ActivityIcon className="size-5 text-(--brand-accent)" />
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-2xl border bg-background/40 p-3 transition-all hover:bg-background/60 animate-in fade-in slide-in-from-left-4 duration-700"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={cn("size-8 rounded-xl bg-background/80 flex items-center justify-center shrink-0", activity.color)}>
                      <activity.icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-5 text-(--brand-accent)" />
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Next scheduled activities</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60 animate-in fade-in slide-in-from-right-4 duration-700"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold">{event.title}</div>
                      <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <CalendarIcon className="size-3" />
                      {event.date} • {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
