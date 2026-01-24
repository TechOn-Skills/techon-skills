import Link from "next/link"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { STUDENT_SIDEBAR_ITEMS } from "@/utils/constants"

export const StudentSimpleScreen = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="w-full py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Student</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          {description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {STUDENT_SIDEBAR_ITEMS.slice(0, 6).map((i) => (
          <div
            key={i.href}
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.22),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 shrink-0 items-center justify-center rounded-2xl">
                    <i.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{i.label}</CardTitle>
                    <CardDescription className="text-sm">Open {i.label.toLowerCase()}.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="brand-secondary" shape="pill" className="w-fit">
                  <Link href={i.href}>Go</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

