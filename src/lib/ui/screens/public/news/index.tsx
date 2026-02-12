import Link from "next/link"
import { ArrowRightIcon, NewspaperIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/useable-components/card"
import { NEWS_POSTS } from "@/utils/constants"

export const PublicNewsScreen = () => {
  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-secondary">News</div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Updates from TechOn Skills
            </h1>
            <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
              Announcements, new course launches, and learning tips.
            </p>
          </div>
          <span className="bg-(--brand-primary) text-(--text-on-dark) hidden size-12 items-center justify-center rounded-2xl sm:inline-flex">
            <NewspaperIcon className="size-6" />
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {NEWS_POSTS.map((p) => (
            <Card key={p.title} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" shape="pill" className="justify-between">
                  <Link href="/contact">
                    Learn more
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

