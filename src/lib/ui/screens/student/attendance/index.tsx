"use client"

import { useQuery } from "@apollo/client/react"
import { Loader2Icon, UserCheckIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { ProgressRing } from "@/lib/ui/useable-components/progress-ring"
import { GET_MY_ATTENDANCE_SUMMARIES } from "@/lib/graphql"
import { useUser } from "@/lib/providers/user"
import { cn } from "@/lib/helpers"

const MIN_FOR_CERTIFICATE = 80

export const StudentAttendanceScreen = () => {
  const { userProfileInfo } = useUser()
  const { data, loading, error } = useQuery<{
    getMyAttendanceSummaries: Array<{
      courseId: string
      courseTitle: string | null
      courseSlug: string | null
      sessionsTaken: number
      presentCount: number
      percentage: number | null
    }>
  }>(GET_MY_ATTENDANCE_SUMMARIES, { skip: !userProfileInfo?.id, fetchPolicy: "network-only" })

  const summaries = data?.getMyAttendanceSummaries ?? []

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Attendance</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Your lecture attendance by course. At least {MIN_FOR_CERTIFICATE}% is required to receive a certificate.
        </p>
      </div>

      {loading ? (
        <div className="text-muted-foreground flex items-center justify-center gap-2 py-20">
          <Loader2Icon className="size-6 animate-spin" />
          Loading attendance…
        </div>
      ) : error ? (
        <p className="text-destructive text-sm">Could not load attendance. Please refresh and try again.</p>
      ) : summaries.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center">
            <UserCheckIcon className="size-12 opacity-40" />
            <p>No enrolled courses yet. Attendance will appear here after you enroll and lectures are marked.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {summaries.map((s) => {
            const pct = s.percentage
            const eligible = pct != null && pct >= MIN_FOR_CERTIFICATE
            return (
              <Card key={s.courseId} className="rounded-3xl">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div className="min-w-0 pr-3">
                    <CardTitle className="text-lg">{s.courseTitle ?? "Course"}</CardTitle>
                    <CardDescription className="text-xs">
                      {s.sessionsTaken === 0
                        ? "No lectures marked yet"
                        : `${s.presentCount} of ${s.sessionsTaken} sessions counted (present, late, or excused)`}
                    </CardDescription>
                    <p
                      className={cn(
                        "mt-2 text-xs font-medium",
                        s.sessionsTaken === 0
                          ? "text-muted-foreground"
                          : eligible
                            ? "text-green-700"
                            : "text-amber-700"
                      )}
                    >
                      {s.sessionsTaken === 0
                        ? "Percentage starts after your instructor marks a lecture"
                        : eligible
                          ? "Meets the 80% certificate requirement"
                          : "Below 80% — certificate not eligible yet"}
                    </p>
                  </div>
                  <ProgressRing value={pct ?? 0} size={56} strokeWidth={4}>
                    <span className="text-xs font-bold">{pct != null ? `${pct}%` : "—"}</span>
                  </ProgressRing>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
