"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { Loader2Icon, PlayCircleIcon, VideoIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { RecordingPlayerDialog } from "@/lib/ui/useable-components/recording-player"
import { formatDuration } from "@/lib/ui/screens/admin/recordings"
import { GET_MY_RECORDINGS } from "@/lib/graphql"
import { formatDate } from "@/lib/helpers"
import { useUser } from "@/lib/providers/user"

type RecordingItem = {
  id: string
  courseId: string
  course?: { id: string; title: string } | null
  title: string
  description: string
  recordedAt: string
  durationSeconds: number | null
}

export const StudentRecordingsScreen = () => {
  const { userProfileInfo, enrolledCoursesFromApi } = useUser()
  const [courseFilter, setCourseFilter] = useState("all")
  const [playing, setPlaying] = useState<RecordingItem | null>(null)

  const { data, loading, error } = useQuery<{ getMyRecordings: RecordingItem[] }>(GET_MY_RECORDINGS, {
    variables: { courseId: courseFilter === "all" ? null : courseFilter },
    skip: !userProfileInfo?.id,
    fetchPolicy: "network-only",
  })
  const recordings = useMemo(() => data?.getMyRecordings ?? [], [data])

  const grouped = useMemo(() => {
    const map = new Map<string, { title: string; items: RecordingItem[] }>()
    for (const r of recordings) {
      const key = r.courseId
      if (!map.has(key)) map.set(key, { title: r.course?.title ?? "Course", items: [] })
      map.get(key)!.items.push(r)
    }
    return [...map.values()]
  }, [recordings])

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Lecture recordings</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Watch past lectures of your enrolled courses.
          </p>
        </div>
        {enrolledCoursesFromApi.length > 1 && (
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border-input bg-background h-10 rounded-full border px-4 text-sm"
          >
            <option value="all">All courses</option>
            {enrolledCoursesFromApi.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading recordings...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-destructive">{error.message}</div>
      ) : recordings.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <VideoIcon className="size-12 mx-auto mb-4 opacity-50" />
          <p>No recordings yet. They&apos;ll appear here after your lectures.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.title}>
              <h2 className="mb-3 text-lg font-semibold">{group.title}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((r) => (
                  <Card
                    key={r.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setPlaying(r)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPlaying(r)}
                    className="group cursor-pointer rounded-3xl bg-background/70 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base leading-snug">{r.title}</CardTitle>
                        <PlayCircleIcon className="text-(--brand-primary) size-7 shrink-0 transition group-hover:scale-110" />
                      </div>
                      <CardDescription className="text-xs">
                        {formatDate(r.recordedAt)} · {formatDuration(r.durationSeconds)}
                      </CardDescription>
                    </CardHeader>
                    {r.description && (
                      <CardContent className="pt-0 text-sm text-muted-foreground line-clamp-3">{r.description}</CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <RecordingPlayerDialog recordingId={playing?.id ?? null} title={playing?.title ?? ""} onClose={() => setPlaying(null)} />
    </div>
  )
}
