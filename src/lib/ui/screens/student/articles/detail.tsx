"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import { ArrowLeftIcon, Loader2Icon } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { GET_ARTICLE_BY_SLUG } from "@/lib/graphql"
import { formatDateLong } from "@/lib/helpers"

export const StudentArticleDetailScreen = ({ slug }: { slug: string }) => {
  const { data, loading, error } = useQuery<{
    getArticleBySlug: {
      id: string
      title: string
      content: string
      authorName: string | null
      publishedAt: string | null
    } | null
  }>(GET_ARTICLE_BY_SLUG, { variables: { slug }, skip: !slug, fetchPolicy: "network-only" })

  const article = data?.getArticleBySlug

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2Icon className="size-8 animate-spin" />
        Loading…
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="w-full py-10">
        <Card>
          <CardContent className="p-8">
            <p className="text-muted-foreground">Article not found or not published.</p>
            <Button asChild variant="outline" shape="pill" className="mt-4">
              <Link href="/student/articles">Back to articles</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <Button asChild variant="ghost" shape="pill" className="mb-6">
        <Link href="/student/articles">
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>
      </Button>
      <article className="prose prose-neutral dark:prose-invert max-w-3xl">
        <h1 className="text-balance">{article.title}</h1>
        <p className="text-muted-foreground not-prose text-sm">
          {article.authorName && <span>{article.authorName} · </span>}
          {article.publishedAt ? formatDateLong(article.publishedAt) : null}
        </p>
        <div className="not-prose mt-8 max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
