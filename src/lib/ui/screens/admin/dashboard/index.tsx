"use client"

import {
  AlertCircleIcon,
  CheckCircle2Icon,
  DollarSignIcon,
  BookOpenIcon,
  ActivityIcon,
} from "lucide-react"

import {
  AdminRevenueChartCard,
  AdminContactSubmissionsChartCard,
  AdminActiveStudentsCard,
  AdminRegisteredStudentsChartCard,
  AdminEnrolledPerCourseChartCard,
} from "@/lib/ui/useable-components/admin-dashboard-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"

export const AdminDashboardScreen = () => {
  const recentActivity = [
    { id: 1, type: "enrollment", user: "Ahmad Hassan", action: "enrolled in Web Development", time: "2 minutes ago", icon: CheckCircle2Icon, color: "text-green-500" },
    { id: 2, type: "payment", user: "Fatima Ali", action: "paid February fee (PKR 2,500)", time: "15 minutes ago", icon: DollarSignIcon, color: "text-blue-500" },
    { id: 3, type: "assignment", user: "Muhammad Khan", action: "submitted React assignment", time: "1 hour ago", icon: BookOpenIcon, color: "text-purple-500" },
    { id: 4, type: "support", user: "Sara Ahmed", action: "opened support ticket #247", time: "2 hours ago", icon: AlertCircleIcon, color: "text-orange-500" },
    { id: 5, type: "enrollment", user: "Ali Raza", action: "enrolled in Mobile Development", time: "3 hours ago", icon: CheckCircle2Icon, color: "text-green-500" },
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
        <div className="text-sm font-semibold text-secondary">Admin Dashboard</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back, Admin
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <AdminRevenueChartCard />
        <AdminContactSubmissionsChartCard />
      </div>
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <AdminActiveStudentsCard />
        <AdminRegisteredStudentsChartCard />
      </div>
      <div className="mb-8">
        <AdminEnrolledPerCourseChartCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Pending Tasks */}
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
      </div>
    </div>
  )
}
