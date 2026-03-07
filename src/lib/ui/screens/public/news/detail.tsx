"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import { ArrowLeftIcon, CalendarIcon, Loader2Icon, NewspaperIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { GET_NEWS_POST } from "@/lib/graphql"
import { CONFIG } from "@/utils/constants/config"

export const PublicNewsDetailScreen = ({ id }: { id: string }) => {
  const { data, loading, error } = useQuery<{
    getNewsPost: { id: string; title: string; description: string; createdAt: string; updatedAt: string } | null
  }>(GET_NEWS_POST, { variables: { id } })

  const post = data?.getNewsPost

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Post not found</CardTitle>
              <CardDescription>
                This news post may have been removed or the link is incorrect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="brand-secondary" shape="pill">
                <Link href={CONFIG.ROUTES.PUBLIC.NEWS ?? "/news"}>
                  <ArrowLeftIcon className="size-4" />
                  Back to news
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
            <Link href={CONFIG.ROUTES.PUBLIC.NEWS ?? "/news"} className="gap-2">
              <ArrowLeftIcon className="size-4" />
              Back to news
            </Link>
          </Button>
        </div>

        <Card className="bg-background/70 backdrop-blur overflow-hidden">
          <div className="h-1.5 w-full bg-[linear-gradient(to_right,rgba(79,195,232,0.7),rgba(242,140,40,0.6))]" />
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <NewspaperIcon className="size-4" />
              {post.createdAt && (
                <span className="flex items-center gap-1">
                  <CalendarIcon className="size-3.5" />
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })}
                </span>
              )}
            </div>
            <CardTitle className="text-3xl tracking-tight sm:text-4xl">
              {post.title}
            </CardTitle>
            <CardDescription className="text-base leading-7">
              {post.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-7 whitespace-pre-wrap">
              {post.description}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
