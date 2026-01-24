import Link from "next/link"
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CodeIcon,
  FileCheck2Icon,
  SparklesIcon,
  SmartphoneIcon,
  StoreIcon,
  TrophyIcon,
  WrenchIcon,
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/useable-components/card"

const catalog = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: CodeIcon,
    description:
      "Frontend + backend fundamentals with portfolio projects and deployment.",
    price: "PKR 2,500 / month",
    highlight: "Most popular",
    duration: "6 Months",
    benefits: ["Portfolio projects", "Job-ready React + APIs", "Deployments + Git workflow"],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    icon: SmartphoneIcon,
    description:
      "Build modern mobile apps with clean UI, navigation, and storage patterns.",
    price: "PKR 2,500 / month",
    highlight: "Fast results",
    duration: "6 Months (Flexible)",
    benefits: ["Cross‑platform apps", "Device features (GPS/Camera)", "API backend + data strategy"],
  },
  {
    slug: "software-engineering",
    title: "Software Engineering",
    icon: WrenchIcon,
    description:
      "Professional engineering habits: architecture, testing, workflows, and delivery.",
    price: "PKR 2,500 / month",
    highlight: "Career track",
    duration: "1 Year",
    benefits: ["System design & architecture", "PostgreSQL + advanced tooling", "Career growth support"],
  },
  {
    slug: "ecommerce",
    title: "Ecommerce (Shopify + WordPress + Wix)",
    icon: StoreIcon,
    description:
      "Launch ecommerce stores, landing pages, and client-ready sites across platforms.",
    price: "PKR 2,500 / month",
    highlight: "Business-ready",
    duration: "6 Months",
    benefits: ["Client-ready stores/sites", "Shopify + WP + Wix mastery", "SEO + conversion setup"],
  },
]

export const PublicCoursesScreen = () => {
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {catalog.map((c) => (
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
                      <Link href={`/contact?course=${encodeURIComponent(c.title)}`}>
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
      </div>
    </div>
  )
}

