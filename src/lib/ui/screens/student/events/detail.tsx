"use client"

import Link from "next/link"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  MapPinIcon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { GET_EVENT, REGISTER_FOR_EVENT, UNREGISTER_FROM_EVENT } from "@/lib/graphql"
import { cn } from "@/lib/helpers"
import { EVENT_TYPE_CONFIG } from "@/utils/constants"
import type { IEvent } from "@/utils/interfaces"

type EventDetail = {
  id: string
  title: string
  description: string
  type: IEvent["type"]
  date: string
  time: string
  duration: string
  location: string
  isOnline: boolean
  totalSpots: number
  spotsLeft: number
  isRegistered: boolean
  tags: string[]
  instructor?: string | null
}

export const StudentEventDetailScreen = ({ id }: { id: string }) => {
  const { data, loading, error, refetch } = useQuery<{ getEvent: EventDetail | null }>(GET_EVENT, {
    variables: { id },
  })
  const [registerForEvent, { loading: registering }] = useMutation(REGISTER_FOR_EVENT, {
    onCompleted: () => {
      refetch()
      toast.success("Registered for event")
    },
    onError: (e) => toast.error(e.message),
  })
  const [unregisterFromEvent, { loading: unregistering }] = useMutation(UNREGISTER_FROM_EVENT, {
    onCompleted: () => {
      refetch()
      toast.success("Registration cancelled")
    },
    onError: (e) => toast.error(e.message),
  })

  const event = data?.getEvent
  const spotsPercentage = event && event.totalSpots > 0 ? (event.spotsLeft / event.totalSpots) * 100 : 0

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading event...</span>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="w-full px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-background/70 backdrop-blur">
            <CardHeader>
              <CardTitle>Event not found</CardTitle>
              <CardDescription>
                This event may have been removed or the link is incorrect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="brand-secondary" shape="pill">
                <Link href="/student/events" className="gap-2">
                  <ArrowLeftIcon className="size-4" />
                  Back to events
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const typeConfig = EVENT_TYPE_CONFIG[event.type] ?? { label: event.type, color: "bg-muted-surface" }

  const handleRegister = () => {
    if (event.isRegistered) unregisterFromEvent({ variables: { eventId: event.id } })
    else registerForEvent({ variables: { eventId: event.id } })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
            <Link href="/student/events" className="gap-2">
              <ArrowLeftIcon className="size-4" />
              Back to events
            </Link>
          </Button>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
            <div className="h-1.5 w-full bg-[linear-gradient(to_right,rgba(79,195,232,0.75),rgba(242,140,40,0.6))]" />
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", typeConfig.color)}>
                  {typeConfig.label}
                </span>
                {event.isRegistered && (
                  <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
                    <CheckCircle2Icon className="size-3" />
                    Registered
                  </span>
                )}
              </div>
              <CardTitle className="text-3xl tracking-tight sm:text-4xl">{event.title}</CardTitle>
              <CardDescription className="text-base leading-7">{event.description}</CardDescription>

              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <CalendarIcon className="size-3.5" />
                    Date & Time
                  </div>
                  <div className="font-semibold">{event.date}</div>
                  <div className="text-muted-foreground text-sm">{event.time} · {event.duration}</div>
                </div>
                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    {event.isOnline ? <VideoIcon className="size-3.5" /> : <MapPinIcon className="size-3.5" />}
                    Location
                  </div>
                  <div className="font-semibold">{event.isOnline ? "Online" : "On Campus"}</div>
                  <div className="text-muted-foreground text-sm truncate">{event.location}</div>
                </div>
              </div>

              {event.instructor && (
                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="text-muted-foreground text-xs mb-1">Instructor</div>
                  <div className="font-semibold">{event.instructor}</div>
                </div>
              )}

              {(event.tags ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <UsersIcon className="size-4" />
                    Spots available
                  </span>
                  <span className="font-semibold">
                    {event.spotsLeft} / {event.totalSpots}
                  </span>
                </div>
                <div className="h-2 bg-background/40 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      spotsPercentage > 50 ? "bg-green-500" : spotsPercentage > 20 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${100 - spotsPercentage}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant={event.isRegistered ? "outline" : "brand-secondary"}
                shape="pill"
                className="w-full sm:w-auto"
                onClick={handleRegister}
                disabled={(event.spotsLeft === 0 && !event.isRegistered) || registering || unregistering}
              >
                {event.isRegistered ? (
                  <>
                    <CheckCircle2Icon className="size-4" />
                    Cancel Registration
                  </>
                ) : event.spotsLeft === 0 ? (
                  "Fully Booked"
                ) : (
                  <>
                    <SparklesIcon className="size-4" />
                    Register Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
