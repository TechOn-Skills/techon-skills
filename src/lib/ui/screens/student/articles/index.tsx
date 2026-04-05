"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import { Loader2Icon, FileTextIcon } from "lucide-react"

import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { GET_ARTICLES } from "@/lib/graphql"
import { formatDateLong } from "@/lib/helpers"

export const StudentArticlesScreen = () => {
  const { data, loading } = useQuery<{
    getArticles: Array<{
      id: string
      title: string
      slug: string
      excerpt: string | null
      publishedAt: string | null
      authorName: string | null
    }>
  }>(GET_ARTICLES, { variables: { publishedOnly: true }, fetchPolicy: "network-only" })

  const articles = data?.getArticles ?? []

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2Icon className="size-8 animate-spin" />
        Loading articles…
      </div>
    )
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Articles</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Study materials & articles</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Read published articles from your instructors and the team.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {articles.length === 0 ? (
          <p className="text-muted-foreground">No published articles yet.</p>
        ) : (
          articles.map((a) => (
            <Link key={a.id} href={`/student/articles/${a.slug}`} className="group block">
              <Card className="bg-background/70 h-full rounded-3xl backdrop-blur transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-(--brand-secondary)">
                    <FileTextIcon className="size-5" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Article</span>
                  </div>
                  <h2 className="group-hover:text-(--brand-secondary) text-lg font-semibold leading-snug">{a.title}</h2>
                  {a.excerpt && <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">{a.excerpt}</p>}
                  <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    {a.authorName && <span>{a.authorName}</span>}
                    {a.publishedAt && <span>{formatDateLong(a.publishedAt)}</span>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
