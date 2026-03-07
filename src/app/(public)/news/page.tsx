import type { Metadata } from "next"
import { PublicNewsScreen } from "@/lib/ui/screens/public/news"

export const metadata: Metadata = {
  title: "News",
  description: "Updates from TechOn Skills: new course launches, announcements, and learning tips.",
  openGraph: {
    title: "News | TechOn Skills",
    description: "Updates from TechOn Skills: announcements and learning tips.",
    type: "website",
  },
  alternates: { canonical: "/news" },
}

export default function NewsPage() {
  return <PublicNewsScreen />
}

