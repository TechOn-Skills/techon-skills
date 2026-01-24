"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useLocalStorageItem } from "@/lib/hooks/use-local-storage"
import { useMemo, useState } from "react"
import { CheckCircle2Icon, CopyIcon, CreditCardIcon, UploadIcon, XIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Separator } from "@/lib/ui/useable-components/separator"

type FeeStatus = "paid" | "pending" | "under-verification"

type FeeEntry = {
  id: string
  month: string
  amount: string
  dueDate: string
  status: FeeStatus
}

const FEES_DATA: FeeEntry[] = [
  { id: "f-1", month: "January 2026", amount: "PKR 2,500", dueDate: "2026-01-31", status: "pending" },
  { id: "f-2", month: "February 2026", amount: "PKR 2,500", dueDate: "2026-02-28", status: "pending" },
  { id: "f-3", month: "March 2026", amount: "PKR 2,500", dueDate: "2026-03-31", status: "pending" },
]

const BANK_DETAILS = {
  accountNumber: "56275002185883",
  bankName: "Bank Alfalah",
  accountTitle: "Ahmad Raza",
}

export const StudentFeesScreen = () => {
  const [open, setOpen] = useState(false)
  const [modalStep, setModalStep] = useState<"bank" | "upload">("bank")
  const [selectedFee, setSelectedFee] = useState<FeeEntry | null>(null)

  // In a real app you'd track all fees; for demo we track one ID
  const { value: statusRaw, setValue: setStatusRaw } = useLocalStorageItem("student:fees:status")
  const storedStatus: Record<string, FeeStatus> = useMemo(() => {
    try {
      return statusRaw ? JSON.parse(statusRaw) : {}
    } catch {
      return {}
    }
  }, [statusRaw])

  const rows = useMemo(() => {
    return FEES_DATA.map((f) => ({
      ...f,
      status: storedStatus[f.id] ?? f.status,
    }))
  }, [storedStatus])

  const handlePayNow = (fee: FeeEntry) => {
    setSelectedFee(fee)
    setModalStep("bank")
    setOpen(true)
  }

  const handleUploadClick = () => {
    setModalStep("upload")
  }

  const handleUploadConfirm = () => {
    if (!selectedFee) return
    const next = { ...storedStatus, [selectedFee.id]: "under-verification" as const }
    setStatusRaw(JSON.stringify(next))
    setOpen(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text)
  }

  return (
    <div className="w-full py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Fees</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Fee payments & status
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Manage your monthly fees. Pay online and upload proof to update your status.
        </p>
      </div>

      <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-auto">
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-border border-b">
              <tr>
                <th className="p-4 font-semibold">Month</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-border border-b transition-colors hover:bg-background/40">
                  <td className="p-4">{r.month}</td>
                  <td className="p-4 font-semibold">{r.amount}</td>
                  <td className="p-4 text-muted-foreground">{r.dueDate}</td>
                  <td className="p-4">
                    {r.status === "paid" ? (
                      <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                        <CheckCircle2Icon className="size-3.5" />
                        Paid
                      </span>
                    ) : r.status === "under-verification" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border bg-background/50 px-2 py-1 text-xs font-semibold text-secondary">
                        Under verification
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Pending</span>
                    )}
                  </td>
                  <td className="p-4">
                    {r.status === "pending" ? (
                      <Button
                        type="button"
                        variant="brand-secondary"
                        shape="pill"
                        className="h-9"
                        onClick={() => handlePayNow(r)}
                      >
                        <CreditCardIcon className="size-4" />
                        Pay now
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pay now modal */}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <DialogPrimitive.Content
            className="bg-card text-primary data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-right fixed left-1/2 top-1/2 z-50 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border shadow-xl outline-none transition-all duration-300"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full p-1 transition-colors hover:bg-background/50"
            >
              <XIcon className="size-4" />
            </button>

            {modalStep === "bank" && (
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <div className="text-primary text-xl font-semibold">Payment details</div>
                  <div className="text-muted-foreground text-sm">
                    Transfer fees to this bank account.
                  </div>
                </div>

                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-base">Bank Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-2xl border bg-background/40 p-4">
                      <div className="text-muted-foreground text-xs">Account Number</div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="font-mono text-lg font-semibold">{BANK_DETAILS.accountNumber}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          shape="pill"
                          onClick={() => copyToClipboard(BANK_DETAILS.accountNumber)}
                        >
                          <CopyIcon className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4">
                      <div className="text-muted-foreground text-xs">Bank Name</div>
                      <div className="mt-1 font-semibold">{BANK_DETAILS.bankName}</div>
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4">
                      <div className="text-muted-foreground text-xs">Account Title</div>
                      <div className="mt-1 font-semibold">{BANK_DETAILS.accountTitle}</div>
                    </div>
                  </CardContent>
                </Card>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="text-muted-foreground text-sm leading-7">
                    After payment, upload a screenshot of your transaction to update your fee status.
                  </div>
                  <Button
                    type="button"
                    variant="brand-secondary"
                    shape="pill"
                    className="h-11 w-full"
                    onClick={handleUploadClick}
                  >
                    <UploadIcon className="size-4" />
                    Upload payment screenshot
                  </Button>
                </div>
              </div>
            )}

            {modalStep === "upload" && (
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <div className="text-primary text-xl font-semibold">Upload payment proof</div>
                  <div className="text-muted-foreground text-sm">
                    Attach your bank screenshot below.
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-dashed bg-background/40 p-8 text-center transition-colors hover:border-ring hover:bg-background/50">
                  <UploadIcon className="text-muted-foreground mx-auto size-10" />
                  <div className="text-muted-foreground mt-3 text-sm">
                    Click or drag your screenshot here (demo)
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    shape="pill"
                    className="h-11 flex-1"
                    onClick={() => setModalStep("bank")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="brand-secondary"
                    shape="pill"
                    className="h-11 flex-1"
                    onClick={handleUploadConfirm}
                  >
                    <CheckCircle2Icon className="size-4" />
                    Confirm upload
                  </Button>
                </div>
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
