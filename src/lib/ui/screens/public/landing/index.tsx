"use client"
import Link from "next/link"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  ArrowRightIcon,
  AwardIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  CodeIcon,
  FileCheck2Icon,
  GraduationCapIcon,
  MessageCircleIcon,
  SparklesIcon,
  SmartphoneIcon,
  StarsIcon,
  StoreIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { EnrollmentFormCard } from "@/lib/ui/screens/public/enrollment/enrollment-form-card"
import { SimpleContactForm } from "@/lib/ui/screens/public/shared/simple-contact-form"
import { cn, logger } from "@/lib/helpers"
import { useCourses } from "@/lib/providers/courses"
import { CONFIG } from "@/utils/constants"
import { LoggerLevel } from "@/utils/enums"
import { COURSE_DISPLAY_BY_SLUG } from "@/utils/constants/course-display"

const CONTACT_MODAL_SHOWN_KEY = "techon_contact_modal_shown"

const FEATURED_COURSE_ICONS: Record<string, typeof CodeIcon> = {
  code: CodeIcon,
  smartphone: SmartphoneIcon,
  wrench: WrenchIcon,
  store: StoreIcon,
}

/** Per-course visual identity: gradient meshes + icon wells (landing featured grid). */
const FEATURED_CARD_PALETTES = [
  {
    iconBg: "bg-gradient-to-br from-[#4fc3e8] via-[#2a9fd4] to-[#135a8c]",
    iconShadow: "shadow-[0_12px_40px_-8px_rgba(79,195,232,0.55)]",
    mesh: "bg-[radial-gradient(ellipse_120%_80%_at_0%_-20%,rgba(79,195,232,0.35),transparent_50%),radial-gradient(ellipse_100%_60%_at_100%_100%,rgba(255,138,61,0.18),transparent_55%)]",
    hoverRing: "group-hover:shadow-[0_0_0_1px_rgba(79,195,232,0.35),0_24px_48px_-12px_rgba(27,119,182,0.35)]",
  },
  {
    iconBg: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-700",
    iconShadow: "shadow-[0_12px_40px_-8px_rgba(139,92,246,0.5)]",
    mesh: "bg-[radial-gradient(ellipse_120%_80%_at_100%_0%,rgba(167,139,250,0.3),transparent_50%),radial-gradient(ellipse_90%_50%_at_0%_100%,rgba(236,72,153,0.12),transparent_50%)]",
    hoverRing: "group-hover:shadow-[0_0_0_1px_rgba(167,139,250,0.4),0_24px_48px_-12px_rgba(109,40,217,0.28)]",
  },
  {
    iconBg: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900",
    iconShadow: "shadow-[0_12px_40px_-8px_rgba(71,85,105,0.55)]",
    mesh: "bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(148,163,184,0.22),transparent_55%),radial-gradient(ellipse_80%_50%_at_100%_100%,rgba(14,165,233,0.12),transparent_50%)]",
    hoverRing: "group-hover:shadow-[0_0_0_1px_rgba(148,163,184,0.35),0_24px_48px_-12px_rgba(15,23,42,0.4)]",
  },
  {
    iconBg: "bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-800",
    iconShadow: "shadow-[0_12px_40px_-8px_rgba(16,185,129,0.45)]",
    mesh: "bg-[radial-gradient(ellipse_110%_70%_at_0%_0%,rgba(52,211,153,0.28),transparent_52%),radial-gradient(ellipse_90%_60%_at_100%_80%,rgba(20,184,166,0.15),transparent_50%)]",
    hoverRing: "group-hover:shadow-[0_0_0_1px_rgba(52,211,153,0.35),0_24px_48px_-12px_rgba(5,150,105,0.28)]",
  },
] as const

const PALETTE_INDEX_BY_SLUG: Record<string, number> = {
  "web-development": 0,
  "mobile-app-development": 1,
  "software-engineering": 2,
  ecommerce: 3,
}

function getFeaturedPalette(slug: string) {
  const i = PALETTE_INDEX_BY_SLUG[slug]
  return FEATURED_CARD_PALETTES[i ?? 0]!
}

