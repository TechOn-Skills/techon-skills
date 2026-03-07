"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  CalendarIcon,
  ClockIcon,
  Loader2Icon,
  MapPinIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
  VideoIcon,
  FilterIcon,
  CheckCircle2Icon
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"
import { GET_EVENTS, REGISTER_FOR_EVENT, UNREGISTER_FROM_EVENT } from "@/lib/graphql"
import type { IEvent } from "@/utils/interfaces"
import { EVENT_TYPE_CONFIG } from "@/utils/constants"

type EventApi = { id: string; title: string; description: string; type: IEvent["type"]; date: string; time: string; duration: string; location: string; isOnline: boolean; totalSpots: number; spotsLeft: number; isRegistered: boolean; tags: string[]; instructor?: string | null }

export const StudentEventsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState<"all" | IEvent["type"]>("all")
  const { data, loading, error, refetch } = useQuery<{ getEvents: EventApi[] }>(GET_EVENTS)
  const [registerForEvent, { loading: registering }] = useMutation(REGISTER_FOR_EVENT, { onCompleted: () => { refetch(); toast.success("Registered for event"); }, onError: (e) => toast.error(e.message) })
  const [unregisterFromEvent, { loading: unregistering }] = useMutation(UNREGISTER_FROM_EVENT, { onCompleted: () => { refetch(); toast.success("Registration cancelled"); }, onError: (e) => toast.error(e.message) })

  const events = data?.getEvents ?? []
  const filteredEvents = useMemo(() => {
    if (selectedFilter === "all") return events
    return events.filter(e => e.type === selectedFilter)
  }, [events, selectedFilter])

  const handleRegister = (eventId: string, isRegistered: boolean) => {
    if (isRegistered) unregisterFromEvent({ variables: { eventId } })
    else registerForEvent({ variables: { eventId } })
  }

  const filters = [
    { value: "all" as const, label: "All Events" },
    { value: "workshop" as const, label: "Workshops" },
    { value: "webinar" as const, label: "Webinars" },
    { value: "hackathon" as const, label: "Hackathons" },
    { value: "networking" as const, label: "Networking" },
    { value: "career" as const, label: "Career" },
  ]

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Events & Workshops</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Level up your skills
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Join workshops, webinars, and networking events to accelerate your learning journey. Connect with peers, learn from experts, and build your career.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <FilterIcon className="size-4 text-muted-foreground shrink-0" />
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all",
              selectedFilter === filter.value
                ? "bg-(--brand-primary) text-(--text-on-dark) shadow-lg"
                : "bg-background/70 border hover:bg-background/90 hover:border-(--brand-primary)"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Upcoming Events</div>
                  <div className="text-3xl font-semibold tracking-tight">{events.length}</div>
                </div>
                <div className="bg-(--brand-primary) text-(--text-on-dark) size-12 rounded-2xl flex items-center justify-center">
                  <CalendarIcon className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Your Registrations</div>
                  <div className="text-3xl font-semibold tracking-tight">{events.filter(e => e.isRegistered).length}</div>
                </div>
                <div className="bg-(--brand-primary) text-(--text-on-dark) size-12 rounded-2xl flex items-center justify-center">
                  <CheckCircle2Icon className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Available Spots</div>
                  <div className="text-3xl font-semibold tracking-tight">
                    {events.reduce((sum, e) => sum + e.spotsLeft, 0)}
                  </div>
                </div>
                <div className="bg-(--brand-primary) text-(--text-on-dark) size-12 rounded-2xl flex items-center justify-center">
                  <UsersIcon className="size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading events...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-destructive">Failed to load events. Please try again.</p>
        </div>
      ) : (
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredEvents.map((event, idx) => {
          const isRegistered = event.isRegistered
          const typeConfig = EVENT_TYPE_CONFIG[event.type] ?? { label: event.type, color: "bg-gray-500/20 text-gray-600" }
          const spotsPercentage = event.totalSpots > 0 ? (event.spotsLeft / event.totalSpots) * 100 : 0

          return (
            <div
              key={event.id}
              className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden h-full">
                <div className="relative h-1.5 w-full bg-[linear-gradient(to_right,rgba(70,208,255,0.75),rgba(255,138,61,0.6))] opacity-70" />

                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", typeConfig.color)}>
                          {typeConfig.label}
                        </span>
                        {isRegistered && (
                          <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
                            <CheckCircle2Icon className="size-3" />
                            Registered
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="text-sm leading-6 mt-2">
                        {event.description}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(event.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-background/60 border rounded-full px-3 py-1 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-background/40 p-3 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <CalendarIcon className="size-3.5" />
                        Date & Time
                      </div>
                      <div className="font-semibold text-sm">{event.date}</div>
                      <div className="text-muted-foreground text-xs">{event.time} • {event.duration}</div>
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-3 transition-all hover:bg-background/60">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        {event.isOnline ? <VideoIcon className="size-3.5" /> : <MapPinIcon className="size-3.5" />}
                        Location
                      </div>
                      <div className="font-semibold text-sm">{event.isOnline ? "Online" : "On Campus"}</div>
                      <div className="text-muted-foreground text-xs truncate">{event.location}</div>
                    </div>
                  </div>

                  {event.instructor && (
                    <div className="rounded-2xl border bg-background/40 p-3">
                      <div className="text-muted-foreground text-xs mb-1">Instructor</div>
                      <div className="font-semibold text-sm">{event.instructor}</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Spots Available</span>
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
                    type="button"
                    variant={isRegistered ? "outline" : "brand-secondary"}
                    shape="pill"
                    className="w-full"
                    onClick={() => handleRegister(event.id, isRegistered)}
                    disabled={(event.spotsLeft === 0 && !isRegistered) || registering || unregistering}
                  >
                    {isRegistered ? (
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
          )
        })}
      </div>
      )}

      {/* Motivational Footer */}
      <div className="mt-10 rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px">
        <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
          <CardContent className="p-8 text-center">
            <TrophyIcon className="size-12 mx-auto text-(--brand-accent) mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Grow Beyond the Classroom</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-7">
              Events and workshops are your opportunity to network, learn from industry experts, and showcase your skills.
              Every event you attend is an investment in your future career. Don&apos;t miss out!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
