import type { Metadata } from "next"
import { PublicArticleDetailScreen } from "@/lib/ui/screens/public/articles/detail"

const SITE_NAME = "TechOn Skills"
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techonskills.com"

type Props = { params: Promise<{ slug: string }> }

async function getArticleBySlug(slug: string) {
  const url = process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL
  if (!url) return null
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetArticleBySlug($slug: String!) {
            getArticleBySlug(slug: $slug) {
              id
              title
              slug
              excerpt
              content
              coverImage
              authorName
              publishedAt
              metaTitle
              metaDescription
            }
          }
        `,
        variables: { slug },
      }),
      next: { revalidate: 60 },
    })
    const json = await res.json()
    return json?.data?.getArticleBySlug ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) {
    return {
      title: `Article | ${SITE_NAME}`,
    }
  }
  const title = article.metaTitle || article.title
  const description = article.metaDescription || article.excerpt || undefined
  const ogImage = article.coverImage || undefined
  const canonical = `${BASE_URL}/articles/${article.slug}`

  return {
    title: `${title} | ${SITE_NAME}`,
    description: description || undefined,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: description || undefined,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: article.authorName ? [article.authorName] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: { canonical },
    other: {
      "article:published_time": article.publishedAt || "",
      "article:author": article.authorName || "",
    },
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  return <PublicArticleDetailScreen slug={slug} />
}
