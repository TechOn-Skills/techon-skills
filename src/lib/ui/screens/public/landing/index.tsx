"use client"
import Link from "next/link"
import {
  ArrowRightIcon,
  AwardIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  CodeIcon,
  FileCheck2Icon,
  GraduationCapIcon,
  SparklesIcon,
  SmartphoneIcon,
  StarsIcon,
  StoreIcon,
  WrenchIcon,
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { Separator } from "@/lib/ui/useable-components/separator"
import { useEffect } from "react"

const featuredCourses = [
  {
    slug: "web-development",
    title: "Web Development",
    description:
      "Frontend + backend fundamentals with real projects, Git, deployments, and portfolio-ready work.",
    icon: CodeIcon,
    bullets: ["React + Next.js", "APIs + Databases", "Deployments + Git workflow"],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    description:
      "Build production-style mobile apps with modern patterns, state management, and publish-ready setup.",
    icon: SmartphoneIcon,
    bullets: ["UI + Navigation", "Auth + Storage", "Release-ready checklist"],
  },
  {
    slug: "software-engineering",
    title: "Software Engineering",
    description:
      "Go beyond coding: system design basics, clean architecture, testing, and professional practices.",
    icon: WrenchIcon,
    bullets: ["Clean code habits", "Testing mindset", "Team workflows"],
  },
  {
    slug: "ecommerce",
    title: "Ecommerce (Shopify + WordPress + Wix)",
    description:
      "Launch fast: build stores, landing pages, and client-ready ecommerce setups across platforms.",
    icon: StoreIcon,
    bullets: ["Shopify store setup", "WordPress + WooCommerce", "Wix websites & funnels"],
  },
]

export const LandingPageScreen = () => {
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

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button asChild size="xl" shape="pill">
                      <Link href="/courses">
                        Explore courses
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="xl" shape="pill">
                      <Link href="/contact">Talk to us</Link>
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

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredCourses.map((c) => (
                  <Card
                    key={c.title}
                    className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 items-center justify-center rounded-2xl">
                          <c.icon className="size-5" />
                        </span>
                        <div>
                          <CardTitle className="text-base">{c.title}</CardTitle>
                          <CardDescription className="text-xs leading-5">
                            {c.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        {c.bullets.slice(0, 2).map((b) => (
                          <div key={b} className="flex items-start gap-2">
                            <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                            <div className="text-sm">{b}</div>
                          </div>
                        ))}
                      </div>
                      <Button asChild shape="pill" className="w-fit">
                        <Link href={`/courses/${c.slug}`}>
                          View details
                          <ArrowRightIcon className="size-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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
                  { title: "Career lift", description: "Top performers get support to start careers and win opportunities." },
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
          id="contact"
          data-reveal
          className="scroll-mt-24 transition-all duration-700 ease-out will-change-transform"
        >
          <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,140,40,0.12),transparent_55%)]" />
            </div>

            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>Talk to us</CardTitle>
                    <CardDescription>
                      We’ll help you choose the right course and explain the flow.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      { k: "Phone", v: "+923144240550" },
                      { k: "Email", v: "info@cloudrika.com" },
                      { k: "Address", v: "Lahore Punjab Pakistan" },
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
                  </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                  <CardHeader>
                    <CardTitle>Contact form</CardTitle>
                    <CardDescription>
                      Submit this and we’ll respond quickly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input placeholder="Your name" />
                      <Input placeholder="Your email" />
                    </div>
                    <select
                      defaultValue=""
                      className="border-input bg-transparent dark:bg-input/30 h-11 w-full rounded-full border px-4 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="">Select a course</option>
                      <option value="Full‑Stack Web Development">Full‑Stack Web Development</option>
                      <option value="Mobile Application Development">Mobile Application Development</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Ecommerce (Shopify + WordPress + Wix)">Ecommerce (Shopify + WordPress + Wix)</option>
                    </select>
                    <Textarea placeholder="Message" className="min-h-40" />
                    <Separator />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-muted-foreground text-sm">
                        Prefer call? +923144240550
                      </div>
                      <Button variant="brand-secondary" shape="pill" className="w-fit">
                        Send message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

