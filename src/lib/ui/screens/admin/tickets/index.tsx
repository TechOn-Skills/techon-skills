"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  Loader2Icon,
  MessageSquareIcon,
  SendIcon,
  TicketIcon,
  UserIcon,
  CheckCircle2Icon,
  ClockIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { GET_TICKETS, GET_TICKET, REPLY_TO_TICKET, UPDATE_TICKET_STATUS } from "@/lib/graphql"
import { cn } from "@/lib/helpers"

type TicketRow = {
  id: string
  subject: string
  message: string
  status: string
  adminReply?: string | null
  repliedAt?: string | null
  createdAt: string
  user?: { id: string; email: string; fullName?: string | null } | null
}

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400" },
  IN_PROGRESS: { label: "In progress", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
  RESOLVED: { label: "Resolved", color: "bg-green-500/20 text-green-600 dark:text-green-400" },
}

export const AdminTicketsScreen = () => {
  const [viewId, setViewId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")

  const { data, loading, error, refetch } = useQuery<{ getTickets: TicketRow[] }>(GET_TICKETS, {
    variables: { limit: 100, ...(statusFilter && { status: statusFilter }) },
  })
  const { data: ticketData } = useQuery<{ getTicket: TicketRow }>(GET_TICKET, {
    variables: { id: viewId! },
    skip: !viewId,
  })
  const [replyToTicket, { loading: replying }] = useMutation(REPLY_TO_TICKET, {
    onCompleted: () => { toast.success("Reply sent"); setReplyText(""); refetch(); setViewId(null) },
    onError: (e) => toast.error(e.message),
  })
  const [updateStatus] = useMutation(UPDATE_TICKET_STATUS, {
    onCompleted: () => { toast.success("Status updated"); refetch() },
    onError: (e) => toast.error(e.message),
  })

  const tickets = data?.getTickets ?? []
  const selected = ticketData?.getTicket ?? tickets.find((t) => t.id === viewId)

  const handleReply = () => {
    if (!viewId || !replyText.trim()) return
    replyToTicket({
      variables: {
        input: { id: viewId, adminReply: replyText.trim(), status: "RESOLVED" },
      },
    })
  }

  const setStatus = (id: string, status: string) => {
    updateStatus({ variables: { id, status } })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-secondary">Admin</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Support Tickets</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            View and respond to student support tickets.
          </p>
        </div>
        <div className="flex gap-2">
          {["", "OPEN", "IN_PROGRESS", "RESOLVED"].map((s) => (
            <Button
              key={s || "all"}
              variant={statusFilter === s ? "brand-secondary" : "outline"}
              size="sm"
              shape="pill"
              onClick={() => setStatusFilter(s)}
            >
              {s || "All"}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading tickets...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-destructive">Failed to load tickets.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1 bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="max-h-[60vh] overflow-y-auto">
                {tickets.map((t) => {
                  const sc = statusConfig[t.status] ?? { label: t.status, color: "bg-muted" }
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setViewId(t.id)}
                      className={cn(
                        "w-full text-left p-4 border-b transition-colors hover:bg-muted/30",
                        viewId === t.id && "bg-muted/50"
                      )}
                    >
                      <div className="font-medium truncate">{t.subject}</div>
                      <div className="text-muted-foreground text-xs mt-1 flex items-center gap-2">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", sc.color)}>{sc.label}</span>
                        {t.user?.email}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">{new Date(t.createdAt).toLocaleString()}</div>
                    </button>
                  )
                })}
              </div>
              {tickets.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <TicketIcon className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No tickets.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            {selected ? (
              <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">{selected.subject}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={cn("rounded-full px-2 py-1 text-xs font-medium", (statusConfig[selected.status] ?? {}).color)}>
                        {statusConfig[selected.status]?.label ?? selected.status}
                      </span>
                      {selected.user && (
                        <span className="text-muted-foreground text-sm flex items-center gap-1">
                          <UserIcon className="size-3.5" />
                          {selected.user.fullName || selected.user.email}
                        </span>
                      )}
                      <span className="text-muted-foreground text-xs">{new Date(selected.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <div className="text-sm text-muted-foreground mb-1">Message</div>
                    <p className="text-sm whitespace-pre-wrap">{selected.message}</p>
                  </div>
                  {selected.adminReply && (
                    <div className="rounded-2xl border bg-(--brand-primary)/10 p-4">
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <CheckCircle2Icon className="size-4" />
                        Admin reply {selected.repliedAt && `· ${new Date(selected.repliedAt).toLocaleString()}`}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{selected.adminReply}</p>
                    </div>
                  )}
                  {selected.status !== "RESOLVED" && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Reply</label>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="brand-secondary" shape="pill" onClick={handleReply} disabled={!replyText.trim() || replying}>
                          {replying ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
                          Reply & mark resolved
                        </Button>
                        <Button variant="outline" size="sm" shape="pill" onClick={() => setStatus(selected.id, "IN_PROGRESS")}>
                          <ClockIcon className="size-4" />
                          Mark in progress
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-background/70 backdrop-blur rounded-3xl">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MessageSquareIcon className="size-12 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view and reply.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
