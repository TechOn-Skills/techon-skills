"use client"

import * as React from "react"
import { useQuery } from "@apollo/client/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/lib/ui/useable-components/chart"
import { cn } from "@/lib/helpers"
import { GET_ADMIN_DASHBOARD } from "@/lib/graphql"

const CHART_FILLS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

type DashboardData = {
  totalRevenue: number
  totalContactSubmissions: number
  totalRegisteredStudents: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
  monthlyContactSubmissions: Array<{ month: string; count: number }>
  monthlyRegistrations: Array<{ month: string; count: number }>
  monthlyActivity: Array<{ month: string; quizAttempts: number; assignmentSubmissions: number }>
  enrolledPerCourse: Array<{ slug: string; name: string; enrolled: number }>
}

function useDashboardData() {
  return useQuery<{ getAdminDashboard: DashboardData | null }>(GET_ADMIN_DASHBOARD)
}

const revenueConfig = {
  revenue: { label: "Revenue (PKR M)", color: "var(--chart-1)" },
} satisfies ChartConfig

export function AdminRevenueChartCard() {
  const [mode, setMode] = React.useState<"total" | "monthly">("monthly")
  const { data, loading } = useDashboardData()
  const dash = data?.getAdminDashboard
  const chartData = dash?.monthlyRevenue ?? []
  const totalRevenue = dash?.totalRevenue ?? 0

  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Paid fee installments (last 12 months)</CardDescription>
        </div>
        <div className="flex rounded-lg border bg-muted-surface/50 p-0.5">
          {(["total", "monthly"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === m ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "total" ? "Total" : "Monthly"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">Loading…</div>
        ) : mode === "total" ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center">
            <p className="text-4xl font-bold text-(--brand-secondary)">PKR {totalRevenue.toFixed(2)}M</p>
            <p className="text-muted-foreground text-sm">All-time verified payments</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">No payment data yet.</div>
        ) : (
          <ChartContainer config={revenueConfig} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ left: 52, right: 28, top: 20, bottom: 36 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
              <YAxis width={48} tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} tickFormatter={(v) => `PKR ${v}M`} />
              <Tooltip content={<ChartTooltipContent formatter={(v) => `PKR ${Number(v).toFixed(2)}M`} />} />
              <Area type="linear" dataKey="revenue" stroke="var(--color-revenue)" fill="url(#fillRevenue)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

const contactConfig = {
  submissions: { label: "Submissions", color: "var(--chart-2)" },
} satisfies ChartConfig

export function AdminContactSubmissionsChartCard() {
  const [mode, setMode] = React.useState<"total" | "monthly">("monthly")
  const { data, loading } = useDashboardData()
  const dash = data?.getAdminDashboard
  const chartData = dash?.monthlyContactSubmissions ?? []
  const total = dash?.totalContactSubmissions ?? 0

  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>Public contact form (last 12 months)</CardDescription>
        </div>
        <div className="flex rounded-lg border bg-muted-surface/50 p-0.5">
          {(["total", "monthly"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === m ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "total" ? "Total" : "Monthly"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">Loading…</div>
        ) : mode === "total" ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center">
            <p className="text-4xl font-bold text-chart-2">{total.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">All-time submissions</p>
          </div>
        ) : (
          <ChartContainer config={contactConfig} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ left: 44, right: 28, top: 20, bottom: 36 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
              <YAxis width={40} tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="count" fill="var(--color-submissions)" radius={[4, 4, 0, 0]} name="Submissions">
                <LabelList dataKey="count" position="top" className="fill-foreground text-xs font-medium" />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

const activityConfig = {
  quizAttempts: { label: "Quiz attempts", color: "var(--chart-1)" },
  assignmentSubmissions: { label: "Assignment submissions", color: "var(--chart-3)" },
} satisfies ChartConfig

export function AdminLearningActivityCard() {
  const { data, loading } = useDashboardData()
  const chartData = data?.getAdminDashboard?.monthlyActivity ?? []

  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader>
        <CardTitle>Student learning activity</CardTitle>
        <CardDescription>Quiz attempts and assignment submissions (last 12 months)</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">Loading…</div>
        ) : chartData.every((d) => d.quizAttempts === 0 && d.assignmentSubmissions === 0) ? (
          <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">No activity recorded yet.</div>
        ) : (
          <ChartContainer config={activityConfig} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ left: 44, right: 28, top: 20, bottom: 36 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
              <YAxis width={40} tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="quizAttempts" fill="var(--color-quizAttempts)" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="assignmentSubmissions" fill="var(--color-assignmentSubmissions)" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

const registeredConfig = {
  students: { label: "New students", color: "var(--chart-1)" },
} satisfies ChartConfig

export function AdminRegisteredStudentsChartCard() {
  const [mode, setMode] = React.useState<"total" | "monthly">("monthly")
  const { data, loading } = useDashboardData()
  const dash = data?.getAdminDashboard
  const chartData = (dash?.monthlyRegistrations ?? []).map((r) => ({ month: r.month, students: r.count }))
  const total = dash?.totalRegisteredStudents ?? 0

  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>Student accounts created (last 12 months)</CardDescription>
        </div>
        <div className="flex rounded-lg border bg-muted-surface/50 p-0.5">
          {(["total", "monthly"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === m ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "total" ? "Total" : "Monthly"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">Loading…</div>
        ) : mode === "total" ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center">
            <p className="text-4xl font-bold text-chart-1">{total.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">All-time student accounts</p>
          </div>
        ) : (
          <ChartContainer config={registeredConfig} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ left: 44, right: 28, top: 20, bottom: 36 }}>
              <defs>
                <linearGradient id="fillStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
              <YAxis width={40} tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Area type="linear" dataKey="students" stroke="var(--color-students)" fill="url(#fillStudents)" strokeWidth={2}>
                <LabelList dataKey="students" position="top" className="fill-foreground text-xs font-medium" />
              </Area>
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

const enrolledConfig = {
  enrolled: { label: "Enrolled", color: "var(--chart-1)" },
} satisfies ChartConfig

export function AdminEnrolledPerCourseChartCard() {
  const [view, setView] = React.useState<"bar" | "pie">("bar")
  const { data, loading } = useDashboardData()
  const enrolledFromApi = data?.getAdminDashboard?.enrolledPerCourse ?? []
  const chartData = React.useMemo(
    () =>
      enrolledFromApi.map((item, i) => ({
        name: item.name,
        slug: item.slug,
        enrolled: item.enrolled,
        fill: CHART_FILLS[i % CHART_FILLS.length],
      })),
    [enrolledFromApi]
  )

  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Enrolled Students per Course</CardTitle>
          <CardDescription>Current enrollments from student profiles</CardDescription>
        </div>
        <div className="flex rounded-lg border bg-muted-surface/50 p-0.5">
          {(["bar", "pie"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                view === v ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v === "bar" ? "Bar" : "Pie"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">Loading…</div>
        ) : chartData.length === 0 ? (
          <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">No enrollments yet.</div>
        ) : (
          <ChartContainer config={enrolledConfig} className="h-[320px] w-full">
            {view === "bar" ? (
              <BarChart data={chartData} layout="vertical" margin={{ left: 4, right: 36, top: 20, bottom: 28 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tickMargin={10} width={168} tick={{ fontSize: 11 }} />
                <Tooltip content={<ChartTooltipContent />} cursor={false} />
                <Bar dataKey="enrolled" fill="var(--color-enrolled)" radius={[0, 4, 4, 0]} activeBar={false}>
                  <LabelList dataKey="enrolled" position="right" className="fill-foreground text-xs font-medium" />
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Tooltip content={<ChartTooltipContent />} />
                <Pie
                  data={chartData}
                  dataKey="enrolled"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.slug} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

/** @deprecated use AdminLearningActivityCard */
export const AdminActiveStudentsCard = AdminLearningActivityCard
