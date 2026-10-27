"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { ConfirmDialog } from "@/lib/ui/useable-components/confirm-dialog"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/lib/ui/useable-components/chart"
import {
  COPY_EXPENSES_FROM_PREVIOUS_MONTH,
  CREATE_EXPENSE,
  DELETE_EXPENSE,
  GET_FINANCE_HISTORY,
  GET_FINANCE_MONTH,
  UPDATE_EXPENSE,
} from "@/lib/graphql"
import { cn, formatDateISO } from "@/lib/helpers"

type ExpenseCategory = "INSTRUCTOR_SALARY" | "MARKETER_SALARY" | "ADS" | "RAILWAY_SERVER" | "GOOGLE_ONE" | "OTHER"

const CATEGORY_LABEL: Record<ExpenseCategory, string> = {
  INSTRUCTOR_SALARY: "Instructor salary",
  MARKETER_SALARY: "Marketer salary",
  ADS: "Ads",
  RAILWAY_SERVER: "Railway server",
  GOOGLE_ONE: "Google One (Meet recordings)",
  OTHER: "Other",
}
const CATEGORIES = Object.keys(CATEGORY_LABEL) as ExpenseCategory[]

type Expense = { id: string; month: string; category: ExpenseCategory; amount: number; note: string }
type FinanceMonth = {
  month: string
  revenue: number
  paymentsCount: number
  studentsPaid: number
  totalExpenses: number
  net: number
  dueThisMonthUnpaid: number
  dueThisMonthUnpaidCount: number
  revenueByCourse: { courseId: string; courseTitle: string; amount: number; students: number }[]
  expensesByCategory: { category: ExpenseCategory; amount: number }[]
  payments: { id: string; studentName: string; courseTitle: string; installmentNumber: number | null; amount: number; paidAt: string }[]
  expenses: Expense[]
}
type HistoryMonth = { month: string; revenue: number; paymentsCount: number; studentsPaid: number; totalExpenses: number; net: number }

const pkr = (n: number) => `PKR ${Math.round(n).toLocaleString()}`

