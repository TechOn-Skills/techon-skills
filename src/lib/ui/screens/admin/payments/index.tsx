"use client"

import { useEffect, useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  BanknoteIcon,
  CheckCircle2Icon,
  EyeIcon,
  ExternalLinkIcon,
  Loader2Icon,
  XCircleIcon,
  UserIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { formatDateISO } from "@/lib/helpers"
import { GET_PAYMENTS, UPDATE_PAYMENT } from "@/lib/graphql"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Input } from "@/lib/ui/useable-components/input"

type PaymentRow = {
  id: string
  amount: number
  paymentDate: string
  paymentStatus: string
  paymentAttachment: string
  isPaid: boolean
  payerId: string
  payer?: { id: string; fullName: string | null; email: string } | null
  courseDetails?: { courseId: string; installmentNumber: number } | null
}

type PaymentFilter = "all" | "accepted" | "pending_approval"

function hasScreenshot(p: PaymentRow): boolean {
  return (
    p.paymentAttachment != null &&
    String(p.paymentAttachment).trim() !== "" &&
    String(p.paymentAttachment).trim().toLowerCase() !== "pending"
  )
}

export const AdminPaymentsScreen = () => {
  const [rejectModal, setRejectModal] = useState<{ payment: PaymentRow; message: string } | null>(null)
  const [detailPayment, setDetailPayment] = useState<PaymentRow | null>(null)
  const [filterStatus, setFilterStatus] = useState<PaymentFilter>("all")

  const { data, loading, error, refetch } = useQuery<{ getPayments: PaymentRow[] }>(GET_PAYMENTS, {
    variables: { includeDeleted: false },
    fetchPolicy: "network-only",
  })
  useEffect(() => {
    if (error) toast.error(error.message ?? "Failed to load payments.")
  }, [error])
  const [updatePayment, { loading: updating }] = useMutation(UPDATE_PAYMENT, {
    onCompleted: () => {
      setRejectModal(null)
      setDetailPayment(null)
      toast.success("Payment updated.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to update payment."),
  })

  const allPayments = data?.getPayments ?? []
  const paymentsPendingOrAccepted = allPayments.filter(
    (p) => p.isPaid || p.paymentStatus !== "REJECTED"
  )
  const paymentsWithScreenshot = paymentsPendingOrAccepted.filter(hasScreenshot)
  const pendingApprovalCount = paymentsWithScreenshot.filter((p) => !p.isPaid).length

  const filteredPayments =
    filterStatus === "accepted"
      ? paymentsWithScreenshot.filter((p) => p.isPaid)
      : filterStatus === "pending_approval"
        ? paymentsWithScreenshot.filter((p) => !p.isPaid)
        : paymentsWithScreenshot

  const handleApprove = (payment: PaymentRow) => {
    updatePayment({
      variables: {
        input: { id: payment.id, isPaid: true },
      },
    })
  }

  const handleRejectOpen = (payment: PaymentRow) => {
    setRejectModal({ payment, message: "" })
  }

  const handleRejectSubmit = () => {
    if (!rejectModal) return
    updatePayment({
      variables: {
        input: {
          id: rejectModal.payment.id,
          paymentStatus: "REJECTED",
          rejectionMessage: rejectModal.message.trim() || undefined,
        },
      },
    })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Payments
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Approve or reject student fee submissions. Student receives an email and notification on approval or rejection.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="text-muted-foreground text-xs mb-1">Pending approval</div>
              <div className="text-3xl font-semibold tracking-tight text-(--brand-primary)">
                {loading ? "—" : pendingApprovalCount}
              </div>
              <div className="text-muted-foreground text-xs mt-1">With screenshot, awaiting action</div>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.15),rgba(255,138,61,0.08),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="text-muted-foreground text-xs mb-1">Total shown</div>
              <div className="text-3xl font-semibold tracking-tight text-foreground">
                {loading ? "—" : paymentsWithScreenshot.length}
              </div>
              <div className="text-muted-foreground text-xs mt-1">With screenshot (rejected excluded)</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">Filter:</span>
        <div className="flex rounded-xl border bg-muted-surface/30 p-0.5">
          {(
            [
              { value: "all" as const, label: "All" },
              { value: "accepted" as const, label: "Accepted" },
              { value: "pending_approval" as const, label: "Pending approval" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilterStatus(value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
        <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                <Loader2Icon className="size-6 animate-spin" />
                <span>Loading payments...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-border border-b bg-background/40">
                    <tr>
                      <th className="p-4 font-semibold">Student</th>
                      <th className="p-4 font-semibold">Amount</th>
                      <th className="p-4 font-semibold">Due date</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((p) => {
                      const hasScreenshotForRow = hasScreenshot(p)
                      const canApproveReject = !p.isPaid && hasScreenshotForRow
                      return (
                        <tr key={p.id} className="border-border border-b transition-colors hover:bg-background/60">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <UserIcon className="size-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{p.payer?.fullName ?? "—"}</div>
                                <div className="text-muted-foreground text-xs">{p.payer?.email ?? ""}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold">PKR {p.amount?.toLocaleString() ?? "0"}</td>
                          <td className="p-4 text-muted-foreground">
                            {formatDateISO(p.paymentDate)}
                            {p.courseDetails?.installmentNumber ? ` (Inst. ${p.courseDetails.installmentNumber})` : ""}
                          </td>
                          <td className="p-4">
                            {p.isPaid ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                                <CheckCircle2Icon className="size-3.5" />
                                Paid
                              </span>
                            ) : hasScreenshotForRow ? (
                              <span className="inline-flex items-center gap-1 rounded-full border bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                Pending approval
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border bg-muted-surface/50 px-2 py-1 text-xs font-semibold text-muted-foreground">
                                Pending (no screenshot)
                              </span>
                            )}
                          </td>
                          <td className="p-4 flex items-center gap-2 flex-wrap">
                            {hasScreenshotForRow && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                shape="pill"
                                onClick={() => setDetailPayment(p)}
                              >
                                <EyeIcon className="size-4" />
                                View
                              </Button>
                            )}
                            {canApproveReject && (
                              <>
                                <Button
                                  type="button"
                                  variant="brand-secondary"
                                  size="sm"
                                  shape="pill"
                                  disabled={updating}
                                  onClick={() => handleApprove(p)}
                                >
                                  <CheckCircle2Icon className="size-4" />
                                  Accept
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  shape="pill"
                                  disabled={updating}
                                  className="text-destructive border-destructive/50 hover:bg-destructive/10"
                                  onClick={() => handleRejectOpen(p)}
                                >
                                  <XCircleIcon className="size-4" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && filteredPayments.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                {filterStatus === "all"
                  ? "No pending or accepted payments."
                  : filterStatus === "accepted"
                    ? "No accepted payments."
                    : "No payments pending approval."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment detail modal (screenshot + info) */}
      <DialogPrimitive.Root open={!!detailPayment} onOpenChange={(open) => !open && setDetailPayment(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl outline-none">
            {detailPayment && (
              <>
                <DialogPrimitive.Title className="text-lg font-semibold">
                  Payment details
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
                  Student proof of payment. Review the screenshot below before approving or rejecting.
                </DialogPrimitive.Description>

                <div className="mt-4 space-y-4">
                  <div className="rounded-xl border bg-muted-surface/30 p-4">
                    <div className="text-muted-foreground text-xs font-medium">Student</div>
                    <div className="mt-1 font-medium">{detailPayment.payer?.fullName ?? "—"}</div>
                    <div className="text-muted-foreground text-sm">{detailPayment.payer?.email ?? ""}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border bg-muted-surface/30 p-3">
                      <div className="text-muted-foreground text-xs">Amount</div>
                      <div className="font-semibold">PKR {detailPayment.amount?.toLocaleString() ?? "0"}</div>
                    </div>
                    <div className="rounded-xl border bg-muted-surface/30 p-3">
                      <div className="text-muted-foreground text-xs">Due date</div>
                      <div>
                        {formatDateISO(detailPayment.paymentDate)}
                        {detailPayment.courseDetails?.installmentNumber != null && (
                          <span className="text-muted-foreground"> · Inst. {detailPayment.courseDetails.installmentNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-muted-foreground text-xs font-medium mb-2">Payment screenshot</div>
                    <div className="rounded-xl border bg-muted-surface/20 overflow-hidden">
                      {detailPayment.paymentAttachment &&
                      detailPayment.paymentAttachment !== "pending" &&
                      (detailPayment.paymentAttachment.startsWith("http") || detailPayment.paymentAttachment.startsWith("/")) ? (
                        <>
                          <a
                            href={detailPayment.paymentAttachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={detailPayment.paymentAttachment}
                              alt="Payment proof"
                              className="w-full max-h-[min(50vh,24rem)] object-contain bg-muted-surface/50"
                            />
                          </a>
                          <a
                            href={detailPayment.paymentAttachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLinkIcon className="size-3.5" />
                            Open in new tab
                          </a>
                        </>
                      ) : (
                        <div className="p-6 text-center text-muted-foreground text-sm">
                          No image available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      type="button"
                      variant="brand-secondary"
                      size="sm"
                      shape="pill"
                      disabled={updating}
                      onClick={() => handleApprove(detailPayment)}
                    >
                      <CheckCircle2Icon className="size-4" />
                      Accept
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      shape="pill"
                      disabled={updating}
                      className="text-destructive border-destructive/50 hover:bg-destructive/10"
                      onClick={() => {
                        setDetailPayment(null)
                        handleRejectOpen(detailPayment)
                      }}
                    >
                      <XCircleIcon className="size-4" />
                      Reject
                    </Button>
                    <DialogPrimitive.Close asChild>
                      <Button type="button" variant="ghost" size="sm" shape="pill">
                        Close
                      </Button>
                    </DialogPrimitive.Close>
                  </div>
                </div>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Reject modal with message */}
      <DialogPrimitive.Root open={!!rejectModal} onOpenChange={(open) => !open && setRejectModal(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-xl outline-none">
            <DialogPrimitive.Title className="text-lg font-semibold">Reject payment</DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
              Optionally add a message for the student. They will receive an email and notification with this message.
            </DialogPrimitive.Description>
            <Input
              placeholder="e.g. Please upload a clearer screenshot of the transaction."
              value={rejectModal?.message ?? ""}
              onChange={(e) => setRejectModal((prev) => (prev ? { ...prev, message: e.target.value } : null))}
              className="mt-4 rounded-xl"
            />
            <div className="mt-6 flex gap-2 justify-end">
              <Button variant="outline" shape="pill" onClick={() => setRejectModal(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                shape="pill"
                disabled={updating}
                onClick={handleRejectSubmit}
              >
                {updating ? <Loader2Icon className="size-4 animate-spin" /> : "Reject"}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
