"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Loader2Icon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon, WalletIcon, XIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { ConfirmDialog } from "@/lib/ui/useable-components/confirm-dialog"
import {
  ADD_STUDENT_INSTALLMENT,
  GET_STUDENT_FEES,
  GET_USERS,
  REMOVE_STUDENT_INSTALLMENT,
  SET_STUDENT_FEE_PLAN,
  UPDATE_STUDENT_INSTALLMENT,
} from "@/lib/graphql"
import { cn, formatDateISO } from "@/lib/helpers"

type Installment = {
  id: string
  amount: number
  paymentDate: string
  paymentStatus: string
  paymentAttachment: string
  isPaid: boolean
  paidAt: string | null
  note: string | null
  courseDetails?: { installmentNumber: number } | null
}

type CourseFee = {
  courseId: string
  courseTitle: string
  currency: string
  planType: "FULL" | "TWO_INSTALLMENTS" | "CUSTOM" | "LEGACY_MONTHLY"
  courseFee: number
  agreedFee: number
  discount: number
  discountNote: string
  totalPaid: number
  outstanding: number
  overdue: number
  installments: Installment[]
}

type StudentRow = { id: string; email: string; fullName?: string | null; role: string; status: string }

const PLAN_LABEL: Record<CourseFee["planType"], string> = {
  FULL: "Full payment",
  TWO_INSTALLMENTS: "2 installments",
  CUSTOM: "Custom installments",
  LEGACY_MONTHLY: "Old monthly plan",
}

const money = (n: number, currency = "PKR") => `${currency} ${Math.round(n).toLocaleString()}`
const ymd = (iso: string) => (iso ? iso.slice(0, 10) : "")

function hasPendingProof(i: Installment) {
  const att = (i.paymentAttachment ?? "").trim().toLowerCase()
  return !i.isPaid && i.paymentStatus === "PENDING" && att !== "" && att !== "pending"
}

function installmentStatus(i: Installment): { label: string; className: string } {
  if (i.isPaid) return { label: `Paid${i.paidAt ? ` ${formatDateISO(i.paidAt)}` : ""}`, className: "bg-green-500/15 text-green-600" }
  if (hasPendingProof(i)) return { label: "Proof waiting for approval", className: "bg-amber-500/15 text-amber-600" }
  if (i.paymentStatus === "REJECTED") return { label: "Proof rejected", className: "bg-red-500/15 text-red-600" }
  if (new Date(i.paymentDate) <= new Date()) return { label: "Overdue", className: "bg-red-500/15 text-red-600" }
  return { label: "Upcoming", className: "bg-slate-500/10 text-slate-600" }
}

const dialogContentClass =
  "fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border bg-background p-6 shadow-xl outline-none"
const overlayClass = "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"

/* ------------------------------------------------------------------ */

