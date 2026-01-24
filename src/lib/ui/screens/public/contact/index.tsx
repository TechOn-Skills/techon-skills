"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Separator } from "@/lib/ui/useable-components/separator"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { ENROLLED_EMAIL_KEY } from "@/lib/ui/useable-components/continue-dashboard-dialog"

export const PublicContactScreen = () => {
  const params = useSearchParams()
  const selectedCourse = params.get("course")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const computedSubject = useMemo(() => {
    if (subject.trim()) return subject
    if (selectedCourse) return `Enroll: ${selectedCourse}`
    return ""
  }, [selectedCourse, subject])

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="mx-auto max-w-3xl">
        <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>
              Call: +923144240550 — Email: info@techonskills.cloudrika.com — Lahore Punjab Pakistan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                // lightweight "enrollment" marker for demo flow:
                // if user is contacting to enroll, we allow dashboard magic-link flow for this email.
                if (email.trim()) {
                  localStorage.setItem(ENROLLED_EMAIL_KEY, email.trim())
                }
                setSent(true)
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Input
                placeholder="Subject"
                value={computedSubject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                placeholder="Message"
                className="min-h-40"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Separator />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-muted-foreground text-sm">
                  {sent ? "Thanks! We received your message. You can now continue to dashboard with your email." : "We reply quickly."}
                </div>
                <Button variant="brand-secondary" shape="pill" className="w-fit" type="submit">
                  Send message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

