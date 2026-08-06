/**
 * Display-only mapping for courses (icon, highlight, benefits).
 * Not part of the course schema; used when rendering course cards and landing.
 * Courses loaded from API use this by slug; use COURSE_DISPLAY_BY_SLUG[slug] ?? { icon: "code", benefits: [] } for unknown slugs.
 */
export const COURSE_DISPLAY_BY_SLUG: Record<string, { icon: string; highlight?: string; benefits?: string[] }> = {
  "software-engineering": {
    icon: "wrench",
    highlight: "Career track",
    benefits: [
      "Deploy a live SaaS app",
      "Ship a published mobile app",
      "Real open-source contribution",
      "System design",
    ],
  },
  "full-stack-web-6-months": {
    icon: "code",
    highlight: "Most popular",
    benefits: [
      "Deploy a live AI SaaS app",
      "Build 6 real-world apps",
      "Freelance-ready portfolio",
      "MERN + Next.js + AI stack",
    ],
  },
  "mobile-app-development": {
    icon: "smartphone",
    highlight: "Fast results",
    benefits: [
      "Publish to Play Store & App Store",
      "Build a live chat + e-commerce app",
      "Stripe payments, done right",
      "One codebase, iOS and Android",
    ],
  },
  "wordpress-wix-shopify-3-months": {
    icon: "store",
    highlight: "Business-ready",
    benefits: [
      "4 live client-ready sites",
      "WooCommerce, Shopify & Wix",
      "Run a real Meta Ads campaign",
      "Freelance pricing you can quote",
    ],
  },
  "frontend-web-development": {
    icon: "code",
    highlight: "Fast results",
    benefits: [
      "Pixel-perfect site from Figma",
      "React 19 + Tailwind mastery",
      "Deployed portfolio on Vercel",
      "Fast-track into Full-Stack",
    ],
  },
  "digital-marketing": {
    icon: "marketing",
    highlight: "Fast results",
    benefits: [
      "Run real Meta & Google Ads",
      "30-day content calendar built",
      "Master ROAS, CPA, CTR",
      "Real campaign portfolio",
    ],
  },
  "ui-uix-graphic-design": {
    icon: "palette",
    highlight: "Fast results",
    benefits: [
      "Full UX audit on a live app",
      "Run real usability tests",
      "Hiring-ready case studies",
      "Figma AI + Framer skills",
    ],
  },
  "ai-development-course": {
    icon: "brain",
    highlight: "Fast results",
    benefits: [
      "Build a RAG chatbot",
      "Deploy an AI SaaS product",
      "Hands-on OpenAI + Anthropic",
      "Freelance in the AI niche",
    ],
  },
  "machine-learning-bootcamp": {
  icon: "brain",
  highlight: "New track",
  benefits: [
    "Build ML models from scratch",
    "Deploy with FastAPI + Docker",
    "Real projects every weekend",
    "Portfolio for Data Scientist roles",
  ],
},
  "business-development": {
  icon: "briefcase",
  highlight: "5-week track",
  benefits: [
    "Land real client leads",
    "Write proposals that convert",
    "Master cold outreach + pitching",
    "Hands-on with real BD tools",
  ],
},
}