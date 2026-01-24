import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"

export const PublicAboutScreen = () => {
  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-secondary">About</div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Learn with structure. Build with confidence.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
            TechOn Skills is built around a simple, motivating loop: lectures → assignments → submission → marks.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Practical", description: "Real projects and real workflows." },
            { title: "Measurable", description: "Assignments + marks to track progress." },
            { title: "Focused", description: "Clean UI and a consistent learning flow." },
          ].map((c) => (
            <Card key={c.title} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" shape="pill" className="justify-between">
                  <Link href="/courses">
                    Explore courses
                    <ArrowRightIcon className="size-4 text-muted-foreground" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

