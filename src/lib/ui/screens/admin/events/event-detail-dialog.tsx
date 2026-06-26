"use client"

import Image from "next/image"
import { useQuery } from "@apollo/client/react"
import { Loader2Icon, MailIcon, PhoneIcon, UsersIcon } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { GET_EVENT_REGISTRATIONS } from "@/lib/graphql"
import { cn, formatDateLong, getImageSrc, isBackendImageUrl } from "@/lib/helpers"
import { EVENT_TYPE_CONFIG } from "@/utils/constants"

export type AdminEventDetail = {
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
  registrationCount: number
  tags: string[]
  instructor?: string | null
}

type Registrant = {
  userId: string
  fullName: string
  email: string
  phoneNumber: string | null
  profilePicture: string | null
  registeredAt: string
}

type Props = {
  event: AdminEventDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminEventDetailDialog({ event, open, onOpenChange }: Props) {
  const { data, loading } = useQuery<{ getEventRegistrations: Registrant[] }>(GET_EVENT_REGISTRATIONS, {
    variables: { eventId: event?.id ?? "" },
    skip: !open || !event?.id,
    fetchPolicy: "network-only",
  })

  const registrants = data?.getEventRegistrations ?? []
  const typeConfig = event
    ? (EVENT_TYPE_CONFIG as Record<string, { label: string; color: string }>)[event.type]
    : null
  const fillPercent =
    event && event.totalSpots > 0 ? Math.min(100, Math.round((event.registrationCount / event.totalSpots) * 100)) : 0

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[min(90vh,52rem)] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border bg-background shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out">
          {event ? (
            <>
              <div className="border-b px-6 py-5">
                <DialogPrimitive.Title className="text-xl font-semibold pr-8">{event.title}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
                  {event.date} · {event.time} · {event.duration}
                </DialogPrimitive.Description>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-1 text-xs font-medium", typeConfig?.color ?? "bg-muted-surface")}>
                    {typeConfig?.label ?? event.type}
                  </span>
                  {event.instructor ? (
                    <span className="text-muted-foreground text-xs">Instructor: {event.instructor}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                <div>
                  <p className="text-sm leading-7 whitespace-pre-wrap">{event.description}</p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {event.isOnline ? "Online" : event.location}
                  </p>
                  {(event.tags?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {event.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-muted-surface px-2 py-0.5 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border bg-muted-surface/30 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-1.5">
                      <UsersIcon className="size-4 text-(--brand-secondary)" />
                      Registrations
                    </span>
                    <span className="font-semibold text-(--brand-secondary)">
                      {event.registrationCount} / {event.totalSpots}
                    </span>
                  </div>
                  <div className="bg-muted-surface h-2 overflow-hidden rounded-full">
                    <div
                      className="bg-(--brand-secondary) h-full rounded-full transition-all"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {event.spotsLeft} spot{event.spotsLeft !== 1 ? "s" : ""} remaining · {fillPercent}% full
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold">
                    Registered students ({registrants.length})
                  </h3>
                  {loading ? (
                    <div className="flex items-center gap-2 py-8 text-muted-foreground text-sm">
                      <Loader2Icon className="size-4 animate-spin" />
                      Loading registrants…
                    </div>
                  ) : registrants.length === 0 ? (
                    <div className="rounded-2xl border border-dashed py-10 text-center text-muted-foreground text-sm">
                      No students registered yet.
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {registrants.map((r) => {
                        const avatar = getImageSrc(r.profilePicture)
                        return (
                          <li
                            key={r.userId}
                            className="flex items-start gap-3 rounded-2xl border bg-background/60 p-3 transition-colors hover:bg-muted-surface/40"
                          >
                            <div className="bg-muted-surface relative size-12 shrink-0 overflow-hidden rounded-full border">
                              {avatar ? (
                                isBackendImageUrl(avatar) ? (
                                  <Image src={avatar} alt="" fill className="object-cover" sizes="48px" />
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={avatar} alt="" className="size-full object-cover" />
                                )
                              ) : (
                                <div className="flex size-full items-center justify-center text-sm font-semibold text-(--brand-secondary)">
                                  {(r.fullName || r.email || "?").charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{r.fullName}</p>
                              <p className="text-muted-foreground flex items-center gap-1 text-xs truncate">
                                <MailIcon className="size-3 shrink-0" />
                                {r.email || "—"}
                              </p>
                              <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                <PhoneIcon className="size-3 shrink-0" />
                                {r.phoneNumber?.trim() || "No phone on profile"}
                              </p>
                              <p className="text-muted-foreground mt-1 text-[10px]">
                                Registered {formatDateLong(r.registeredAt)}
                              </p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
