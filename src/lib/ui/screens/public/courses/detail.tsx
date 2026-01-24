"use client"

import Link from "next/link"
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react"

import { getPublicCourse } from "@/lib/data/public-courses"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Separator } from "@/lib/ui/useable-components/separator"

export const PublicCourseDetailScreen = ({ slug }: { slug: string }) => {
  const course = getPublicCourse(slug)

  if (!course) {
    return (
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mx-auto max-w-4xl">
          <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
            <CardHeader>
              <CardTitle>Course not found</CardTitle>
              <CardDescription>Go back to courses.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="brand-secondary" shape="pill">
                <Link href="/courses">View all courses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className={`border-border/60 ${course.heroGradient} relative border-b`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_60%)]" />
        <div className="px-4 py-14 sm:px-6 lg:px-8 2xl:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-xs font-semibold">
                  <CheckCircle2Icon className="size-4 text-(--brand-highlight)" />
                  {course.duration} • {course.price}
                </div>
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  {course.title}
                </h1>
                <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
                  {course.subtitle}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="xl" shape="pill" variant="brand-secondary">
                    <Link href={`/contact?course=${encodeURIComponent(course.title)}`}>
                      Enroll now
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="xl" shape="pill">
                    <Link href="/courses">Back to courses</Link>
                  </Button>
                </div>

                <div className="text-muted-foreground text-sm leading-7">
                  TechOn Skills offers **job opportunities to deserving candidates** who show consistent performance,
                  strong projects, and discipline during the course journey.
                </div>
              </div>

              <Card className="bg-background/55 backdrop-blur supports-backdrop-filter:bg-background/45">
                <CardHeader>
                  <CardTitle>What you’ll become</CardTitle>
                  <CardDescription>
                    A confident builder with real projects and a structured submission + marks flow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    "Build portfolio-worthy projects",
                    "Submit assignments and get marks",
                    "Learn industry workflows (Git, deployments, clean code)",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2">
                      <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                      <div>{t}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-secondary">Curriculum</div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              A smooth, step-by-step learning journey
            </h2>
            <p className="text-muted-foreground max-w-3xl text-pretty">
              Each phase is designed to keep you moving forward: clear concepts, practical practice, and meaningful outcomes.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {course.sections.map((s) => (
              <Card key={s.title} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 items-center justify-center rounded-2xl">
                      <s.icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="text-base">{s.title}</CardTitle>
                      <CardDescription className="text-xs leading-6">{s.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border bg-background/40 p-4 text-sm">
                    <div className="text-muted-foreground leading-7">
                      Learn → practice → submit → marks. This is how you lock in skills fast.
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="text-lg font-semibold">Ready to start?</div>
              <div className="text-muted-foreground text-sm">
                Send your details and we’ll guide you to enrollment.
              </div>
            </div>
            <Button asChild size="xl" shape="pill" variant="brand-secondary">
              <Link href={`/contact?course=${encodeURIComponent(course.title)}`}>
                Enroll now
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

