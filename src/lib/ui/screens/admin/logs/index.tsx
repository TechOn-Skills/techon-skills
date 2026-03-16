"use client"

import { useQuery } from "@apollo/client/react"
import { ActivityIcon, Loader2Icon, LogsIcon } from "lucide-react"

import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { GET_ADMIN_DASHBOARD } from "@/lib/graphql"

type ActivityItem = { id: string; type: string; user: string; action: string; time: string }

const typeLabels: Record<string, string> = {
  payment: "Payment",
  enrollment: "Enrollment",
  assignment: "Assignment",
  support: "Support",
}

export const AdminLogsScreen = () => {
  const { data, loading, error } = useQuery<{ getAdminDashboard: { recentActivity: ActivityItem[] } }>(GET_ADMIN_DASHBOARD)
  const activity = data?.getAdminDashboard?.recentActivity ?? []

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Activity Logs</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Recent platform activity. Full audit trail with search and filters can be added later.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-destructive">Failed to load activity.</p>
        </div>
      ) : (
        <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y">
              {activity.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <LogsIcon className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity.</p>
                </div>
              ) : (
                activity.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-4 p-4 transition-colors hover:bg-muted-surface/20"
                  >
                    <div className="bg-(--brand-primary)/10 text-(--brand-primary) size-10 rounded-xl flex items-center justify-center shrink-0">
                      <ActivityIcon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{a.user}</span>
                        {" "}{a.action}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1 flex items-center gap-2">
                        <span className="rounded-full bg-muted-surface px-2 py-0.5 text-xs text-muted-foreground">
                          {typeLabels[a.type] ?? a.type}
                        </span>
                        {a.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
