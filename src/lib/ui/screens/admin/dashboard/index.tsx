"use client"

import { useQuery } from "@apollo/client/react"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  DollarSignIcon,
  BookOpenIcon,
  ActivityIcon,
  Loader2Icon,
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
import { GET_ADMIN_DASHBOARD } from "@/lib/graphql"

const activityIconMap: Record<string, typeof CheckCircle2Icon> = {
  enrollment: CheckCircle2Icon,
  payment: DollarSignIcon,
  assignment: BookOpenIcon,
  support: AlertCircleIcon,
}

const activityColorMap: Record<string, string> = {
  enrollment: "text-green-500",
  payment: "text-blue-500",
  assignment: "text-purple-500",
  support: "text-orange-500",
}

export const AdminDashboardScreen = () => {
  const { data, loading, error } = useQuery<{
    getAdminDashboard: {
      recentActivity: Array<{ id: string; type: string; user: string; action: string; time: string }>
      pendingTasks: Array<{ id: string; title: string; priority: string }>
    }
  }>(GET_ADMIN_DASHBOARD)

  type ActivityItem = { id: string; type: string; user: string; action: string; time: string; icon: typeof ActivityIcon; color: string }
  const recentActivity: ActivityItem[] = (data?.getAdminDashboard?.recentActivity ?? []).map((a) => ({
    ...a,
    icon: activityIconMap[a.type] ?? ActivityIcon,
    color: activityColorMap[a.type] ?? "text-muted-foreground",
  }))
  const pendingTasks = data?.getAdminDashboard?.pendingTasks ?? []

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

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      )}
      {error && (
        <div className="py-8 text-center text-muted-foreground">
          <p className="text-destructive">Failed to load dashboard. Please try again.</p>
        </div>
      )}

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
                    key={task.id + idx}
                    className="rounded-2xl border bg-background/40 p-3 transition-all hover:bg-background/60 cursor-pointer animate-in fade-in slide-in-from-right-4 duration-700"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "size-2 rounded-full mt-2 shrink-0",
                        (task as { priority?: string }).priority === "high" ? "bg-red-500" : (task as { priority?: string }).priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{task.title}</div>
                        <div className="text-muted-foreground text-xs mt-0.5 capitalize">{(task as { priority?: string }).priority ?? "low"} priority</div>
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
                {recentActivity.map((activity, idx) => {
                  const Icon = activity.icon
                  return (
                  <div
                    key={activity.id ?? idx}
                    className="flex items-start gap-3 rounded-2xl border bg-background/40 p-3 transition-all hover:bg-background/60 animate-in fade-in slide-in-from-left-4 duration-700"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className={cn("size-8 rounded-xl bg-background/80 flex items-center justify-center shrink-0", activity.color)}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">{activity.time}</div>
                    </div>
                  </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
