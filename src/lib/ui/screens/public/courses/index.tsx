import Link from "next/link"
import { ArrowRightIcon, CodeIcon, SparklesIcon, SmartphoneIcon, StoreIcon, WrenchIcon } from "lucide-react"

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
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    icon: SmartphoneIcon,
    description:
      "Build modern mobile apps with clean UI, navigation, and storage patterns.",
    price: "PKR 2,500 / month",
    highlight: "Fast results",
  },
  {
    slug: "software-engineering",
    title: "Software Engineering",
    icon: WrenchIcon,
    description:
      "Professional engineering habits: architecture, testing, workflows, and delivery.",
    price: "PKR 2,500 / month",
    highlight: "Career track",
  },
  {
    slug: "ecommerce",
    title: "Ecommerce (Shopify + WordPress + Wix)",
    icon: StoreIcon,
    description:
      "Launch ecommerce stores, landing pages, and client-ready sites across platforms.",
    price: "PKR 2,500 / month",
    highlight: "Business-ready",
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
              className="rounded-3xl bg-[linear-gradient(135deg,rgba(79,195,232,0.35),rgba(242,140,40,0.20),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 items-center justify-center rounded-2xl">
                    <c.icon className="size-5" />
                  </span>
                  <div>
                    <CardTitle>{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </div>
                  {!!c.highlight && (
                    <span className="bg-(--brand-secondary) text-(--text-on-dark) ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                      <SparklesIcon className="size-3.5" />
                      {c.highlight}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-2xl font-semibold">{c.price}</div>
                  <div className="text-muted-foreground text-xs">
                    Upgrade your skills, build projects, and get guidance toward jobs.
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

