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
import { COURSE_SLUG_TO_TITLE } from "@/utils/constants"

const CHART_FILLS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

// Mock data generators (replace with API later)
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function useMonthlyRevenue() {
  return React.useMemo(
    () =>
      MONTHS.map((month, i) => ({
        month,
        revenue: 2.1 + Math.sin(i / 2) * 0.8 + (i * 0.05),
        total: 24.5,
      })),
    []
  )
}

function useMonthlyContactSubmissions() {
  return React.useMemo(
    () =>
      MONTHS.map((month, i) => ({
        month,
        submissions: 12 + Math.floor(Math.random() * 20) + i * 2,
        total: 248,
      })),
    []
  )
}

function useMonthlyRegistrations() {
  return React.useMemo(
    () =>
      MONTHS.map((month, i) => ({
        month,
        students: 45 + Math.floor(Math.random() * 30) + i * 3,
        total: 1247,
      })),
    []
  )
}

// Active students by segment (stacked expanded = % of total per month)
function useActiveStudentsStacked() {
  return React.useMemo(
    () =>
      MONTHS.map((month, i) => {
        const web = 35 + (i % 5) * 2
        const mobile = 28 + (i % 4)
        const fullStack = 22 + (i % 3)
        const other = 100 - web - mobile - fullStack
        return {
          month,
          web: Math.max(5, web),
          mobile: Math.max(5, mobile),
          fullStack: Math.max(5, fullStack),
          other: Math.max(5, other),
        }
      }).map((row) => {
        const total = row.web + row.mobile + row.fullStack + row.other
        return {
          month: row.month,
          web: Math.round((row.web / total) * 100),
          mobile: Math.round((row.mobile / total) * 100),
          fullStack: Math.round((row.fullStack / total) * 100),
          other: Math.round((row.other / total) * 100),
        }
      }),
    []
  )
}

const COURSE_OPTIONS = Object.entries(COURSE_SLUG_TO_TITLE).map(([slug, title]) => ({ slug, title }))

// --- Revenue: Area Chart - Linear ---
const revenueConfig = {
  revenue: { label: "Revenue (PKR M)", color: "var(--chart-1)" },
  total: { label: "Total", color: "var(--chart-2)" },
} satisfies ChartConfig