/** Current month in Pakistan time (the API's finance months use the same zone). */
function currentMonth(): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit" }).formatToParts(new Date())
  return `${parts.find((p) => p.type === "year")!.value}-${parts.find((p) => p.type === "month")!.value}`
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number) as [number, number]
  const idx = y * 12 + (m - 1) + delta
  return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, "0")}`
}

function monthLabel(month: string, short = false): string {
  const [y, m] = month.split("-").map(Number) as [number, number]
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: short ? "short" : "long", year: short ? "2-digit" : "numeric" })
}

const historyConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-4)" },
} satisfies ChartConfig

/* ------------------------------------------------------------------ */

function ExpensesCard({ month, data, onChanged }: { month: string; data?: FinanceMonth; onChanged: () => void }) {
  const [category, setCategory] = useState<ExpenseCategory>("INSTRUCTOR_SALARY")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [editing, setEditing] = useState<Expense | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const reset = () => {
    setEditing(null)
    setAmount("")
    setNote("")
  }
  const [create, { loading: creating }] = useMutation(CREATE_EXPENSE, {
    onCompleted: () => { toast.success("Expense added"); reset(); onChanged() },
    onError: (e) => toast.error(e.message),
  })
  const [update, { loading: updating }] = useMutation(UPDATE_EXPENSE, {
    onCompleted: () => { toast.success("Expense updated"); reset(); onChanged() },
    onError: (e) => toast.error(e.message),
  })
  const [remove, { loading: removing }] = useMutation(DELETE_EXPENSE, {
    onCompleted: () => { toast.success("Expense deleted"); setDeleteId(null); onChanged() },
    onError: (e) => toast.error(e.message),
  })
  const [copyPrev, { loading: copying }] = useMutation<{ copyExpensesFromPreviousMonth: number }>(COPY_EXPENSES_FROM_PREVIOUS_MONTH, {
    onCompleted: (d) => {
      const n = d.copyExpensesFromPreviousMonth
      toast.success(n ? `Copied ${n} expense(s) from last month` : "Nothing to copy: last month is empty or already copied")
      onChanged()
    },
    onError: (e) => toast.error(e.message),
  })

  const save = () => {
    const n = Number(amount)
    if (!(n >= 0) || amount.trim() === "") return toast.error("Enter an amount")
    if (category === "OTHER" && !note.trim()) return toast.error("Add a short description for \"Other\"")
    const input = { month, category, amount: Math.round(n), note: note.trim() }
    if (editing) update({ variables: { input: { id: editing.id, ...input } } })
    else create({ variables: { input } })
  }

  const startEdit = (e: Expense) => {
    setEditing(e)
    setCategory(e.category)
    setAmount(String(e.amount))
    setNote(e.note)
  }

  const expenses = data?.expenses ?? []
  return (
    <Card className="rounded-3xl bg-background/70 backdrop-blur">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>Entered manually for {monthLabel(month)}</CardDescription>
        </div>
        <Button variant="outline" size="sm" shape="pill" className="gap-1.5" onClick={() => copyPrev({ variables: { month } })} disabled={copying}>
          {copying ? <Loader2Icon className="size-4 animate-spin" /> : <CopyIcon className="size-4" />}
          Copy last month
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-[1.3fr_1fr]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
            ))}
          </select>
          <Input type="number" min={0} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (PKR)" />
          <Input
            className="sm:col-span-2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={category === "OTHER" ? "What was it for? (required)" : "Note, e.g. instructor name (optional)"}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="brand-secondary" size="sm" shape="pill" className="gap-1.5" onClick={save} disabled={creating || updating}>
            {creating || updating ? <Loader2Icon className="size-4 animate-spin" /> : <PlusIcon className="size-4" />}
            {editing ? "Save changes" : "Add expense"}
          </Button>
          {editing && (
            <Button variant="ghost" size="sm" onClick={reset}>Cancel</Button>
          )}
        </div>

        <div className="divide-y rounded-2xl border">
          {expenses.length === 0 ? (
            <div className="text-muted-foreground p-4 text-sm">No expenses entered for this month yet.</div>
          ) : (
            expenses.map((e) => (
              <div key={e.id} className={cn("flex items-center gap-3 p-3 text-sm", editing?.id === e.id && "bg-(--brand-primary)/5")}>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{CATEGORY_LABEL[e.category]}</div>
                  {e.note && <div className="text-muted-foreground truncate text-xs">{e.note}</div>}
                </div>
                <div className="font-semibold tabular-nums">{pkr(e.amount)}</div>
                <Button variant="ghost" size="icon" aria-label="Edit expense" onClick={() => startEdit(e)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" aria-label="Delete expense" onClick={() => setDeleteId(e.id)}>
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        {expenses.length > 0 && (
          <div className="flex justify-between text-sm font-semibold">
            <span>Total expenses</span>
            <span className="tabular-nums">{pkr(data?.totalExpenses ?? 0)}</span>
          </div>
        )}
      </CardContent>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete expense"
        description="Remove this expense from the month?"
        confirmLabel="Delete"
        variant="destructive"
        loading={removing}
        onConfirm={() => deleteId && remove({ variables: { id: deleteId } })}
      />
    </Card>
  )
}

/* ------------------------------------------------------------------ */

export const AdminFinanceScreen = () => {
  const [thisMonth] = useState(currentMonth)
  const [month, setMonth] = useState(thisMonth)
  const [range, setRange] = useState<6 | 12 | 24>(12)
  const [showPayments, setShowPayments] = useState(false)

  const { data, loading, error, refetch } = useQuery<{ getFinanceMonth: FinanceMonth }>(GET_FINANCE_MONTH, {
    variables: { month },
    fetchPolicy: "network-only",
  })
  const fm = data?.getFinanceMonth

  const historyVars = { fromMonth: shiftMonth(thisMonth, -(range - 1)), toMonth: thisMonth }
  const { data: historyData, loading: historyLoading, refetch: refetchHistory } = useQuery<{ getFinanceHistory: HistoryMonth[] }>(
    GET_FINANCE_HISTORY,
    { variables: historyVars, fetchPolicy: "network-only" }
  )
  const history = historyData?.getFinanceHistory ?? []
  const chartData = history.map((h) => ({ month: monthLabel(h.month, true), revenue: h.revenue, expenses: h.totalExpenses }))
  const totals = history.reduce(
    (acc, h) => ({ revenue: acc.revenue + h.revenue, expenses: acc.expenses + h.totalExpenses, net: acc.net + h.net }),
    { revenue: 0, expenses: 0, net: 0 }
  )

  const refreshAll = () => {
    refetch()
    refetchHistory()
  }

  const tiles = [
    { label: "Revenue", value: fm ? pkr(fm.revenue) : "—", hint: fm ? `${fm.paymentsCount} payment(s) approved` : "" },
    { label: "Students paid", value: fm ? String(fm.studentsPaid) : "—", hint: "distinct students this month" },
    { label: "Expenses", value: fm ? pkr(fm.totalExpenses) : "—", hint: fm ? `${fm.expenses.length} entr${fm.expenses.length === 1 ? "y" : "ies"}` : "" },
    {
      label: "Net profit",
      value: fm ? pkr(fm.net) : "—",
      hint: fm ? (fm.net >= 0 ? "profit" : "loss") : "",
      tone: fm ? (fm.net >= 0 ? "text-green-600" : "text-red-600") : "",
      icon: fm ? (fm.net >= 0 ? TrendingUpIcon : TrendingDownIcon) : null,
    },
    {
      label: "Still unpaid (due this month)",
      value: fm ? pkr(fm.dueThisMonthUnpaid) : "—",
      hint: fm ? `${fm.dueThisMonthUnpaidCount} installment(s)` : "",
      tone: fm && fm.dueThisMonthUnpaid > 0 ? "text-amber-600" : "",
    },
  ]

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-secondary">Admin</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Finance</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Revenue is counted automatically from fee payments, in the month an admin approved them. Add your monthly expenses to see the profit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" shape="pill" aria-label="Previous month" onClick={() => setMonth((m) => shiftMonth(m, -1))}>
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Input type="month" value={month} max={thisMonth} onChange={(e) => e.target.value && setMonth(e.target.value)} className="w-44" />
          <Button variant="outline" size="icon" shape="pill" aria-label="Next month" disabled={month >= thisMonth} onClick={() => setMonth((m) => shiftMonth(m, 1))}>
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error.message}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((t) => (
          <Card key={t.label} className="rounded-3xl bg-background/70 backdrop-blur">
            <CardContent className="p-5">
              <div className="text-muted-foreground text-xs">{t.label}</div>
              <div className={cn("mt-1 flex items-center gap-1.5 text-2xl font-semibold tracking-tight tabular-nums", t.tone)}>
                {loading ? <Loader2Icon className="size-5 animate-spin text-muted-foreground" /> : t.value}
                {!loading && t.icon && <t.icon className="size-5" />}
              </div>
              {t.hint && <div className="text-muted-foreground mt-1 text-xs">{t.hint}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Revenue by course</CardTitle>
            <CardDescription>{monthLabel(month)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(fm?.revenueByCourse ?? []).length === 0 ? (
              <div className="text-muted-foreground text-sm">No approved payments this month.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="py-2 font-semibold">Course</th>
                    <th className="py-2 font-semibold text-right">Students</th>
                    <th className="py-2 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {fm!.revenueByCourse.map((r) => (
                    <tr key={r.courseId} className="border-b last:border-0">
                      <td className="py-2">{r.courseTitle}</td>
                      <td className="py-2 text-right tabular-nums">{r.students}</td>
                      <td className="py-2 text-right font-medium tabular-nums">{pkr(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {fm && fm.payments.length > 0 && (
              <div>
                <button type="button" className="text-(--brand-primary) text-sm font-medium hover:underline" onClick={() => setShowPayments((v) => !v)}>
                  {showPayments ? "Hide" : "Show"} the {fm.payments.length} payment(s)
                </button>
                {showPayments && (
                  <div className="mt-2 max-h-72 divide-y overflow-y-auto rounded-2xl border text-sm">
                    {fm.payments.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-2.5">
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{p.studentName}</div>
                          <div className="text-muted-foreground truncate text-xs">
                            {p.courseTitle}{p.installmentNumber ? ` · installment ${p.installmentNumber}` : ""} · approved {formatDateISO(p.paidAt)}
                          </div>
                        </div>
                        <div className="font-semibold tabular-nums">{pkr(p.amount)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <ExpensesCard month={month} data={fm} onChanged={refreshAll} />
      </div>

      <Card className="rounded-3xl bg-background/70 backdrop-blur">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>History</CardTitle>
            <CardDescription>
              Last {range} months: revenue {pkr(totals.revenue)}, expenses {pkr(totals.expenses)}, net{" "}
              <span className={totals.net >= 0 ? "text-green-600" : "text-red-600"}>{pkr(totals.net)}</span>
            </CardDescription>
          </div>
          <div className="flex rounded-lg border bg-muted-surface/50 p-0.5">
            {([6, 12, 24] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  range === r ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r} months
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {historyLoading ? (
            <div className="text-muted-foreground flex min-h-[200px] items-center justify-center text-sm">Loading…</div>
          ) : (
            <ChartContainer config={historyConfig} className="h-[300px] w-full">
              <BarChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12 }} />
                <YAxis width={64} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))} />
                <Tooltip content={<ChartTooltipContent formatter={(v) => pkr(Number(v))} />} />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="p-2 font-semibold">Month</th>
                  <th className="p-2 font-semibold text-right">Students paid</th>
                  <th className="p-2 font-semibold text-right">Revenue</th>
                  <th className="p-2 font-semibold text-right">Expenses</th>
                  <th className="p-2 font-semibold text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((h) => (
                  <tr
                    key={h.month}
                    className={cn("cursor-pointer border-b last:border-0 hover:bg-muted-surface/30", h.month === month && "bg-(--brand-primary)/5")}
                    onClick={() => setMonth(h.month)}
                  >
                    <td className="p-2 font-medium">{monthLabel(h.month)}</td>
                    <td className="p-2 text-right tabular-nums">{h.studentsPaid}</td>
                    <td className="p-2 text-right tabular-nums">{pkr(h.revenue)}</td>
                    <td className="p-2 text-right tabular-nums">{pkr(h.totalExpenses)}</td>
                    <td className={cn("p-2 text-right font-semibold tabular-nums", h.net >= 0 ? "text-green-600" : "text-red-600")}>{pkr(h.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
