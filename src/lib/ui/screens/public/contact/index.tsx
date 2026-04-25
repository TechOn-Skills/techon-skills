"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2Icon, SparklesIcon, ZapIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { useCourses } from "@/lib/providers/courses"
import { SimpleContactForm } from "@/lib/ui/screens/public/shared/simple-contact-form"
import Link from "next/link"
import { CONFIG, SITE_PHONE_DISPLAY } from "@/utils/constants"

export const PublicContactScreen = () => {
  const params = useSearchParams()
  const { getCourseBySlug } = useCourses()
  const selectedCourseFromUrl = params.get("course")
  const initialCourse = selectedCourseFromUrl ? getCourseBySlug(selectedCourseFromUrl) : null

  const [sent, setSent] = useState(false)
  const initialValuesKey = initialCourse?.slug ?? "none"

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
                {"Let's build your roadmap."}
              </h1>
              <p className="text-muted-foreground max-w-xl text-pretty text-lg leading-8">
                {"Tell us your goal and we'll recommend the fastest course path. If you enroll, you'll unlock dashboard access with assignments + marks."}
              </p>
            </div>

            <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick info</CardTitle>
                <CardDescription>We respond quickly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  `Phone: ${SITE_PHONE_DISPLAY}`,
                  "Email: info@cloudrika.com",
                  "Address: 8th Floor, Office No. 812, Al Hafeez Executive Towers, Gulberg II, Firdous Market, Lahore, Punjab, Pakistan",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                    <div className="text-muted-foreground leading-7">{t}</div>
                  </div>
                ))}
                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <ZapIcon className="size-4 text-accent" />
                    Pro tip
                  </div>
                  <div className="text-muted-foreground mt-1 leading-7">
                    {"Pick a course and tell us your current level. We'll guide your weekly plan and expected outcomes."}
                  </div>
                </div>
                <Button asChild variant="brand-secondary" shape="pill" className="w-full">
                  <Link href={CONFIG.ROUTES.PUBLIC.ENROLLMENT}>
                    Ready to pay and enroll? Go to enrollment
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.14),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl" key={initialValuesKey}>
              <CardHeader>
                <CardTitle>Send your details</CardTitle>
                <CardDescription>
                  {"Choose a course, tell us your goal, and we'll respond with the next steps."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SimpleContactForm
                  initialCourse={initialCourse ? { slug: initialCourse.slug, title: initialCourse.title } : null}
                  sent={sent}
                  onSuccess={() => setSent(true)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
