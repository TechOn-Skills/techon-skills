"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  CalendarIcon,
  Loader2Icon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  MapPinIcon,
  VideoIcon,
  UsersIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { GET_EVENTS, CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT } from "@/lib/graphql"
import { cn } from "@/lib/helpers"
import { EVENT_TYPE_CONFIG } from "@/utils/constants"

const EVENT_TYPES = ["workshop", "webinar", "hackathon", "networking", "career"] as const

type EventRow = {
  id: string
  title: string
  description: string
  type: string
  date: string
  time: string
  duration: string
  location: string
  isOnline: boolean
  totalSpots: number
  spotsLeft: number
  tags: string[]
  instructor?: string | null
}

const emptyForm = {
  title: "",
  description: "",
  type: "workshop" as const,
  date: "",
  time: "",
  duration: "",
  location: "",
  isOnline: true,
  totalSpots: 30,
  tags: "" as string,
  instructor: "",
}

export const AdminEventsScreen = () => {
  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const { data, loading, error, refetch } = useQuery<{ getEvents: EventRow[] }>(GET_EVENTS)
  const [createEvent, { loading: creating }] = useMutation(CREATE_EVENT, {
    onCompleted: () => {
      toast.success("Event created")
      setCreateOpen(false)
      setForm(emptyForm)
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })
  const [updateEvent, { loading: updating }] = useMutation(UPDATE_EVENT, {
    onCompleted: () => {
      toast.success("Event updated")
      setEditId(null)
      setForm(emptyForm)
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })
  const [deleteEvent, { loading: deleting }] = useMutation(DELETE_EVENT, {
    onCompleted: () => {
      toast.success("Event deleted")
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const events = data?.getEvents ?? []

  const openEdit = (e: EventRow) => {
    setEditId(e.id)
    setForm({
      title: e.title,
      description: e.description,
      type: e.type as typeof emptyForm.type,
      date: e.date,
      time: e.time,
      duration: e.duration,
      location: e.location,
      isOnline: e.isOnline,
      totalSpots: e.totalSpots,
      tags: (e.tags ?? []).join(", "),
      instructor: e.instructor ?? "",
    })
  }

  const handleCreate = () => {
    if (!form.title.trim() || !form.date.trim() || !form.time.trim()) {
      toast.error("Title, date and time are required")
      return
    }
    createEvent({
      variables: {
        input: {
          title: form.title.trim(),
          description: form.description.trim() || "—",
          type: form.type,
          date: form.date,
          time: form.time,
          duration: form.duration || "1 hour",
          location: form.location || "Online",
          isOnline: form.isOnline,
          totalSpots: form.totalSpots || 30,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          instructor: form.instructor || undefined,
        },
      },
    })
  }

  const handleUpdate = () => {
    if (!editId || !form.title.trim() || !form.date.trim() || !form.time.trim()) return
    updateEvent({
      variables: {
        input: {
          id: editId,
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          type: form.type,
          date: form.date,
          time: form.time,
          duration: form.duration || undefined,
          location: form.location || undefined,
          isOnline: form.isOnline,
          totalSpots: form.totalSpots || undefined,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
          instructor: form.instructor || undefined,
        },
      },
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this event?")) return
    deleteEvent({ variables: { id } })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-secondary">Admin</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Events
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Create and manage workshops, webinars, and events. Students can register from their dashboard.
          </p>
        </div>
        <DialogPrimitive.Root open={createOpen} onOpenChange={setCreateOpen}>
          <DialogPrimitive.Trigger asChild>
            <Button variant="brand-secondary" shape="pill" className="gap-2">
              <PlusIcon className="size-4" />
              New Event
            </Button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-background p-6 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              <DialogPrimitive.Title className="text-lg font-semibold">Create Event</DialogPrimitive.Title>
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))}
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{(EVENT_TYPE_CONFIG as Record<string, { label: string }>)[t]?.label ?? t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Total spots</label>
                  <Input
                    type="number"
                    min={1}
                    value={form.totalSpots}
                    onChange={(e) => setForm((f) => ({ ...f, totalSpots: Number(e.target.value) || 30 }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Time</label>
                  <Input
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    placeholder="2:00 PM"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Duration</label>
                <Input
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="2 hours"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Online via Google Meet"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={form.isOnline}
                  onChange={(e) => setForm((f) => ({ ...f, isOnline: e.target.checked }))}
                  className="rounded border-input"
                />
                <label htmlFor="isOnline" className="text-sm">Online event</label>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Instructor (optional)</label>
                <Input
                  value={form.instructor}
                  onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))}
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tags (comma-separated)</label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="React, Frontend"
                />
              </div>
            </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button variant="brand-secondary" onClick={handleCreate} disabled={creating}>
                  {creating ? <Loader2Icon className="size-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading events...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-destructive">Failed to load events.</p>
        </div>
      ) : (
        <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="p-4 font-semibold">Event</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Date & Time</th>
                    <th className="p-4 font-semibold">Spots</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => {
                    const typeConfig = (EVENT_TYPE_CONFIG as Record<string, { label: string; color: string }>)[ev.type]
                    return (
                      <tr key={ev.id} className="border-b transition-colors hover:bg-muted/20">
                        <td className="p-4">
                          <div className="font-semibold">{ev.title}</div>
                          <div className="text-muted-foreground text-xs line-clamp-1">{ev.description}</div>
                        </td>
                        <td className="p-4">
                          <span className={cn("rounded-full px-2 py-1 text-xs font-medium", typeConfig?.color ?? "bg-muted")}>
                            {typeConfig?.label ?? ev.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>{ev.date}</div>
                          <div className="text-muted-foreground text-xs">{ev.time} · {ev.duration}</div>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1">
                            <UsersIcon className="size-4 text-muted-foreground" />
                            {ev.spotsLeft} / {ev.totalSpots}
                          </span>
                        </td>
                        <td className="p-4">
                          {ev.isOnline ? (
                            <span className="flex items-center gap-1 text-muted-foreground text-xs">
                              <VideoIcon className="size-3.5" /> Online
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted-foreground text-xs line-clamp-1">
                              <MapPinIcon className="size-3.5" /> {ev.location}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(ev)}>
                              <PencilIcon className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(ev.id)} disabled={deleting}>
                              <Trash2Icon className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {events.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <CalendarIcon className="size-12 mx-auto mb-4 opacity-50" />
                <p>No events yet. Create one to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit dialog */}
      <DialogPrimitive.Root open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-background p-6 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <DialogPrimitive.Title className="text-lg font-semibold">Edit Event</DialogPrimitive.Title>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <select
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{(EVENT_TYPE_CONFIG as Record<string, { label: string }>)[t]?.label ?? t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Total spots</label>
                <Input type="number" min={1} value={form.totalSpots} onChange={(e) => setForm((f) => ({ ...f, totalSpots: Number(e.target.value) || 30 }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Time</label>
                <Input value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Duration</label>
              <Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="editIsOnline" checked={form.isOnline} onChange={(e) => setForm((f) => ({ ...f, isOnline: e.target.checked }))} className="rounded border-input" />
              <label htmlFor="editIsOnline" className="text-sm">Online event</label>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Instructor</label>
              <Input value={form.instructor} onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tags (comma-separated)</label>
              <Input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} />
            </div>
          </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
              <Button variant="brand-secondary" onClick={handleUpdate} disabled={updating}>
                {updating ? <Loader2Icon className="size-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
