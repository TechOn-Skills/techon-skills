"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import { ArrowRightIcon, Loader2Icon, NewspaperIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/useable-components/card"
import { GET_NEWS_POSTS } from "@/lib/graphql"

export const PublicNewsScreen = () => {
  const { data, loading, error } = useQuery<{ getNewsPosts: Array<{ id: string; title: string; description: string }> }>(GET_NEWS_POSTS)
  const posts = data?.getNewsPosts ?? []

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

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2Icon className="size-6 animate-spin" />
            <span>Loading news...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-destructive">Failed to load news. Please try again.</p>
          </div>
        ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((p) => (
            <Card key={p.id} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" shape="pill" className="justify-between">
                  <Link href={`/news/${p.id}`}>
                    Learn more
                    <ArrowRightIcon className="size-4 text-muted-foreground" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}

