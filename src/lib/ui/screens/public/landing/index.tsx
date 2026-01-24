"use client"
import Link from "next/link"
import { ArrowRightIcon, CheckCircle2Icon, CodeIcon, SmartphoneIcon, WrenchIcon } from "lucide-react"

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
    icon: CodeIcon,
    bullets: ["Shopify store setup", "WordPress + WooCommerce", "Wix websites & funnels"],
  },
]

export const LandingPageScreen = () => {
  useEffect(() => {
    // Enable scroll-snap on the page scroller without adding a floating menu.
    const root = document.documentElement
    root.classList.add("scroll-smooth", "snap-y", "snap-proximity")
    return () => {
      root.classList.remove("scroll-smooth", "snap-y", "snap-proximity")
    }
  }, [])

  return (
    <div className="w-full">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-144 w-240 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,195,232,0.22),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-112 w-md rounded-full bg-[radial-gradient(circle_at_center,rgba(242,140,40,0.16),transparent_65%)] blur-3xl" />
      </div>

      <div className="w-full">
        <section id="hero" className="snap-start scroll-mt-24">
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

        <section id="courses" className="snap-start scroll-mt-24">
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

        <section id="why" className="snap-start scroll-mt-24">
          <div className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-secondary">Why TechOn Skills</div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  A flow that keeps you consistent.
                </h2>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  {
                    title: "Structured lessons",
                    description: "Short lessons that build confidence without overwhelming you.",
                  },
                  {
                    title: "Assignments + feedback",
                    description: "Submit work, get marks, and see your progress clearly.",
                  },
                  {
                    title: "Real-world workflow",
                    description: "Git, deployments, and clean UI patterns like modern teams.",
                  },
                ].map((f) => (
                  <Card key={f.title} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                    <CardHeader>
                      <CardTitle>{f.title}</CardTitle>
                      <CardDescription>{f.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="snap-start scroll-mt-24">
          <div className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-secondary">Outcomes</div>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Built for progress you can measure.
                </h2>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { title: "Clear roadmap", description: "Know exactly what to learn next." },
                  { title: "Confidence boost", description: "Build, submit, and improve with structure." },
                  { title: "Portfolio ready", description: "Projects that you can show and explain." },
                ].map((t) => (
                  <Card key={t.title} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                    <CardHeader>
                      <CardTitle>{t.title}</CardTitle>
                      <CardDescription>{t.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="snap-start scroll-mt-24">
          <div className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 2xl:px-10">
            <div className="mx-auto max-w-6xl">
              <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                <CardHeader>
                  <CardTitle>Contact us</CardTitle>
                  <CardDescription>
                    Tell us what you want to learn — we’ll help you choose the best course.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input placeholder="Your name" />
                    <Input placeholder="Your email" />
                  </div>
                  <Input placeholder="Subject" />
                  <Textarea placeholder="Message" className="min-h-32" />
                  <Separator />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-muted-foreground text-sm">
                      Or call: +923144240550
                    </div>
                    <Button variant="brand-secondary" shape="pill" className="w-fit">
                      Send message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

