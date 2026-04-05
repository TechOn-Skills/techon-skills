"use client"

import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@apollo/client/react"
import { ArrowLeftIcon, CalendarIcon, Loader2Icon, UserIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { GET_ARTICLE_BY_SLUG } from "@/lib/graphql"
import { formatDateLong, getImageSrc } from "@/lib/helpers"
import { CONFIG } from "@/utils/constants"

type ArticleDetail = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  authorName: string
  publishedAt: string | null
  metaTitle: string
  metaDescription: string
  createdAt: string
}

export const PublicArticleDetailScreen = ({ slug }: { slug: string }) => {
  const { data, loading, error } = useQuery<{ getArticleBySlug: ArticleDetail | null }>(GET_ARTICLE_BY_SLUG, {
    variables: { slug },
  })

  const article = data?.getArticleBySlug

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

  if (error || !article) {
    return (
      <div className="w-full px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-background/70 backdrop-blur">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Article not found</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                This article may be unpublished or the link is incorrect.
              </p>
              <Button asChild variant="brand-secondary" shape="pill" className="mt-4">
                <Link href={CONFIG.ROUTES.PUBLIC.ARTICLES ?? "/articles"} className="gap-2">
                  <ArrowLeftIcon className="size-4" />
                  Back to articles
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: article.coverImage || undefined,
    author: article.authorName ? { "@type": "Person", name: article.authorName } : undefined,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.createdAt,
  }

  return (
    <article className="w-full px-4 py-12 sm:px-6 lg:px-8 2xl:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
            <Link href={CONFIG.ROUTES.PUBLIC.ARTICLES ?? "/articles"} className="gap-2">
              <ArrowLeftIcon className="size-4" />
              Back to articles
            </Link>
          </Button>
        </div>

        <header className="space-y-4">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          {(article.authorName || article.publishedAt) && (
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              {article.authorName && (
                <span className="flex items-center gap-1">
                  <UserIcon className="size-4" />
                  {article.authorName}
                </span>
              )}
              {article.publishedAt && (
                <span className="flex items-center gap-1">
                  <CalendarIcon className="size-4" />
                  {formatDateLong(article.publishedAt ?? article.createdAt)}
                </span>
              )}
            </div>
          )}
          {article.excerpt && (
            <p className="text-muted-foreground text-lg leading-7">{article.excerpt}</p>
          )}
        </header>

        {article.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted-surface">
            <Image
              src={getImageSrc(article.coverImage) || article.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-p:leading-7 prose-a:text-(--brand-primary)"
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />
      </div>
    </article>
  )
}
