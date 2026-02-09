"use client"

import { ChangeEvent, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2Icon, SparklesIcon, ZapIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Separator } from "@/lib/ui/useable-components/separator"
import { Textarea } from "@/lib/ui/useable-components/textarea"

const COURSE_OPTIONS = [
  "Full‑Stack Web Development",
  "Mobile Application Development",
  "Software Engineering",
  "Ecommerce (Shopify + WordPress + Wix)",
] as const

export const PublicContactScreen = () => {
  const params = useSearchParams()
  const selectedCourse = params.get("course")

  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    message: "",
  })


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const selected = useMemo(() => {
    if (formData.course) return formData.course
    if (selectedCourse) return selectedCourse
    return ""
  }, [formData.course, selectedCourse])

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-144 w-240 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(70,208,255,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-112 w-md rounded-full bg-[radial-gradient(circle_at_center,rgba(255,138,61,0.14),transparent_65%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                <SparklesIcon className="size-3.5 text-(--brand-highlight)" />
                Contact
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Let’s build your roadmap.
              </h1>
              <p className="text-muted-foreground max-w-xl text-pretty text-lg leading-8">
                Tell us your goal and we’ll recommend the fastest course path. If you enroll, you’ll unlock dashboard access
                with assignments + marks.
              </p>
            </div>

            <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick info</CardTitle>
                <CardDescription>We respond quickly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  "Phone: +923144240550",
                  "Email: info@cloudrika.com",
                  "Address: Lahore Punjab Pakistan",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                    <div className="text-muted-foreground leading-7">{t}</div>
                  </div>
                ))}
                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <ZapIcon className="size-4 text-(--brand-accent)" />
                    Pro tip
                  </div>
                  <div className="text-muted-foreground mt-1 leading-7">
                    Pick a course and tell us your current level. We’ll guide your weekly plan and expected outcomes.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.14),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <CardTitle>Send your details</CardTitle>
                <CardDescription>
                  Choose a course, tell us your goal, and we’ll respond with the next steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (formData.email.trim()) {

                    }
                    setSent(true)
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      placeholder="Your name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <Input
                      placeholder="Your email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <select
                    value={selected}
                    onChange={handleChange}
                    name="course"
                    required
                    className="border-input bg-transparent dark:bg-input/30 h-11 w-full rounded-full border px-4 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    <option value="">Select a course</option>
                    {COURSE_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <Textarea
                    placeholder="Tell us your goal (e.g., job in 6 months, freelance clients, ecommerce store)…"
                    className="min-h-44"
                    value={formData.message}
                    onChange={handleChange}
                    name="message"
                  />

                  <Separator />

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-muted-foreground text-sm">
                      {sent
                        ? "Thanks! Message received. You can now continue to dashboard with your email."
                        : "We reply quickly."}
                    </div>
                    <Button variant="brand-secondary" shape="pill" className="h-11 w-fit" type="submit">
                      Send message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

