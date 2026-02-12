"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  GraduationCapIcon,
  ListChecksIcon,
  RocketIcon,
  SparklesIcon,
  TrophyIcon,
} from "lucide-react"

import { useCourses } from "@/lib/providers/courses"
import { formatCourseDuration, formatCoursePrice } from "@/lib/helpers"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Separator } from "@/lib/ui/useable-components/separator"
import { TechLogoCard } from "@/lib/ui/useable-components/tech-logos"
import { techIdFromLabel } from "@/lib/helpers"
import { COURSE_DETAIL, HERO_GRADIENT_CLASS } from "@/utils/constants/course-detail"
import { CONFIG } from "@/utils/constants/config"

const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: RocketIcon,
  "graduation-cap": GraduationCapIcon,
  "clipboard-list": ClipboardListIcon,
  "list-checks": ListChecksIcon,
  trophy: TrophyIcon,
}

export const PublicCourseDetailScreen = ({ slug }: { slug: string }) => {
  const { getCourseBySlug } = useCourses()
  const course = getCourseBySlug(slug)

  if (!course) {
    const { notFound } = COURSE_DETAIL
    return (
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mx-auto max-w-4xl">
          <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
            <CardHeader>
              <CardTitle>{notFound.title}</CardTitle>
              <CardDescription>{notFound.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="brand-secondary" shape="pill">
                <Link href={CONFIG.ROUTES.PUBLIC.COURSES}>{notFound.backLabel}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { hero, articleSection, steps: stepsSection, infoCard, cta } = COURSE_DETAIL

  return (
    <div className="w-full">
      <div className={`border-border/60 ${HERO_GRADIENT_CLASS} relative border-b`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35),transparent_60%)]" />
        <div className="px-4 py-14 sm:px-6 lg:px-8 2xl:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-xs font-semibold">
                  <CheckCircle2Icon className="size-4 text-(--brand-highlight)" />
                  {formatCourseDuration(course)} • {formatCoursePrice(course)}
                </div>
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  {course.title}
                </h1>
                <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
                  {course.subtitle}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="xl" shape="pill" variant="brand-secondary">
                    <Link href={`${CONFIG.ROUTES.PUBLIC.CONTACT}?course=${encodeURIComponent(course.slug)}`}>
                      {hero.enrollLabel}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="xl" shape="pill">
                    <Link href={CONFIG.ROUTES.PUBLIC.COURSES}>{hero.backToCoursesLabel}</Link>
                  </Button>
                </div>

                <div className="text-muted-foreground text-sm leading-7">
                  {hero.careerNote}
                </div>
              </div>

              <Card className="bg-background/55 backdrop-blur supports-backdrop-filter:bg-background/45">
                <CardHeader>
                  <CardTitle>{hero.cardTitle}</CardTitle>
                  <CardDescription>{hero.cardDescription}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {hero.bullets.map((t) => (
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
          {course.articleFeatures.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <SparklesIcon className="size-3.5 text-(--brand-highlight)" />
                  {articleSection.badgeLabel}
                </div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {articleSection.heading}
                </h2>
                <p className="text-muted-foreground max-w-3xl text-pretty">
                  {articleSection.subtext}
                </p>
              </div>

              <div className="space-y-16">
                {course.articleFeatures.map((feature, idx) => (
                  <div
                    key={feature.name}
                    className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center"
                  >
                    <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                      <div className="relative overflow-hidden rounded-2xl">
                        <div className="aspect-4/3 w-full overflow-hidden rounded-2xl border bg-muted/50 shadow-lg">
                          <Image
                            src={feature.image}
                            alt=""
                            width={800}
                            height={600}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/40" />
                      </div>
                    </div>
                    <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                          {feature.name}
                        </h3>
                        <p className="text-muted-foreground leading-7">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="space-y-2">
            <div className="text-sm font-semibold text-secondary">Technologies</div>
            <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {course.technologiesSection.title}
            </h3>
            <p className="text-muted-foreground max-w-3xl text-pretty">
              {course.technologiesSection.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {course.technologiesSection.technologies.map((t, idx) => (
              <TechLogoCard
                key={t.label}
                id={techIdFromLabel(t.label)}
                label={t.label}
                delayMs={idx * 80}
              />
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-secondary">{stepsSection.label}</div>
            <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {stepsSection.heading}
            </h3>
            <p className="text-muted-foreground max-w-3xl text-pretty">
              {stepsSection.subtext}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {stepsSection.items.map((s) => {
              const StepIcon = STEP_ICONS[s.iconKey] ?? RocketIcon
              return (
                <Card
                  key={s.title}
                  className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50"
                >
                  <CardHeader className="space-y-3">
                    <div className="bg-background/40 relative overflow-hidden rounded-2xl border p-4">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(70,208,255,0.22),transparent_60%)]" />
                      <div className="relative flex items-center gap-2">
                        <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-9 items-center justify-center rounded-xl">
                          <StepIcon className="size-4" />
                        </span>
                        <div className="text-sm font-semibold">{s.title}</div>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-7">{s.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>

          <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
            <CardContent className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
              {infoCard.items.map((item) => (
                <div key={item.key} className="rounded-2xl border bg-background/40 p-5">
                  <div className="text-muted-foreground text-xs">{item.label}</div>
                  <div className="mt-1 text-xl font-semibold">{item.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="text-lg font-semibold">{cta.heading}</div>
              <div className="text-muted-foreground text-sm">{cta.subtext}</div>
            </div>
            <Button asChild size="xl" shape="pill" variant="brand-secondary">
              <Link href={`${CONFIG.ROUTES.PUBLIC.CONTACT}?course=${encodeURIComponent(course.slug)}`}>
                {cta.buttonLabel}
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

