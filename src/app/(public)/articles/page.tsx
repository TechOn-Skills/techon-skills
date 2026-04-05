import type { Metadata } from "next"
import { PublicArticlesScreen } from "@/lib/ui/screens/public/articles"

const SITE_NAME = "TechOn Skills"

export const metadata: Metadata = {
  title: `Articles | ${SITE_NAME}`,
  description:
    "Guides, tips, and insights from TechOn Skills to help you build your career in tech. Learn web development, software engineering, and more.",
  openGraph: {
    title: `Articles | ${SITE_NAME}`,
    description:
      "Guides, tips, and insights from TechOn Skills to help you build your career in tech.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Articles | ${SITE_NAME}`,
    description: "Guides, tips, and insights from TechOn Skills.",
  },
  alternates: { canonical: "https://techonskills.com/articles" },
}

export default function ArticlesPage() {
  return <PublicArticlesScreen />
}
