"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import { ArrowRightIcon, FileTextIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { formatDateLong } from "@/lib/helpers"
import { GET_ARTICLES } from "@/lib/graphql"

export const PublicArticlesScreen = () => {
  const { data, loading, error } = useQuery<{
    getArticles: Array<{
      id: string
      title: string
      slug: string
      excerpt: string
      coverImage: string
      authorName: string
      publishedAt: string | null
    }>
  }>(GET_ARTICLES, { variables: { publishedOnly: true } })

  const articles = data?.getArticles ?? []

  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold text-secondary">Articles</div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Learn & grow
            </h1>
            <p className="text-muted-foreground max-w-2xl text-pretty text-lg leading-8">
              Guides, tips, and insights from TechOn Skills to help you build your career in tech.
            </p>
          </div>
          <span className="bg-(--brand-primary) text-(--text-on-dark) hidden size-12 items-center justify-center rounded-2xl sm:inline-flex">
            <FileTextIcon className="size-6" />
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2Icon className="size-6 animate-spin" />
            <span>Loading articles...</span>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-destructive">Failed to load articles. Please try again.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {articles.map((a) => (
              <Card key={a.id} className="bg-background/60 backdrop-blur overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">
                    <Link href={`/articles/${a.slug}`} className="hover:underline">
                      {a.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{a.excerpt || "No excerpt."}</CardDescription>
                  {(a.authorName || a.publishedAt) && (
                    <p className="text-muted-foreground text-xs">
                      {a.authorName}
                      {a.authorName && a.publishedAt && " · "}
                      {a.publishedAt && formatDateLong(a.publishedAt)}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" shape="pill" className="gap-2">
                    <Link href={`/articles/${a.slug}`}>
                      Read more
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!loading && !error && articles.length === 0 && (
          <div className="py-12 text-center text-muted-foreground rounded-3xl border border-dashed">
            <FileTextIcon className="size-12 mx-auto mb-4 opacity-50" />
            <p>No articles published yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
