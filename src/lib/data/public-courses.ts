import type { ICourse } from "@/utils/interfaces"

/** Single source: one big array using only Course schema fields. */
export const COURSES: ICourse[] = [
  {
    slug: "software-engineering",
    title: "Software Engineering",
    subtitle:
      "Go from full-stack developer to high-level engineer who can handle complex data, architecture, and scalability.",
    heroDescription:
      "Go from full-stack developer to high-level engineer who can handle complex data, architecture, and scalability.",
    subDescription:
      "System design, PostgreSQL, advanced tooling, and career growth support.",
    courseDurationInMonths: 12,
    feePerMonth: 2500,
    totalFee: 30000,
    totalNumberOfInstallments: 12,
    currency: "PKR",
    technologiesSection: {
      title: "Tools you'll master (with real projects)",
      description:
        "You won't just “see” these technologies — you'll build with them, submit work, and track marks.",
      technologies: [
        { label: "React", description: "React", logo: "" },
        { label: "Node.js", description: "Node.js", logo: "" },
        { label: "Express", description: "Express", logo: "" },
        { label: "MongoDB", description: "MongoDB", logo: "" },
        { label: "Python", description: "Python", logo: "" },
        { label: "FastAPI", description: "FastAPI", logo: "" },
        { label: "PostgreSQL", description: "PostgreSQL", logo: "" },
        { label: "GraphQL", description: "GraphQL", logo: "" },
      ],
    },
    modules: [
      {
        name: "Software Engineering",
        description: "Comprehensive program from MERN to system design.",
        sections: [
          {
            title: "Phase 1: The MERN Core (Months 1–6)",
            description:
              "Frontend: React hooks, Context API, and state management. Backend: Node.js runtime and Express framework. Database: NoSQL modeling with MongoDB.",
          },
          {
            title: "Phase 2: Specialized Tooling (Months 7–9)",
            description:
              "Python integration for data processing, automation scripts, and FastAPI basics. Advanced databases: move from NoSQL to relational data with PostgreSQL.",
          },
          {
            title: "Phase 3: Architecture & Design (Months 10–12)",
            description:
              "API design: RESTful principles vs GraphQL flexibility. System design: scalability, load balancing, caching strategies, and microservices architecture.",
          },
        ],
        projects: [
          { title: "API Fetch + Loading State", description: "Implement a fetch flow (mock API) with loading, empty, and error states.", attachments: [], dueDate: "2026-02-07" },
          { title: "Data processing service", description: "Python automation + FastAPI endpoints for real workflows.", attachments: [], dueDate: "2026-03-01" },
          { title: "Scalable API design", description: "REST vs GraphQL, caching, and system design thinking.", attachments: [], dueDate: "2026-04-01" },
        ],
      },
    ],
    articleFeatures: [
      { name: "Think like a senior engineer", description: "You'll learn to design systems, weigh trade-offs, and communicate with stakeholders — the same mindset senior engineers use daily. Code is just the start; impact comes from how you think and collaborate.", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" },
      { name: "Build real systems, not toy apps", description: "Every phase ends with a project that mirrors real product work: APIs, data models, and deployment. Your portfolio will show hiring managers you can own a feature end-to-end and ship with confidence.", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" },
      { name: "Career support when you're ready", description: "Consistent work and strong projects unlock 1:1 career guidance and job referrals. We help deserving candidates land roles at product companies and startups — not just complete the course, but start the next chapter.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
    ],
  },
  {
    slug: "web-development",
    title: "Full‑Stack Web Development",
    subtitle:
      "A focused, fast-paced track designed to get you job-ready with modern industry standards.",
    heroDescription:
      "A focused, fast-paced track designed to get you job-ready with modern industry standards.",
    subDescription:
      "Portfolio projects, job-ready React + APIs, deployments and Git workflow.",
    courseDurationInMonths: 6,
    feePerMonth: 2500,
    totalFee: 15000,
    totalNumberOfInstallments: 6,
    currency: "PKR",
    technologiesSection: {
      title: "Tools you'll master (with real projects)",
      description:
        "You won't just “see” these technologies — you'll build with them, submit work, and track marks.",
      technologies: [
        { label: "React", description: "React", logo: "" },
        { label: "Next.js", description: "Next.js", logo: "" },
        { label: "Node.js", description: "Node.js", logo: "" },
        { label: "Express", description: "Express", logo: "" },
        { label: "MongoDB", description: "MongoDB", logo: "" },
      ],
    },
    modules: [
      {
        name: "Web Development",
        description: "Frontend to backend with real projects.",
        sections: [
          { title: "Frontend Fundamentals", description: "HTML5 & CSS3 (semantic markup, Flexbox, Grid, responsive design) + Modern JavaScript (ES6+, async programming, DOM manipulation)." },
          { title: "The React Ecosystem", description: "Component-based architecture, SPAs, reusable UI patterns, and modern tooling used in real teams." },
          { title: "Backend & Database", description: "Build APIs with Node.js + CRUD operations and schema design with MongoDB." },
        ],
        projects: [
          { title: "Landing Page (Hero + CTA)", description: "Create a responsive landing hero section with a CTA button and feature cards.", attachments: [], dueDate: "2026-02-03" },
          { title: "API-driven app", description: "CRUD, auth, and a real deployment workflow.", attachments: [], dueDate: "2026-03-01" },
          { title: "Portfolio project", description: "A polished project you can confidently show.", attachments: [], dueDate: "2026-04-01" },
        ],
      },
    ],
    articleFeatures: [
      { name: "A portfolio that gets you callbacks", description: "You'll finish with a modern marketing site, an API-driven app with auth, and a polished project you can demo in interviews. Each piece is built to look and feel like real production work.", image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80" },
      { name: "The stack companies actually hire for", description: "React, Next.js, Node, and MongoDB are used in structured projects with clear outcomes. No filler — only what helps you ship and get hired.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80" },
      { name: "Marks and feedback that keep you moving", description: "Submit work from your dashboard, get marks and feedback, and watch your progress over time. The same discipline that gets you through the course is the one that shows up in your first job.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" },
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile Application Development",
    subtitle:
      "Build high-performance cross-platform apps using a unified JavaScript codebase.",
    heroDescription:
      "Build high-performance cross-platform apps using a unified JavaScript codebase.",
    subDescription:
      "Cross-platform apps, device features (GPS/Camera), API backend + data strategy.",
    courseDurationInMonths: 6,
    feePerMonth: 2500,
    totalFee: 15000,
    totalNumberOfInstallments: 6,
    currency: "PKR",
    technologiesSection: {
      title: "Tools you'll master (with real projects)",
      description:
        "You won't just “see” these technologies — you'll build with them, submit work, and track marks.",
      technologies: [
        { label: "React Native", description: "React Native", logo: "" },
        { label: "React", description: "React", logo: "" },
        { label: "Node.js", description: "Node.js", logo: "" },
        { label: "Express", description: "Express", logo: "" },
        { label: "MongoDB", description: "MongoDB", logo: "" },
        { label: "PostgreSQL", description: "PostgreSQL", logo: "" },
      ],
    },
    modules: [
      {
        name: "Mobile Development",
        description: "Cross-platform mobile with React Native.",
        sections: [
          { title: "The Mobile Frontend", description: "React Native: native components, navigation (React Navigation), and touch interactions." },
          { title: "Device Features", description: "Access camera, GPS, and local storage while keeping performance smooth." },
          { title: "Universal Backend + Dual Database Strategy", description: "Node.js & Express for a centralized API. MongoDB for flexible profiles + PostgreSQL for transactional data and complex querying." },
        ],
        projects: [
          { title: "Mobile Screen Navigation", description: "Design a simple screen flow with a list and a details screen (mock data).", attachments: [], dueDate: "2026-02-10" },
          { title: "Device feature integration", description: "Camera/GPS/local storage with best practices.", attachments: [], dueDate: "2026-03-15" },
          { title: "Centralized backend", description: "One API serving web + mobile clients.", attachments: [], dueDate: "2026-04-15" },
        ],
      },
    ],
    articleFeatures: [
      { name: "One codebase for iOS and Android", description: "Build with React Native and ship to both platforms from a single codebase. You'll learn navigation, device APIs, and performance patterns that real teams use in production.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80" },
      { name: "Device features that feel native", description: "Camera, GPS, and local storage aren't theory — you'll wire them into real projects and handle permissions and edge cases. Your apps will feel like they belong on the device, not in a browser.", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80" },
      { name: "Backend and data strategy in one place", description: "A shared Node.js API and a dual-database approach (MongoDB + PostgreSQL) give you the full picture: how mobile clients talk to servers and how to model data for scale and clarity.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" },
    ],
  },
  {
    slug: "ecommerce",
    title: "Ecommerce (Shopify + WordPress + Wix)",
    subtitle:
      "Become business-ready: launch stores, build sites fast, and deliver client work with confidence.",
    heroDescription:
      "Become business-ready: launch stores, build sites fast, and deliver client work with confidence.",
    subDescription:
      "Client-ready stores/sites, Shopify + WP + Wix mastery, SEO + conversion setup.",
    courseDurationInMonths: 6,
    feePerMonth: 2500,
    totalFee: 15000,
    totalNumberOfInstallments: 6,
    currency: "PKR",
    technologiesSection: {
      title: "Tools you'll master (with real projects)",
      description:
        "You won't just “see” these technologies — you'll build with them, submit work, and track marks.",
      technologies: [
        { label: "Shopify", description: "Shopify", logo: "" },
        { label: "Liquid", description: "Liquid", logo: "" },
        { label: "WordPress", description: "WordPress", logo: "" },
        { label: "WooCommerce", description: "WooCommerce", logo: "" },
        { label: "Elementor", description: "Elementor", logo: "" },
        { label: "Wix", description: "Wix", logo: "" },
        { label: "Velo", description: "Velo", logo: "" },
      ],
    },
    modules: [
      {
        name: "Ecommerce",
        description: "Shopify, WordPress, and Wix for client-ready stores.",
        sections: [
          { title: "Shopify: E‑Commerce Specialist", description: "Store infrastructure (account, domain, payments), product architecture (inventory, variants, collections), theme engine (Online Store 2.0 + Liquid basics), and the ecosystem (apps for reviews/upsells/email)." },
          { title: "WordPress: The Open‑Source Powerhouse", description: "Core management (hosting, database basics), visual building (Elementor/Gutenberg), plugins + SEO (security/caching/Yoast/RankMath), and dynamic data (CPTs + WooCommerce)." },
          { title: "Wix: Design & Rapid Prototyping", description: "Wix Studio & Editor (responsive breakpoints, animations), vertical solutions (Bookings/Events), Velo basics (JS + collections), and business suite (CRM + invoicing + SEO Wiz)." },
        ],
        projects: [
          { title: "High-converting Shopify store", description: "Products, collections, theme setup, and apps ecosystem.", attachments: [], dueDate: "2026-03-01" },
          { title: "WordPress business site", description: "Builder + SEO + performance + plugin stack.", attachments: [], dueDate: "2026-04-01" },
          { title: "Wix booking/event site", description: "Design + animations + CRM/business tooling.", attachments: [], dueDate: "2026-05-01" },
        ],
      },
    ],
    articleFeatures: [
      { name: "Launch stores in weeks, not months", description: "Shopify, WordPress, and Wix are the tools clients actually pay for. You'll set up stores, themes, and funnels so you can deliver real value and win freelance or in-house roles.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" },
      { name: "Client-ready work from the start", description: "You'll learn SEO, conversion basics, and platform-specific best practices. Your projects will look and perform like agency work — the kind that wins repeat clients and referrals.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
      { name: "Three platforms, one clear path", description: "Master Shopify for e‑commerce, WordPress for content and WooCommerce, and Wix for design-led sites. You'll be the person teams hire when they need someone who can run stores and sites across the stack.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
    ],
  },
]

export function getPublicCourse(slug: string): ICourse | undefined {
  return COURSES.find((c) => c.slug === slug)
}