export const LandingPageScreen = () => {
  const { featuredCourses: featuredFromHook } = useCourses()
  const featuredCourses = featuredFromHook.map((c) => ({
    ...c,
    icon: FEATURED_COURSE_ICONS[c.icon] ?? CodeIcon,
  }))
  const [modalEnrollmentSent, setModalEnrollmentSent] = useState(false)
  const [landingContactSent, setLandingContactSent] = useState(false)
  const [enrollmentSent, setEnrollmentSent] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  // Show contact modal on first visit; persist "shown" in localStorage so it only appears once.
  useEffect(() => {
    if (typeof window === "undefined") return
    const alreadyShown = localStorage.getItem(CONTACT_MODAL_SHOWN_KEY)
    if (alreadyShown === "true") return
    const t = setTimeout(() => setContactModalOpen(true), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (contactModalOpen && typeof window !== "undefined") {
      localStorage.setItem(CONTACT_MODAL_SHOWN_KEY, "true")
    }
  }, [contactModalOpen])

  useEffect(() => {
    // Smooth scrolling + reveal animations (no scroll-snap to avoid footer jump).
    const root = document.documentElement
    root.classList.add("scroll-smooth")

    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    )
    for (const el of revealEls) {
      el.classList.add("opacity-0", "translate-y-6")
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) {
            el.classList.add("opacity-100", "translate-y-0")
            el.classList.remove("opacity-0", "translate-y-6")
          } else {
            // fade-out when leaving viewport
            el.classList.add("opacity-0", "translate-y-6")
            el.classList.remove("opacity-100", "translate-y-0")
          }
        }
      },
      { threshold: 0.12, rootMargin: "-10% 0px -10% 0px" }
    )
    for (const el of revealEls) io.observe(el)
    return () => {
      io.disconnect()
      root.classList.remove("scroll-smooth")
    }
  }, [])

  return (
    <div className="w-full">
      <DialogPrimitive.Root open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-md transition-all duration-500" />
          <DialogPrimitive.Content
            className="bg-card text-card-foreground border-border fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border shadow-2xl outline-none focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 duration-500"
          >
            <div className="relative flex max-h-[90vh] flex-col">
              <div className="flex-none border-b border-border/60 bg-muted/30 p-6 pb-4 sm:p-8 sm:pb-4 dark:bg-muted/15">
                <div className="absolute right-4 top-4">
                  <DialogPrimitive.Close asChild>
                    <button
                      type="button"
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-(--brand-highlight)"
                      aria-label="Close"
                    >
                      <XIcon className="size-5" />
                    </button>
                  </DialogPrimitive.Close>
                </div>
                <div className="flex items-start gap-3 pr-10">
                  <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-lg">
                    <GraduationCapIcon className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <DialogPrimitive.Title className="text-xl font-semibold tracking-tight">
                      Start your enrollment
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm leading-6">
                      Select courses, confirm the first-fee total, upload your payment screenshot, and submit. We’ll register you
                      for admin approval.
                    </DialogPrimitive.Description>
                  </div>
                </div>
              </div>
              <div className="bg-card min-h-0 flex-1 overflow-y-auto p-6 pt-4 sm:p-8 sm:pt-4">
                <EnrollmentFormCard
                  variant="modal"
                  sent={modalEnrollmentSent}
                  onSuccess={() => {
                    setModalEnrollmentSent(true)
                    window.setTimeout(() => setContactModalOpen(false), 2400)
                  }}
                />
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-144 w-240 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,195,232,0.22),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-112 w-md rounded-full bg-[radial-gradient(circle_at_center,rgba(242,140,40,0.16),transparent_65%)] blur-3xl" />
      </div>

      <div className="w-full">
        <section
          id="hero"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium">
                    <CheckCircle2Icon className="size-3.5 text-(--brand-highlight)" />
                    Job-ready skills, built with real projects
                  </div>

                  <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                    Learn skills that{" "}
                    <span className="bg-[linear-gradient(135deg,var(--brand-secondary),var(--brand-highlight))] bg-clip-text text-transparent">
                      convert
                    </span>{" "}
                    into outcomes.
                  </h1>

                  <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
                    TechOn Skills helps you become confident in Web Development, Mobile App Development, Software Engineering,
                    and Ecommerce (Shopify + WordPress + Wix) — with structured learning, practical assignments, and a dashboard
                    that tracks marks.
                  </p>

                  <div className="border-border/60 bg-background/40 rounded-2xl border p-4 text-sm">
                    <div className="font-semibold">Career support</div>
                    <div className="text-muted-foreground mt-1 leading-7">
                      We help deserving candidates start their careers by connecting them to job opportunities after consistent
                      performance and strong project submissions.
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button asChild size="xl" shape="pill">
                      <Link href="/courses">
                        Explore courses
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="xl" shape="pill">
                      <Link href={CONFIG.ROUTES.PUBLIC.ENROLLMENT}>Enroll now</Link>
                    </Button>
                    <Button asChild variant="outline" size="xl" shape="pill">
                      <Link href="#contact">Contact</Link>
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Hands-on", value: "Projects" },
                      { label: "Guided", value: "Flow" },
                      { label: "Clear", value: "Outcomes" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-2xl border bg-background/60 p-4">
                        <div className="text-xl font-semibold">{s.value}</div>
                        <div className="text-muted-foreground text-xs">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>What you’ll build</CardTitle>
                    <CardDescription>Portfolio-ready projects and real workflows.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "A modern landing page + dashboard UI",
                      "An API-driven app with authentication",
                      "A deployable project with Git workflow",
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
        </section>

        <section
          id="courses"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8 2xl:px-10">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-secondary">Featured</div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Pick a path — we’ll guide you to the finish line.
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Choose one track or combine skills. Every course follows a clean flow: learn → practice → submit →
                  feedback.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredCourses.map((c, idx) => {
                  const palette = getFeaturedPalette(c.slug)
                  const highlight = COURSE_DISPLAY_BY_SLUG[c.slug]?.highlight
                  logger({ type: LoggerLevel.DEBUG, message: JSON.stringify(c.bullets), })
                  return (
                    <Link
                      key={c.slug}
                      href={`/courses/${c.slug}`}
                      className={cn(
                        "group relative block min-w-96 max-w-96 h-full min-h-76 rounded-[1.35rem] outline-none focus-visible:ring-2 focus-visible:ring-(--brand-highlight) focus-visible:ring-offset-2",
                        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-5 motion-safe:duration-700",
                      )}
                      style={{ animationDelay: `${120 + idx * 90}ms` }}
                    >
                      {/* Ambient glow on hover */}
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute -inset-0.5 rounded-[1.4rem] opacity-0 blur-md transition-all duration-500 ease-out",
                          "bg-linear-to-br from-sky-400/30 via-transparent to-orange-400/25",
                          "group-hover:opacity-100 group-hover:blur-xl",
                        )}
                      />
                      <article
                        className={cn(
                          "relative flex h-full min-h-[inherit] flex-col overflow-hidden rounded-[1.35rem] border border-border/70",
                          "bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/75",
                          "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_12px_24px_-8px_rgba(7,26,43,0.12)]",
                          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          "group-hover:-translate-y-2 group-hover:border-(--brand-highlight)/25",
                          palette.hoverRing,
                        )}
                      >
                        {/* Mesh + shine sweep */}
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100",
                            palette.mesh,
                          )}
                        />
                        <div
                          className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[120%] group-hover:opacity-100 dark:via-white/10"
                          aria-hidden
                        />

                        <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                          <div className="mb-5 flex gap-5">
                            <div className="relative shrink-0">
                              <div
                                className={cn(
                                  "flex size-19 items-center justify-center rounded-2xl text-white",
                                  "ring-4 ring-white/60 dark:ring-white/10",
                                  "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:-rotate-2",
                                  palette.iconBg,
                                  palette.iconShadow,
                                )}
                              >
                                <c.icon className="size-[2.1rem] drop-shadow-md" strokeWidth={1.65} aria-hidden />
                              </div>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
                              {highlight ? (
                                <span className="w-fit rounded-full border border-(--brand-highlight)/25 bg-(--brand-highlight)/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-(--brand-secondary)">
                                  {highlight}
                                </span>
                              ) : null}
                              <h3 className="text-[1.05rem] font-bold leading-snug tracking-tight text-foreground sm:text-lg">
                                {c.title}
                              </h3>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-5 line-clamp-3 text-sm leading-relaxed">
                            {c.description}
                          </p>

                          <ul className="mb-6 flex flex-1 flex-col gap-3">
                            {c.bullets.map((b) => (
                              <li key={b} className="flex gap-3 text-sm leading-snug">
                                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-(--brand-highlight)/12 text-(--brand-highlight) ring-1 ring-(--brand-highlight)/20">
                                  <CheckCircle2Icon className="size-3.5" strokeWidth={2.25} aria-hidden />
                                </span>
                                <span className="min-w-0 text-foreground/90">{b}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-5">
                            <span className="text-sm font-semibold tracking-tight text-foreground">
                              View details
                            </span>
                            <span className="flex size-9 items-center justify-center rounded-full bg-(--brand-primary)/5 text-(--brand-secondary) transition-all duration-300 group-hover:bg-(--brand-secondary) group-hover:text-white group-hover:shadow-md">
                              <ArrowRightIcon
                                className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                                aria-hidden
                              />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="why"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(27,119,182,0.18),transparent_55%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.22))]" />
            </div>

            <div className="mx-auto max-w-6xl space-y-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <SparklesIcon className="size-3.5 text-(--brand-highlight)" />
                  Why TechOn Skills
                </div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  A smooth learning loop that makes you unstoppable.
                </h2>
                <p className="text-muted-foreground max-w-3xl text-pretty">
                  We built the platform around human psychology: small wins, visible progress, and momentum that keeps you
                  showing up daily.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  {
                    title: "Structured lessons",
                    description: "Short lessons that build confidence without overwhelming you.",
                    icon: GraduationCapIcon,
                  },
                  {
                    title: "Assignments + marks",
                    description: "Submit work, get marks, and see progress clearly — like a real training program.",
                    icon: FileCheck2Icon,
                  },
                  {
                    title: "Career support",
                    description: "Deserving candidates get help to start careers through strong performance and projects.",
                    icon: BriefcaseIcon,
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-3xl bg-[linear-gradient(135deg,rgba(79,195,232,0.30),rgba(242,140,40,0.14),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                      <CardHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 items-center justify-center rounded-2xl">
                            <f.icon className="size-5" />
                          </span>
                          <CardTitle className="text-lg">{f.title}</CardTitle>
                        </div>
                        <CardDescription className="text-sm leading-7">{f.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>How the flow works</CardTitle>
                    <CardDescription>Simple, repeatable, addictive progress.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-3">
                    {[
                      { t: "Learn", d: "Short lesson + examples", icon: StarsIcon },
                      { t: "Practice", d: "Guided tasks & projects", icon: WrenchIcon },
                      { t: "Submit", d: "Marks + feedback loop", icon: AwardIcon },
                    ].map((s) => (
                      <div key={s.t} className="rounded-2xl border bg-background/40 p-4">
                        <div className="flex items-center gap-2">
                          <s.icon className="size-4 text-(--brand-highlight)" />
                          <div className="font-semibold">{s.t}</div>
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm leading-6">{s.d}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>What makes people finish</CardTitle>
                    <CardDescription>Designed to keep you moving.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "Visible progress (marks) creates momentum",
                      "Small milestones prevent overwhelm",
                      "Projects build confidence faster than theory",
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-2">
                        <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                        <div className="text-muted-foreground leading-7">{t}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,195,232,0.14),transparent_55%)]" />
            </div>
            <div className="mx-auto max-w-6xl space-y-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <SparklesIcon className="size-3.5 text-(--brand-highlight)" />
                  Outcomes
                </div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Built to upgrade you — fast.
                </h2>
                <p className="text-muted-foreground max-w-3xl text-pretty">
                  You’ll build proof, not just learn theory. Your dashboard keeps you accountable with assignments, submissions,
                  and marks.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { title: "Clear roadmap", description: "Know exactly what to learn next — no confusion." },
                  { title: "Portfolio ready", description: "Projects that prove skill and unlock confidence." },
                  { title: "Career lift", description: "Top performers get support to start careers." },
                ].map((t) => (
                  <div
                    key={t.title}
                    className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.18),rgba(79,195,232,0.22),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">{t.title}</CardTitle>
                        <CardDescription className="text-sm leading-7">{t.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>

              <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                <CardContent className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
                  {[
                    { k: "Marks tracking", v: "See progress clearly" },
                    { k: "Assignments", v: "Build discipline" },
                    { k: "Career support", v: "For deserving candidates" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-2xl border bg-background/40 p-5">
                      <div className="text-muted-foreground text-xs">{s.k}</div>
                      <div className="mt-1 text-xl font-semibold">{s.v}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="talk-to-us"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,140,40,0.10),transparent_55%)]" />
            </div>
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <MessageCircleIcon className="size-3.5 text-(--brand-highlight)" />
                  Talk to us
                </div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Reach the team
                </h2>
                <p className="text-muted-foreground max-w-3xl text-pretty">
                  Call, email, or visit — we’ll help you choose the right course and explain how the program works.
                </p>
              </div>
              <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                <CardHeader>
                  <CardTitle>Contact details</CardTitle>
                  <CardDescription>
                    We’ll help you choose the right course and explain the flow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    { k: "Phone", v: "+923180617788" },
                    { k: "Email", v: "info@cloudrika.com" },
                    { k: "Address", v: "8th Floor, Office No. 812, Al Hafeez Executive Towers, Gulberg II, Firdous Market, Lahore, Punjab, Pakistan" },
                  ].map((r) => (
                    <div key={r.k} className="rounded-2xl border bg-background/40 p-4">
                      <div className="text-muted-foreground text-xs">{r.k}</div>
                      <div className="mt-1 font-semibold">{r.v}</div>
                    </div>
                  ))}
                  <div className="rounded-2xl border bg-background/40 p-4">
                    <div className="text-muted-foreground text-xs">Tip</div>
                    <div className="mt-1 leading-7">
                      Mention your target course and your current level — we’ll suggest the fastest path.
                    </div>
                  </div>
                  <Button asChild variant="outline" shape="pill" className="w-full sm:w-auto">
                    <Link href={CONFIG.ROUTES.PUBLIC.ENROLLMENT}>Go to enrollment page</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="enrollment"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,195,232,0.12),transparent_55%)]" />
            </div>
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <GraduationCapIcon className="size-3.5 text-(--brand-highlight)" />
                  Enrollment
                </div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Apply and pay your first fee
                </h2>
                <p className="text-muted-foreground max-w-3xl text-pretty">
                  Select course(s), review the first-fee total, upload your payment screenshot, and submit. Your account is
                  created pending admin approval.
                </p>
              </div>
              <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.22),rgba(255,138,61,0.12),transparent_70%)] p-px">
                <Card className="bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70 rounded-3xl border-0 shadow-sm">
                  <CardContent className="p-6 sm:p-8">
                    <EnrollmentFormCard
                      variant="landing"
                      sent={enrollmentSent}
                      onSuccess={() => setEnrollmentSent(true)}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,140,40,0.10),transparent_55%)]" />
            </div>
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold">
                  <MessageCircleIcon className="size-3.5 text-(--brand-highlight)" />
                  Contact
                </div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Send us a message
                </h2>
                <p className="text-muted-foreground max-w-3xl text-pretty">
                  General questions only — no fee or payment required. For registration with fee proof, use{" "}
                  <Link href="#enrollment" className="text-(--brand-highlight) font-medium underline-offset-4 hover:underline">
                    Enrollment
                  </Link>{" "}
                  above.
                </p>
              </div>
              <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                <CardContent className="p-6 sm:p-8">
                  <SimpleContactForm
                    variant="page"
                    sent={landingContactSent}
                    onSuccess={() => setLandingContactSent(true)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

