import type { IAnnouncement } from "@/utils/interfaces"

export const ANNOUNCEMENTS: IAnnouncement[] = [
  {
    id: "a-1",
    title: "New batch starting soon",
    content:
      "We're launching a new batch for Web Development, Mobile App Development, and Software Engineering. Enroll now to secure your spot. Early enrollees get access to bonus lectures and resources.",
    date: "2026-01-20",
    isNew: true,
    category: "news",
  },
  {
    id: "a-2",
    title: "Assignment-based learning flow",
    content:
      "Your dashboard now supports a complete assignment flow: submit work, get marks, and track your performance. This keeps you accountable and motivated.",
    date: "2026-01-18",
    isNew: true,
    category: "feature",
  },
  {
    id: "a-3",
    title: "Portfolio-ready projects",
    content:
      "Every project you build during the course is designed to be portfolio-ready. Focus on clean UI, real workflows (Git, deployments), and outcomes you can show to clients or interviewers.",
    date: "2026-01-15",
    category: "feature",
  },
  {
    id: "a-4",
    title: "Career support for top performers",
    content:
      "TechOn Skills helps deserving candidates start their careers by connecting them to job opportunities after consistent performance and strong project submissions.",
    date: "2026-01-10",
    category: "opportunity",
  },
]

export const ANNOUNCEMENT_CATEGORY_CONFIG = {
  news: { emoji: "📢", color: "text-blue-600 dark:text-blue-400" },
  feature: { emoji: "✨", color: "text-purple-600 dark:text-purple-400" },
  achievement: { emoji: "🏆", color: "text-yellow-600 dark:text-yellow-400" },
  opportunity: { emoji: "🚀", color: "text-green-600 dark:text-green-400" },
} as const
