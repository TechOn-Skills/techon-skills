"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  BanknoteIcon,
  CheckCircle2Icon,
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

export const AdminPaymentsScreen = () => {
  const [rejectModal, setRejectModal] = useState<{ payment: PaymentRow; message: string } | null>(null)

  const { data, loading, refetch } = useQuery<{ getPayments: PaymentRow[] }>(GET_PAYMENTS, {
    variables: { includeDeleted: false },
  })
  const [updatePayment, { loading: updating }] = useMutation(UPDATE_PAYMENT, {
    onCompleted: () => {
      setRejectModal(null)
      toast.success("Payment updated.")
      refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to update payment."),
  })

  const payments = data?.getPayments ?? []
  const pendingPayments = payments.filter((p) => !p.isPaid && p.paymentStatus !== "REJECTED")

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

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="text-muted-foreground text-xs mb-1">Pending approval</div>
              <div className="text-3xl font-semibold tracking-tight text-(--brand-primary)">
                {loading ? "—" : pendingPayments.length}
              </div>
            </CardContent>
          </Card>
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
                    {pendingPayments.map((p) => (
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
                          <span className="inline-flex items-center gap-1 rounded-full border bg-background/50 px-2 py-1 text-xs font-semibold text-secondary">
                            Pending approval
                          </span>
                        </td>
                        <td className="p-4 flex items-center gap-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && pendingPayments.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No payments pending approval.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
