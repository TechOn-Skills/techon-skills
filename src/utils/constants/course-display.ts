/**
 * Display-only mapping for courses (icon, highlight, benefits).
 * Not part of the course schema; used when rendering course cards and landing.
 * Courses loaded from API use this by slug; use COURSE_DISPLAY_BY_SLUG[slug] ?? { icon: "code", benefits: [] } for unknown slugs.
 */
export const COURSE_DISPLAY_BY_SLUG: Record<string, { icon: string; highlight?: string; benefits?: string[] }> = {
  "software-engineering-1-year": {
    icon: "wrench",
    highlight: "Career track",
    benefits: ["System design & architecture", "PostgreSQL + advanced tooling", "Career growth support"],
  },
  "full-stack-web-6-months": {
    icon: "code",
    highlight: "Most popular",
    benefits: ["Portfolio projects", "Job-ready React + APIs", "Deployments + Git workflow"],
  },
  "mobile-app-development": {
    icon: "smartphone",
    highlight: "Fast results",
    benefits: ["Cross‑platform apps", "Device features (GPS/Camera)", "API backend + data strategy"],
  },
  "wordpress-wix-shopify-3-months": {
    icon: "store",
    highlight: "Business-ready",
    benefits: ["Client-ready stores/sites", "WordPress + Wix mastery", "SEO + conversion setup"],
  },
  "frontend-web-development": {
    icon: "code",
    highlight: "Fast results",
    benefits: ["Portfolio projects", "Job-ready React + APIs", "Deployments + Git workflow", "Next.js + Tailwind CSS"],
  },
  "digital-marketing": {
    icon: "marketing",
    highlight: "Fast results",
    benefits: ["Social Media Marketing", "Email Marketing", "Content Marketing", "SEO + Analytics"],
  },
  "ui-uix-graphic-design": {
    icon: "palette",
    highlight: "Fast results",
    benefits: ["UI/UX Design", "Graphic Design", "Branding", "Animation"],
  }

}