function StudentPicker({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const { data, loading } = useQuery<{ getUsers: StudentRow[] }>(GET_USERS, { variables: { includeDeleted: false } })
  const students = useMemo(() => (data?.getUsers ?? []).filter((u) => u.role === "STUDENT"), [data])
  const selected = students.find((s) => s.id === value)
  const matches = useMemo(() => {
    const q = search.trim().toLowerCase()
    return students
      .filter((s) => !q || s.email.toLowerCase().includes(q) || (s.fullName ?? "").toLowerCase().includes(q))
      .slice(0, 8)
  }, [students, search])

  if (selected) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-background/70 px-4 py-3">
        <div>
          <div className="font-semibold">{selected.fullName || selected.email}</div>
          <div className="text-muted-foreground text-xs">{selected.email}</div>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto gap-1" onClick={() => onChange(null)}>
          <XIcon className="size-4" />
          Change student
        </Button>
      </div>
    )
  }

  return (
    <div className="relative max-w-xl">
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={loading ? "Loading students..." : "Search a student by name or email"}
        className="pl-10"
      />
      {open && matches.length > 0 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border bg-background shadow-xl">
          {matches.map((s) => (
            <button
              key={s.id}
              type="button"
              className="block w-full px-4 py-2 text-left text-sm hover:bg-muted-surface/50"
              onClick={() => { onChange(s.id); setOpen(false); setSearch("") }}
            >
              <span className="font-medium">{s.fullName || s.email}</span>
              <span className="text-muted-foreground ml-2 text-xs">{s.email}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

type CustomRow = { amount: string; dueDate: string; note: string }

/** Mounted per course (keyed by the parent), so state is initialised from `fee` once. */
function PlanDialog({ userId, fee, onClose, onSaved }: { userId: string; fee: CourseFee; onClose: () => void; onSaved: () => void }) {
  const unpaid = fee.installments.filter((i) => !i.isPaid)
  const [planType, setPlanType] = useState<"FULL" | "TWO_INSTALLMENTS" | "CUSTOM">(
    fee.planType === "FULL" || fee.planType === "CUSTOM" ? fee.planType : "TWO_INSTALLMENTS"
  )
  const [agreedFee, setAgreedFee] = useState(String(fee.agreedFee || fee.courseFee || ""))
  const [discountNote, setDiscountNote] = useState(fee.discountNote ?? "")
  const [firstDue, setFirstDue] = useState(ymd(unpaid[0]?.paymentDate ?? ""))
  const [secondDue, setSecondDue] = useState(ymd(unpaid[1]?.paymentDate ?? ""))
  const [rows, setRows] = useState<CustomRow[]>(() =>
    unpaid.map((i) => ({ amount: String(i.amount), dueDate: ymd(i.paymentDate), note: i.note ?? "" }))
  )

  const [savePlan, { loading }] = useMutation(SET_STUDENT_FEE_PLAN, {
    onCompleted: () => { toast.success("Fee plan saved"); onSaved(); onClose() },
    onError: (e) => toast.error(e.message),
  })

  const paid = fee.totalPaid
  const paidCount = fee.installments.filter((i) => i.isPaid).length
  const customSum = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0)
  const agreed = Number(agreedFee) || 0

  const save = () => {
    const plan: Record<string, unknown> = { planType, discountNote: discountNote.trim() }
    if (planType === "CUSTOM") {
      if (!rows.length) return toast.error("Add at least one installment")
      if (rows.some((r) => !(Number(r.amount) > 0) || !r.dueDate)) return toast.error("Every installment needs an amount and a due date")
      plan.installments = rows.map((r) => ({ amount: Math.round(Number(r.amount)), dueDate: r.dueDate, note: r.note.trim() || undefined }))
    } else {
      if (!Number.isInteger(agreed) || agreed < 0) return toast.error("Agreed fee must be a whole number")
      plan.agreedFee = agreed
      if (firstDue) plan.firstDueDate = firstDue
      if (planType === "TWO_INSTALLMENTS" && secondDue) plan.secondDueDate = secondDue
    }
    savePlan({ variables: { input: { userId, courseId: fee.courseId, plan } } })
  }

  const remaining = agreed - paid
  return (
    <DialogPrimitive.Root open onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayClass} />
        <DialogPrimitive.Content className={dialogContentClass}>
          <DialogPrimitive.Title className="text-lg font-semibold">Fee plan · {fee.courseTitle}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
            Course fee {money(fee.courseFee, fee.currency)}. {paid > 0 ? `${money(paid, fee.currency)} already paid is kept; ` : ""}
            unpaid installments are replaced by the new plan.
          </DialogPrimitive.Description>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {(["TWO_INSTALLMENTS", "FULL", "CUSTOM"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlanType(p)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                  planType === p ? "border-(--brand-primary) bg-(--brand-primary)/10" : "hover:bg-muted-surface/50"
                )}
              >
                {PLAN_LABEL[p]}
              </button>
            ))}
          </div>

          {planType !== "CUSTOM" ? (
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Agreed fee ({fee.currency})</label>
                <Input type="number" min={0} step={1} value={agreedFee} onChange={(e) => setAgreedFee(e.target.value)} />
                <p className="text-muted-foreground mt-1 text-xs">
                  {agreed < fee.courseFee ? `Discount: ${money(fee.courseFee - agreed, fee.currency)}. ` : ""}
                  {remaining >= 0
                    ? `Still to pay: ${money(remaining, fee.currency)}${planType === "TWO_INSTALLMENTS" && paidCount < 2 && paidCount > 0 ? " (as 1 installment, one is already paid)" : ""}.`
                    : "The agreed fee is less than what was already paid."}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">{planType === "FULL" ? "Due date" : "1st installment due"}</label>
                  <Input type="date" value={firstDue} onChange={(e) => setFirstDue(e.target.value)} />
                </div>
                {planType === "TWO_INSTALLMENTS" && paidCount === 0 && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">2nd installment due</label>
                    <Input type="date" value={secondDue} onChange={(e) => setSecondDue(e.target.value)} />
                    <p className="text-muted-foreground mt-1 text-xs">Empty = one month after the first.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Unpaid installments</div>
              {rows.map((r, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_1fr_1.2fr_auto] items-center gap-2">
                  <Input type="number" min={1} step={1} value={r.amount} placeholder="Amount" onChange={(e) => setRows((rs) => rs.map((x, i) => (i === idx ? { ...x, amount: e.target.value } : x)))} />
                  <Input type="date" value={r.dueDate} onChange={(e) => setRows((rs) => rs.map((x, i) => (i === idx ? { ...x, dueDate: e.target.value } : x)))} />
                  <Input value={r.note} placeholder="Note (optional)" onChange={(e) => setRows((rs) => rs.map((x, i) => (i === idx ? { ...x, note: e.target.value } : x)))} />
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setRows((rs) => rs.filter((_, i) => i !== idx))} aria-label="Remove row">
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" shape="pill" className="gap-1" onClick={() => setRows((rs) => [...rs, { amount: "", dueDate: "", note: "" }])}>
                <PlusIcon className="size-4" />
                Add installment
              </Button>
              <p className="text-muted-foreground text-xs">
                Total fee will be {money(paid + customSum, fee.currency)} ({money(paid, fee.currency)} paid + {money(customSum, fee.currency)} in these installments)
                {paid + customSum < fee.courseFee ? `, a discount of ${money(fee.courseFee - paid - customSum, fee.currency)}` : ""}.
              </p>
            </div>
          )}

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">Discount / note (optional)</label>
            <Input value={discountNote} onChange={(e) => setDiscountNote(e.target.value)} placeholder="e.g. early-bird discount" />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="brand-secondary" onClick={save} disabled={loading}>
              {loading ? <Loader2Icon className="size-4 animate-spin" /> : "Save plan"}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/* ------------------------------------------------------------------ */

type InstallmentEdit = { mode: "add"; fee: CourseFee } | { mode: "edit"; fee: CourseFee; installment: Installment }

/** Mounted per target (keyed by the parent), so state is initialised once. */
function InstallmentDialog({ userId, target, onClose, onSaved }: { userId: string; target: InstallmentEdit; onClose: () => void; onSaved: () => void }) {
  const editing = target.mode === "edit" ? target.installment : null
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "")
  const [dueDate, setDueDate] = useState(editing ? ymd(editing.paymentDate) : "")
  const [note, setNote] = useState(editing?.note ?? "")

  const done = (msg: string) => { toast.success(msg); onSaved(); onClose() }
  const [add, { loading: adding }] = useMutation(ADD_STUDENT_INSTALLMENT, { onCompleted: () => done("Installment added"), onError: (e) => toast.error(e.message) })
  const [update, { loading: updating }] = useMutation(UPDATE_STUDENT_INSTALLMENT, { onCompleted: () => done("Installment updated"), onError: (e) => toast.error(e.message) })

  const save = () => {
    const n = Math.round(Number(amount))
    if (!(n > 0)) return toast.error("Enter an amount")
    if (!dueDate) return toast.error("Choose a due date")
    if (target.mode === "add") {
      add({ variables: { input: { userId, courseId: target.fee.courseId, amount: n, dueDate, note: note.trim() || undefined } } })
    } else {
      update({ variables: { input: { paymentId: target.installment.id, amount: n, dueDate, note } } })
    }
  }

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayClass} />
        <DialogPrimitive.Content className={dialogContentClass}>
          <DialogPrimitive.Title className="text-lg font-semibold">
            {target.mode === "add" ? "Add installment" : `Edit installment ${target.installment.courseDetails?.installmentNumber ?? ""}`}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
            {target.fee.courseTitle}. The student&apos;s total fee becomes the sum of all installments.
          </DialogPrimitive.Description>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Amount ({target.fee.currency})</label>
              <Input type="number" min={1} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Due date</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium">Note (optional)</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="brand-secondary" onClick={save} disabled={adding || updating}>
              {adding || updating ? <Loader2Icon className="size-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/* ------------------------------------------------------------------ */

/** Admin: pick a student, then view and change their fee plan and installments per course. */
export function StudentFeesManager({ initialUserId }: { initialUserId?: string | null }) {
  // The parent remounts this (key) when it opens fees for a different student.
  const [userId, setUserId] = useState<string | null>(initialUserId ?? null)
  const [planFee, setPlanFee] = useState<CourseFee | null>(null)
  const [installmentTarget, setInstallmentTarget] = useState<InstallmentEdit | null>(null)
  const [removeTarget, setRemoveTarget] = useState<Installment | null>(null)

  const { data, loading, error, refetch } = useQuery<{ getStudentFees: CourseFee[] }>(GET_STUDENT_FEES, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "network-only",
  })
  const fees = data?.getStudentFees ?? []

  const [remove, { loading: removing }] = useMutation(REMOVE_STUDENT_INSTALLMENT, {
    onCompleted: () => { toast.success("Installment removed"); setRemoveTarget(null); refetch() },
    onError: (e) => toast.error(e.message),
  })

  return (
    <div className="space-y-6">
      <StudentPicker value={userId} onChange={setUserId} />

      {!userId ? (
        <div className="py-12 text-center text-muted-foreground">
          <WalletIcon className="size-12 mx-auto mb-4 opacity-50" />
          <p>Choose a student to see and change their fees.</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading fees...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-destructive">{error.message}</div>
      ) : fees.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">This student has no course fees yet. Enroll them in a course from Users.</div>
      ) : (
        fees.map((fee) => (
          <Card key={fee.courseId} className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{fee.courseTitle}</CardTitle>
                <div className="text-muted-foreground mt-1 text-xs">
                  {PLAN_LABEL[fee.planType]}
                  {fee.discountNote ? ` · ${fee.discountNote}` : ""}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" shape="pill" className="gap-1" onClick={() => setInstallmentTarget({ mode: "add", fee })}>
                  <PlusIcon className="size-4" />
                  Add installment
                </Button>
                <Button size="sm" variant="brand-secondary" shape="pill" onClick={() => setPlanFee(fee)}>
                  Set fee / plan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { label: "Course fee", value: money(fee.courseFee, fee.currency) },
                  { label: "Agreed fee", value: money(fee.agreedFee, fee.currency), hint: fee.discount > 0 ? `${money(fee.discount, fee.currency)} discount` : undefined },
                  { label: "Paid", value: money(fee.totalPaid, fee.currency), tone: "text-green-600" },
                  { label: "Outstanding", value: money(fee.outstanding, fee.currency) },
                  { label: "Overdue", value: money(fee.overdue, fee.currency), tone: fee.overdue > 0 ? "text-red-600" : undefined },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border bg-background/60 p-3">
                    <div className="text-muted-foreground text-xs">{s.label}</div>
                    <div className={cn("mt-1 font-semibold", s.tone)}>{s.value}</div>
                    {s.hint && <div className="text-muted-foreground text-xs">{s.hint}</div>}
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="p-2 font-semibold">#</th>
                      <th className="p-2 font-semibold">Due</th>
                      <th className="p-2 font-semibold">Amount</th>
                      <th className="p-2 font-semibold">Status</th>
                      <th className="p-2 font-semibold">Note</th>
                      <th className="p-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {fee.installments.map((i) => {
                      const status = installmentStatus(i)
                      const editable = !i.isPaid && !hasPendingProof(i)
                      return (
                        <tr key={i.id} className="border-b last:border-0">
                          <td className="p-2 text-muted-foreground">{i.courseDetails?.installmentNumber ?? "—"}</td>
                          <td className="p-2">{formatDateISO(i.paymentDate)}</td>
                          <td className="p-2 font-medium">{money(i.amount, fee.currency)}</td>
                          <td className="p-2">
                            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", status.className)}>{status.label}</span>
                          </td>
                          <td className="p-2 text-muted-foreground text-xs">{i.note || "—"}</td>
                          <td className="p-2">
                            {editable && (
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" aria-label="Edit installment" onClick={() => setInstallmentTarget({ mode: "edit", fee, installment: i })}>
                                  <PencilIcon className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" aria-label="Remove installment" onClick={() => setRemoveTarget(i)}>
                                  <Trash2Icon className="size-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {userId && planFee && (
        <PlanDialog key={planFee.courseId} userId={userId} fee={planFee} onClose={() => setPlanFee(null)} onSaved={() => refetch()} />
      )}
      {userId && installmentTarget && (
        <InstallmentDialog
          key={installmentTarget.mode === "edit" ? installmentTarget.installment.id : `add-${installmentTarget.fee.courseId}`}
          userId={userId}
          target={installmentTarget}
          onClose={() => setInstallmentTarget(null)}
          onSaved={() => refetch()}
        />
      )}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove installment"
        description="The student's total fee goes down by this amount. Use this for a waiver or to merge installments."
        confirmLabel="Remove"
        variant="destructive"
        loading={removing}
        onConfirm={() => removeTarget && remove({ variables: { paymentId: removeTarget.id } })}
      />
    </div>
  )
}
