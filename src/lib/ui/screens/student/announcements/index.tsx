"use client"

import { useState } from "react"
import { BookmarkIcon, ChevronDownIcon, HeartIcon, MegaphoneIcon, SparklesIcon, ThumbsUpIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"
import type { IAnnouncement } from "@/utils/interfaces"

const ANNOUNCEMENTS: IAnnouncement[] = [
  {
    id: "a-1",
    title: "New batch starting soon",
    content:
      "We're launching a new batch for Web Development, Mobile App Development, and Software Engineering. Enroll now to secure your spot. Early enrollees get access to bonus lectures and resources.",
    date: "2026-01-20",
    isNew: true,
    category: "news"
  },
  {
    id: "a-2",
    title: "Assignment-based learning flow",
    content:
      "Your dashboard now supports a complete assignment flow: submit work, get marks, and track your performance. This keeps you accountable and motivated.",
    date: "2026-01-18",
    isNew: true,
    category: "feature"
  },
  {
    id: "a-3",
    title: "Portfolio-ready projects",
    content:
      "Every project you build during the course is designed to be portfolio-ready. Focus on clean UI, real workflows (Git, deployments), and outcomes you can show to clients or interviewers.",
    date: "2026-01-15",
    category: "feature"
  },
  {
    id: "a-4",
    title: "Career support for top performers",
    content:
      "TechOn Skills helps deserving candidates start their careers by connecting them to job opportunities after consistent performance and strong project submissions.",
    date: "2026-01-10",
    category: "opportunity"
  },
]

const categoryConfig = {
  news: { emoji: "📢", color: "text-blue-600 dark:text-blue-400" },
  feature: { emoji: "✨", color: "text-purple-600 dark:text-purple-400" },
  achievement: { emoji: "🏆", color: "text-yellow-600 dark:text-yellow-400" },
  opportunity: { emoji: "🚀", color: "text-green-600 dark:text-green-400" },
}

export const StudentAnnouncementsScreen = () => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())
  const [reactions, setReactions] = useState<Record<string, { likes: number; hearts: number }>>({
    "a-1": { likes: 24, hearts: 18 },
    "a-2": { likes: 32, hearts: 15 },
    "a-3": { likes: 19, hearts: 22 },
    "a-4": { likes: 28, hearts: 31 },
  })
  const [userReactions, setUserReactions] = useState<Record<string, "like" | "heart" | null>>({})

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleReaction = (id: string, type: "like" | "heart") => {
    setUserReactions((prev) => {
      const current = prev[id]
      const next = { ...prev }

      // Remove old reaction
      if (current) {
        setReactions((r) => ({
          ...r,
          [id]: { ...r[id], [current === "like" ? "likes" : "hearts"]: r[id][current === "like" ? "likes" : "hearts"] - 1 }
        }))
      }

      // Add new reaction if different
      if (current !== type) {
        next[id] = type
        setReactions((r) => ({
          ...r,
          [id]: { ...r[id], [type === "like" ? "likes" : "hearts"]: (r[id]?.[type === "like" ? "likes" : "hearts"] || 0) + 1 }
        }))
      } else {
        next[id] = null
      }

      return next
    })
  }

  const newCount = ANNOUNCEMENTS.filter(a => a.isNew).length

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-secondary">Announcements</div>
          {newCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold rounded-full size-5 flex items-center justify-center animate-pulse">
              {newCount}
            </span>
          )}
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Latest updates from TechOn Skills
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Stay connected with platform news, features, and exciting opportunities. Your success journey starts here! 🎯
        </p>
      </div>

      <div className="space-y-4">
        {ANNOUNCEMENTS.map((a, idx) => {
          const isExpanded = expanded.has(a.id)
          const isBookmarked = bookmarked.has(a.id)
          const userReaction = userReactions[a.id]
          const config = categoryConfig[a.category]

          return (
            <div
              key={a.id}
              className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px transition-all hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 shrink-0 items-center justify-center rounded-2xl transition-transform hover:scale-110">
                        <MegaphoneIcon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <CardTitle className="text-lg">{a.title}</CardTitle>
                          {a.isNew && (
                            <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 animate-pulse">
                              NEW
                            </span>
                          )}
                          <span className={cn("text-lg", config.color)}>
                            {config.emoji}
                          </span>
                        </div>
                        <div className="text-muted-foreground text-xs">{a.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        shape="pill"
                        onClick={() => toggleBookmark(a.id)}
                        className={cn(isBookmarked && "text-(--brand-accent)")}
                      >
                        <BookmarkIcon className={cn("size-4", isBookmarked && "fill-current")} />
                      </Button>
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
                  </div>
                </CardHeader>
                {isExpanded && (
                  <>
                    <CardContent className="text-muted-foreground border-border border-t pt-4 pb-4 text-sm leading-7">
                      {a.content}
                    </CardContent>
                    <div className="border-border border-t px-6 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            shape="pill"
                            onClick={() => handleReaction(a.id, "like")}
                            className={cn(
                              "gap-2 transition-all",
                              userReaction === "like" && "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            )}
                          >
                            <ThumbsUpIcon className={cn("size-4", userReaction === "like" && "fill-current")} />
                            <span className="text-xs font-semibold">{reactions[a.id]?.likes || 0}</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            shape="pill"
                            onClick={() => handleReaction(a.id, "heart")}
                            className={cn(
                              "gap-2 transition-all",
                              userReaction === "heart" && "bg-red-500/20 text-red-600 dark:text-red-400"
                            )}
                          >
                            <HeartIcon className={cn("size-4", userReaction === "heart" && "fill-current")} />
                            <span className="text-xs font-semibold">{reactions[a.id]?.hearts || 0}</span>
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isBookmarked && (
                            <span className="flex items-center gap-1">
                              <SparklesIcon className="size-3" />
                              Bookmarked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      {bookmarked.size > 0 && (
        <div className="mt-8 rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6 text-center">
              <BookmarkIcon className="size-8 mx-auto text-(--brand-accent) mb-3" />
              <div className="text-sm text-muted-foreground">
                You have <span className="font-semibold text-foreground">{bookmarked.size}</span> bookmarked announcement{bookmarked.size !== 1 ? "s" : ""} for later
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
