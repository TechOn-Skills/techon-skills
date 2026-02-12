/**
 * Display-only mapping for courses (icon, highlight, benefits).
 * Not part of the course schema; used when rendering course cards and landing.
 */
export const COURSE_DISPLAY_BY_SLUG: Record<
  string,
  { icon: string; highlight?: string; benefits?: string[] }
> = {
  "software-engineering": {
    icon: "wrench",
    highlight: "Career track",
    benefits: ["System design & architecture", "PostgreSQL + advanced tooling", "Career growth support"],
  },
  "web-development": {
    icon: "code",
    highlight: "Most popular",
    benefits: ["Portfolio projects", "Job-ready React + APIs", "Deployments + Git workflow"],
  },
  "mobile-app-development": {
    icon: "smartphone",
    highlight: "Fast results",
    benefits: ["Cross‑platform apps", "Device features (GPS/Camera)", "API backend + data strategy"],
  },
  ecommerce: {
    icon: "store",
    highlight: "Business-ready",
    benefits: ["Client-ready stores/sites", "Shopify + WP + Wix mastery", "SEO + conversion setup"],
  },
}
