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
      "Deploy a live SaaS web app and a published mobile app",
      "Cover frontend, backend, AI integration, and system design",
      "Make a real open-source contribution on GitHub",
      "Walk out interview-ready with DSA + system design practice",
    ],
  },
  "full-stack-web-6-months": {
    icon: "code",
    highlight: "Most popular",
    benefits: [
      "Deploy a live AI-powered SaaS app as your capstone",
      "Build 6 real-world apps: e-commerce, dashboard, auth, API backend",
      "Get freelance-ready for Upwork/Fiverr with a proven portfolio",
      "Learn the exact MERN + Next.js + AI stack companies hire for",
    ],
  },
  "mobile-app-development": {
    icon: "smartphone",
    highlight: "Fast results",
    benefits: [
      "Publish a real app to both the Play Store and App Store",
      "Build a live chat app, e-commerce app, and AI-powered feature app",
      "Integrate Stripe payments and in-app purchases the production way",
      "Learn one codebase that ships to iOS and Android simultaneously",
    ],
  },
  "wordpress-wix-shopify-3-months": {
    icon: "store",
    highlight: "Business-ready",
    benefits: [
      "Launch 4 live client-ready sites across different niches",
      "Master WooCommerce, Shopify, and Wix — plus AI builders like Framer",
      "Run a real Meta Ads campaign connected to a live store",
      "Walk out with a freelance pricing model: hourly, project, or retainer",
    ],
  },
  "frontend-web-development": {
    icon: "code",
    highlight: "Fast results",
    benefits: [
      "Build a pixel-perfect site from a real Figma/Dribbble design",
      "Master React 19 + Tailwind — the stack agencies use in 2026",
      "Ship a deployed portfolio site on Vercel, ready to show clients",
      "Move straight into Full-Stack or React Native after this track",
    ],
  },
  "digital-marketing": {
    icon: "marketing",
    highlight: "Fast results",
    benefits: [
      "Run real Meta & Google Ads campaigns with your own tracked budget",
      "Build a 30-day content calendar and an AI content workflow",
      "Learn the metrics (ROAS, CPA, CTR) that decide scale-or-kill calls",
      "Leave with a real campaign portfolio to freelance or launch an agency",
    ],
  },
  "ui-uix-graphic-design": {
    icon: "palette",
    highlight: "Fast results",
    benefits: [
      "Complete a full UX audit using 8+ real UX laws on a live app",
      "Run real usability tests and turn findings into design decisions",
      "Build a hiring-manager-ready portfolio with full case studies",
      "Learn Figma AI + Framer — the tools studios are switching to now",
    ],
  },
  "ai-development-course": {
    icon: "brain",
    highlight: "Fast results",
    benefits: [
      "Build a RAG chatbot and an AI research assistant from scratch",
      "Go from Python basics to a deployed AI SaaS product with payments",
      "Work hands-on with OpenAI, Anthropic, and LangChain — not just theory",
      "Freelance in the AI niche on Upwork ($30–100/hr)",
    ],
  },
}