export function AdminRevenueChartCard() {
  const [mode, setMode] = React.useState<"total" | "monthly">("monthly")
  const data = useMonthlyRevenue()
  const totalRevenue = 24.5

  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Total and monthly revenue (area chart)</CardDescription>
        </div>
        <div className="flex rounded-lg border bg-muted/50 p-0.5">
          {(["total", "monthly"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === m ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "total" ? "Total Revenue" : "Monthly Revenue"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {mode === "total" ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center">
            <p className="text-4xl font-bold text-(--brand-secondary)">PKR {totalRevenue}M</p>
            <p className="text-muted-foreground text-sm">All-time total revenue</p>
          </div>
        ) : (
          <ChartContainer config={revenueConfig} className="h-[300px] w-full">
            <AreaChart data={data} margin={{ left: 52, right: 28, top: 20, bottom: 36 }}>
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

// --- Contact Form Submissions Chart Card ---
const contactConfig = {
  submissions: { label: "Submissions", color: "var(--chart-2)" },
  total: { label: "Total", color: "var(--chart-1)" },
} satisfies ChartConfig

export function AdminContactSubmissionsChartCard() {
  const [mode, setMode] = React.useState<"total" | "monthly">("monthly")
  const data = useMonthlyContactSubmissions()
  const total = 248

  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Contact Form Submissions</CardTitle>
          <CardDescription>Total and monthly submissions</CardDescription>
        </div>
        <div className="flex rounded-lg border bg-muted/50 p-0.5">
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
        {mode === "total" ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center">
            <p className="text-4xl font-bold text-chart-2">{total}</p>
            <p className="text-muted-foreground text-sm">All-time submissions</p>
          </div>
        ) : (
          <ChartContainer config={contactConfig} className="h-[300px] w-full">
            <BarChart data={data} margin={{ left: 44, right: 28, top: 20, bottom: 36 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
              <YAxis width={40} tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
              <Tooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="submissions" fill="var(--color-submissions)" radius={[4, 4, 0, 0]} activeBar={false}>
                <LabelList dataKey="submissions" position="top" className="fill-foreground text-xs font-medium" />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

// --- Active Students: Area Chart - Stacked Expanded (% by segment) ---
const activeStackedConfig = {
  web: { label: "Web Dev", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
  fullStack: { label: "Full Stack", color: "var(--chart-3)" },
  other: { label: "Other", color: "var(--chart-4)" },
} satisfies ChartConfig

export function AdminActiveStudentsCard() {
  const data = useActiveStudentsStacked()
  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader>
        <CardTitle>Active Students</CardTitle>
        <CardDescription>Stacked expanded view — share by course segment (%)</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={activeStackedConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ left: 44, right: 28, top: 20, bottom: 36 }}>
            <defs>
              <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillFullStack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOther" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} width={40} tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<ChartTooltipContent formatter={(v) => `${Number(v)}%`} />} />
            <Area type="linear" dataKey="web" stackId="1" stroke="var(--color-web)" fill="url(#fillWeb)" strokeWidth={1} />
            <Area type="linear" dataKey="mobile" stackId="1" stroke="var(--color-mobile)" fill="url(#fillMobile)" strokeWidth={1} />
            <Area type="linear" dataKey="fullStack" stackId="1" stroke="var(--color-fullStack)" fill="url(#fillFullStack)" strokeWidth={1} />
            <Area type="linear" dataKey="other" stackId="1" stroke="var(--color-other)" fill="url(#fillOther)" strokeWidth={1} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// --- Registered Students Chart Card ---
const registeredConfig = {
  students: { label: "Registered", color: "var(--chart-1)" },
  total: { label: "Total", color: "var(--chart-2)" },
} satisfies ChartConfig

export function AdminRegisteredStudentsChartCard() {
  const [mode, setMode] = React.useState<"total" | "monthly">("monthly")
  const data = useMonthlyRegistrations()
  const total = 1247

  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>Total and monthly new registrations</CardDescription>
        </div>
        <div className="flex rounded-lg border bg-muted/50 p-0.5">
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
        {mode === "total" ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center">
            <p className="text-4xl font-bold text-chart-1">{total.toLocaleString()}</p>
            <p className="text-muted-foreground text-sm">All-time registered</p>
          </div>
        ) : (
          <ChartContainer config={registeredConfig} className="h-[300px] w-full">
            <AreaChart data={data} margin={{ left: 44, right: 28, top: 20, bottom: 36 }}>
              <defs>
                <linearGradient id="fillStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
              <YAxis width={40} tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
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

// --- Enrolled per Course (Bar or Pie, toggle course) ---
const enrolledConfig = {
  enrolled: { label: "Enrolled", color: "var(--chart-1)" },
} satisfies ChartConfig

export function AdminEnrolledPerCourseChartCard() {
  const [view, setView] = React.useState<"bar" | "pie">("bar")
  const { data: dashboardData } = useQuery<{
    getAdminDashboard?: { enrolledPerCourse: Array<{ slug: string; name: string; enrolled: number }> }
  }>(GET_ADMIN_DASHBOARD)
  const enrolledFromApi = dashboardData?.getAdminDashboard?.enrolledPerCourse ?? []
  const data = React.useMemo(
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
          <CardDescription>Toggle chart type to compare courses</CardDescription>
        </div>
        <div className="flex rounded-lg border bg-muted/50 p-0.5">
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
        <ChartContainer config={enrolledConfig} className="h-[320px] w-full">
          {view === "bar" ? (
            <BarChart data={data} layout="vertical" margin={{ left: 4, right: 36, top: 20, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
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
                data={data}
                dataKey="enrolled"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.slug} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
