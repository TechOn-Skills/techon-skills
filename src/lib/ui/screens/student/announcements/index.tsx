"use client"

import { useState } from "react"
import { ChevronDownIcon, MegaphoneIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"

const ANNOUNCEMENTS = [
  {
    id: "a-1",
    title: "New batch starting soon",
    content:
      "We're launching a new batch for Web Development, Mobile App Development, and Software Engineering. Enroll now to secure your spot. Early enrollees get access to bonus lectures and resources.",
    date: "2026-01-20",
  },
  {
    id: "a-2",
    title: "Assignment-based learning flow",
    content:
      "Your dashboard now supports a complete assignment flow: submit work, get marks, and track your performance. This keeps you accountable and motivated.",
    date: "2026-01-18",
  },
  {
    id: "a-3",
    title: "Portfolio-ready projects",
    content:
      "Every project you build during the course is designed to be portfolio-ready. Focus on clean UI, real workflows (Git, deployments), and outcomes you can show to clients or interviewers.",
    date: "2026-01-15",
  },
  {
    id: "a-4",
    title: "Career support for top performers",
    content:
      "TechOn Skills helps deserving candidates start their careers by connecting them to job opportunities after consistent performance and strong project submissions.",
    date: "2026-01-10",
  },
]

export const StudentAnnouncementsScreen = () => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="w-full py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Announcements</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Latest updates from TechOn Skills
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Stay informed about new batches, features, and course updates.
        </p>
      </div>

      <div className="space-y-4">
        {ANNOUNCEMENTS.map((a) => {
          const isExpanded = expanded.has(a.id)
          return (
            <div
              key={a.id}
              className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px transition-all hover:shadow-lg"
            >
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 shrink-0 items-center justify-center rounded-2xl">
                        <MegaphoneIcon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="text-lg">{a.title}</CardTitle>
                        <div className="text-muted-foreground mt-1 text-xs">{a.date}</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      shape="pill"
                      onClick={() => toggleExpanded(a.id)}
                    >
                      <ChevronDownIcon
                        className={cn("size-4 transition-transform", isExpanded && "rotate-180")}
                      />
                    </Button>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="text-muted-foreground border-border border-t pt-4 text-sm leading-7">
                    {a.content}
                  </CardContent>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
