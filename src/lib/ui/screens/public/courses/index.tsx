"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRightIcon,
  BriefcaseIcon,
  FileCheck2Icon,
  SearchIcon,
  SparklesIcon,
  TrophyIcon,
} from "lucide-react"

import { useCourses } from "@/lib/providers/courses"
import { formatCourseDuration, formatCoursePrice } from "@/lib/helpers"
import { Button } from "@/lib/ui/useable-components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Icons } from "@/utils/constants"
import { COURSE_DISPLAY_BY_SLUG } from "@/utils/constants/course-display"

export const PublicCoursesScreen = () => {
  const { courses } = useCourses()
  const [searchQuery, setSearchQuery] = useState("")
  const catalog = useMemo(
    () =>
      courses.map((course) => {
        const display = COURSE_DISPLAY_BY_SLUG[course.slug]
        const projects = course.modules[0]?.projects ?? []
        return {
          slug: course.slug,
          title: course.title,
          description: course.subtitle,
          price: formatCoursePrice(course),
          duration: formatCourseDuration(course),
          icon: Icons[display?.icon ?? "code"] ?? Icons.code,
          highlight: display?.highlight,
          benefits: display?.benefits?.length ? display.benefits : projects.map((p) => p.title).slice(0, 3),
        }
      }),
    [courses]
  )

  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return catalog

    const query = searchQuery.toLowerCase().trim()

    return catalog.filter((course) => {
      // Search in title
      if (course.title.toLowerCase().includes(query)) return true

      // Search in description
      if (course.description.toLowerCase().includes(query)) return true

      // Search in duration
      if (course.duration.toLowerCase().includes(query)) return true

      // Search in price
      if (course.price.toLowerCase().includes(query)) return true

      // Search in highlight
      if (course.highlight?.toLowerCase().includes(query)) return true

      // Search in benefits
      if (course.benefits.some((benefit) => benefit.toLowerCase().includes(query))) return true

      return false
    })
  }, [searchQuery, catalog])

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-secondary">Courses</div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose a course and start building.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
            Every course includes lectures, assignments, a submission flow, marks tracking, and career support for high-performing students.
          </p>
        </div>

        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search courses, skills, or benefits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredCatalog.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl border bg-background/70 backdrop-blur">
            <div className="text-center">
              <SearchIcon className="mx-auto size-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Try adjusting your search to find what you&apos;re looking for.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredCatalog.map((c) => (
              <div
                key={c.slug}
                className="group rounded-3xl bg-[linear-gradient(135deg,rgba(79,195,232,0.35),rgba(242,140,40,0.20),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
                  <div className="pointer-events-none relative h-1.5 w-full bg-[linear-gradient(to_right,rgba(79,195,232,0.7),rgba(242,140,40,0.6))] opacity-70 transition-opacity group-hover:opacity-100" />
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(70,208,255,0.35),transparent_60%)] opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                        <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-12 items-center justify-center rounded-3xl transition-transform duration-300 group-hover:scale-[1.03]">
                          <c.icon className="size-5" />
                        </span>
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-xl">{c.title}</CardTitle>
                        <CardDescription className="text-sm leading-6">{c.description}</CardDescription>
                        <div className="text-muted-foreground mt-2 text-xs">
                          Duration: <span className="font-semibold">{c.duration}</span>
                        </div>
                      </div>
                      {!!c.highlight && (
                        <span className="bg-(--brand-secondary) text-(--text-on-dark) ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                          <SparklesIcon className="size-3.5" />
                          {c.highlight}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border bg-background/45 p-3">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <TrophyIcon className="size-4 text-(--brand-highlight)" />
                          Outcomes
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          {c.benefits.map((b) => (
                            <div key={b} className="flex items-start gap-2">
                              <FileCheck2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                              <div className="text-muted-foreground leading-6">{b}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-background/45 p-3">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <BriefcaseIcon className="size-4 text-(--brand-accent)" />
                          Built for careers
                        </div>
                        <div className="text-muted-foreground mt-2 text-sm leading-6">
                          Assignments + marks keep you accountable. Top performers get career support to start strong.
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-3xl font-semibold tracking-tight">{c.price}</div>
                      <div className="text-muted-foreground text-xs">
                        Designed to upgrade you fast — projects, discipline, and outcomes.
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" shape="pill">
                        <Link href={`/courses/${c.slug}`}>View details</Link>
                      </Button>
                      <Button asChild variant="brand-secondary" shape="pill" className="shrink-0">
                        <Link href={`/contact?course=${encodeURIComponent(c.slug)}`}>
                          Enroll now
                          <ArrowRightIcon className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

