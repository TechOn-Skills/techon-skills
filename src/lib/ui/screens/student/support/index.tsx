"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { HeadphonesIcon, Loader2Icon, SendIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { CREATE_TICKET, GET_MY_TICKETS } from "@/lib/graphql"
import { formatDateLong } from "@/lib/helpers"
import { cn } from "@/lib/helpers"

export const StudentSupportScreen = () => {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const { data, loading, refetch } = useQuery<{
    getMyTickets: Array<{
      id: string
      subject: string
      message: string
      status: string
      adminReply: string | null
      repliedAt: string | null
      createdAt: string
    }>
  }>(GET_MY_TICKETS, { fetchPolicy: "network-only" })

  const [createTicket, { loading: creating }] = useMutation(CREATE_TICKET, {
    onCompleted: () => {
      toast.success("Ticket submitted.")
      setSubject("")
      setMessage("")
      void refetch()
    },
    onError: (e) => toast.error(e.message ?? "Failed to submit"),
  })

  const tickets = data?.getMyTickets ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required.")
      return
    }
    createTicket({
      variables: {
        input: { subject: subject.trim(), message: message.trim() },
      },
    })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Support</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Help & tickets</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Raise a ticket for the admin team. Replies appear below when staff respond.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <Card className="bg-background/70 h-fit rounded-3xl backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HeadphonesIcon className="size-5 text-(--brand-secondary)" />
              New ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">Subject</label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary" />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-xs font-medium">Description</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue…"
                  className="min-h-[120px]"
                />
              </div>
              <p className="text-muted-foreground text-xs">Attachments can be shared via a link in your message.</p>
              <Button type="submit" variant="brand-secondary" shape="pill" className="w-full gap-2" disabled={creating}>
                {creating ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
                Submit ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-background/70 rounded-3xl backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Your tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
            ) : tickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tickets yet.</p>
            ) : (
              <ul className="space-y-4">
                {tickets.map((t) => (
                  <li key={t.id} className="rounded-2xl border bg-muted-surface/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{t.subject}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          t.status === "RESOLVED"
                            ? "bg-green-500/20 text-green-700 dark:text-green-400"
                            : t.status === "IN_PROGRESS"
                              ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                              : "bg-muted-surface text-muted-foreground"
                        )}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">{t.message}</p>
                    {t.adminReply && (
                      <div className="mt-3 rounded-xl border border-(--brand-secondary)/30 bg-(--brand-secondary)/5 p-3 text-sm">
                        <span className="text-xs font-semibold text-(--brand-secondary)">Reply</span>
                        <p className="mt-1 whitespace-pre-wrap">{t.adminReply}</p>
                        {t.repliedAt && (
                          <p className="text-muted-foreground mt-2 text-xs">{formatDateLong(t.repliedAt)}</p>
                        )}
                      </div>
                    )}
                    <p className="text-muted-foreground mt-2 text-xs">{formatDateLong(t.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
