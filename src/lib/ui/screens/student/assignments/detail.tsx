"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon, CheckCircle2Icon, SaveIcon, SparklesIcon, TrophyIcon, ZapIcon } from "lucide-react"

import { STUDENT_ASSIGNMENTS } from "@/lib/data/student-assignments"
import { useLocalStorageItem } from "@/lib/hooks/use-local-storage"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Separator } from "@/lib/ui/useable-components/separator"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { cn } from "@/lib/helpers"

type Submission = {
  text: string
  submittedAt: string
  marks?: number
}

function storageKey(id: string) {
  return `student_assignment_submission:${id}`
}

const motivationalQuotes = [
  "Code is poetry written in logic. Keep writing! ✨",
  "Every bug you fix makes you stronger. You've got this! 💪",
  "Great developers are made through practice, not perfection. 🚀",
  "Your future self will thank you for the work you do today. 🌟",
  "Learning to code is learning to create. Keep building! 🎨",
]

export const StudentAssignmentDetailScreen = ({ assignmentId }: { assignmentId: string }) => {
  const assignment = useMemo(
    () => STUDENT_ASSIGNMENTS.find((a) => a.id === assignmentId),
    [assignmentId]
  )

  const key = storageKey(assignmentId)
  const { value: raw, setValue } = useLocalStorageItem(key)
  const saved = useMemo(() => (raw ? (JSON.parse(raw) as Submission) : null), [raw])
  const [text, setText] = useState(() => saved?.text ?? "")
  const [showConfetti, setShowConfetti] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | null>(null)
  const [randomQuote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])

  // Auto-save draft
  useEffect(() => {
    if (!text.trim() || text === saved?.text) return
    
    setAutoSaveStatus("saving")
    const timer = setTimeout(() => {
      setAutoSaveStatus("saved")
      setTimeout(() => setAutoSaveStatus(null), 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [text, saved?.text])

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  if (!assignment) {
    return (
      <div className="w-full py-10">
        <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
          <CardHeader>
            <CardTitle>Assignment not found</CardTitle>
            <CardDescription>Go back to your assignments list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" shape="pill">
              <Link href="/student/assignments">
                <ArrowLeftIcon className="size-4" />
                Back
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = () => {
    const next: Submission = {
      text,
      submittedAt: new Date().toISOString(),
      marks: saved?.marks ?? Math.floor(60 + Math.random() * 40),
    }
    setValue(JSON.stringify(next))
    setShowConfetti(true)
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const charCount = text.length
  const progressPercentage = Math.min(100, (wordCount / 100) * 100) // Assume 100 words is good progress

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-in fade-in zoom-in duration-1000"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 30}ms`,
              }}
            >
              {["🎉", "🌟", "✨", "🎊", "🏆", "🚀"][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button asChild variant="ghost" shape="pill">
          <Link href="/student/assignments">
            <ArrowLeftIcon className="size-4" />
            Back to Assignments
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {autoSaveStatus && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in duration-300">
              {autoSaveStatus === "saving" ? (
                <>
                  <SaveIcon className="size-3 animate-pulse" />
                  Saving draft...
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="size-3 text-green-500" />
                  Draft saved
                </>
              )}
            </div>
          )}
          {typeof saved?.marks === "number" && (
            <div className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
              saved.marks >= 90 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
              saved.marks >= 80 ? "bg-green-500/20 text-green-600 dark:text-green-400" :
              saved.marks >= 70 ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" :
              "bg-purple-500/20 text-purple-600 dark:text-purple-400"
            )}>
              <TrophyIcon className="size-4" />
              {saved.marks}/100
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription>
                  {assignment.course} • Due {assignment.dueDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="text-sm font-semibold">📋 Brief</div>
                  <div className="text-muted-foreground text-sm leading-7 bg-background/40 rounded-2xl p-4">
                    {assignment.brief}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold">✅ Requirements</div>
                  <ul className="space-y-2">
                    {assignment.requirements.map((r, idx) => (
                      <li key={r} className="flex items-start gap-3 bg-background/40 rounded-2xl p-3 animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                        <CheckCircle2Icon className="size-5 text-(--brand-primary) shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">💻 Your Submission</div>
                    <div className="text-xs text-muted-foreground">
                      {wordCount} words • {charCount} characters
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Write detailed explanations, share your approach, and showcase your understanding.
                  </div>
                  
                  {/* Progress Bar */}
                  {wordCount > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Writing Progress</span>
                        <span className="font-semibold">{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-background/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-(--brand-primary) to-(--brand-accent) transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-64 font-mono transition-all focus:ring-2 focus:ring-(--brand-primary)"
                    placeholder="Start typing your solution here...

Example:
- What approach did you take?
- What challenges did you face?
- How did you solve them?
- What did you learn?"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-background/40 rounded-2xl p-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {saved?.submittedAt 
                        ? `✅ Last submitted: ${new Date(saved.submittedAt).toLocaleString()}`
                        : "📝 Not submitted yet"}
                    </div>
                    {saved && !saved.marks && (
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        ⏳ Your submission is being reviewed...
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="brand-secondary"
                    shape="pill"
                    className="w-full sm:w-fit"
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                  >
                    <SparklesIcon className="size-4" />
                    {saved ? "Resubmit" : "Submit Assignment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Celebration Card (shown after grading) */}
          {typeof saved?.marks === "number" && (
            <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">
                    {saved.marks >= 90 ? "🌟" : saved.marks >= 80 ? "🎯" : saved.marks >= 70 ? "✨" : "👍"}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {saved.marks >= 90 ? "Outstanding Work!" : 
                     saved.marks >= 80 ? "Great Job!" : 
                     saved.marks >= 70 ? "Well Done!" : 
                     "Good Effort!"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto leading-7">
                    {saved.marks >= 90 
                      ? "You're crushing it! This is exceptional work. Keep this momentum going!"
                      : saved.marks >= 70
                      ? "Solid work! You're on the right track. Every assignment makes you better!"
                      : "Keep pushing! Learning is a journey. Your next submission will be even better!"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tips Card */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ZapIcon className="size-5 text-(--brand-accent)" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="bg-background/40 rounded-2xl p-3">
                  <div className="font-semibold mb-1">💡 Be Specific</div>
                  <div className="text-muted-foreground text-xs">Explain your thought process and decisions.</div>
                </div>
                <div className="bg-background/40 rounded-2xl p-3">
                  <div className="font-semibold mb-1">🔍 Show Details</div>
                  <div className="text-muted-foreground text-xs">Include code snippets and examples.</div>
                </div>
                <div className="bg-background/40 rounded-2xl p-3">
                  <div className="font-semibold mb-1">🎯 Answer Fully</div>
                  <div className="text-muted-foreground text-xs">Address all requirements completely.</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Motivational Quote */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <SparklesIcon className="size-8 mx-auto text-(--brand-accent)" />
                  <p className="text-sm leading-7 text-muted-foreground italic">
                    &quot;{randomQuote}&quot;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

