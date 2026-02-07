import { IPublicCourse } from "@/utils/interfaces"

export const PUBLIC_COURSES: IPublicCourse[] = [
  {
    slug: "software-engineering",
    title: "Software Engineering",
    subtitle:
      "Go from full-stack developer to high-level engineer who can handle complex data, architecture, and scalability.",
    duration: "1 Year (Comprehensive Program)",
    price: "PKR 2,500 / month",
    icon: "wrench",
    highlight: "Career track",
    benefits: ["System design & architecture", "PostgreSQL + advanced tooling", "Career growth support"],
    sections: [
      {
        title: "Phase 1: The MERN Core (Months 1–6)",
        description:
          "Frontend: React hooks, Context API, and state management. Backend: Node.js runtime and Express framework. Database: NoSQL modeling with MongoDB.",
        icon: "layers",
      },
      {
        title: "Phase 2: Specialized Tooling (Months 7–9)",
        description:
          "Python integration for data processing, automation scripts, and FastAPI basics. Advanced databases: move from NoSQL to relational data with PostgreSQL.",
        icon: "database",
      },
      {
        title: "Phase 3: Architecture & Design (Months 10–12)",
        description:
          "API design: RESTful principles vs GraphQL flexibility. System design: scalability, load balancing, caching strategies, and microservices architecture.",
        icon: "network",
      },
    ],
    technologies: [
      { id: "react", label: "React" },
      { id: "node", label: "Node.js" },
      { id: "express", label: "Express" },
      { id: "mongodb", label: "MongoDB" },
      { id: "python", label: "Python" },
      { id: "fastapi", label: "FastAPI" },
      { id: "postgres", label: "PostgreSQL" },
      { id: "graphql", label: "GraphQL" },
    ],
    projects: [
      {
        title: "MERN product dashboard",
        description: "Authentication, roles, CRUD, and clean UI patterns.",
      },
      {
        title: "Data processing service",
        description: "Python automation + FastAPI endpoints for real workflows.",
      },
      {
        title: "Scalable API design",
        description: "REST vs GraphQL, caching, and system design thinking.",
      },
    ],
  },
  {
    slug: "web-development",
    title: "Full‑Stack Web Development",
    subtitle:
      "A focused, fast-paced track designed to get you job-ready with modern industry standards.",
    duration: "6 Months",
    price: "PKR 2,500 / month",
    icon: "code",
    highlight: "Most popular",
    benefits: ["Portfolio projects", "Job-ready React + APIs", "Deployments + Git workflow"],
    sections: [
      {
        title: "Frontend Fundamentals",
        description:
          "HTML5 & CSS3 (semantic markup, Flexbox, Grid, responsive design) + Modern JavaScript (ES6+, async programming, DOM manipulation).",
        icon: "code",
      },
      {
        title: "The React Ecosystem",
        description:
          "Component-based architecture, SPAs, reusable UI patterns, and modern tooling used in real teams.",
        icon: "layout",
      },
      {
        title: "Backend & Database",
        description:
          "Build APIs with Node.js + CRUD operations and schema design with MongoDB.",
        icon: "database",
      },
    ],
    technologies: [
      { id: "react", label: "React" },
      { id: "nextjs", label: "Next.js" },
      { id: "node", label: "Node.js" },
      { id: "express", label: "Express" },
      { id: "mongodb", label: "MongoDB" },
    ],
    projects: [
      {
        title: "Modern marketing website",
        description: "Responsive UI, components, and smooth user experience.",
      },
      {
        title: "API-driven app",
        description: "CRUD, auth, and a real deployment workflow.",
      },
      {
        title: "Portfolio project",
        description: "A polished project you can confidently show.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile Application Development",
    subtitle:
      "Build high-performance cross-platform apps using a unified JavaScript codebase.",
    duration: "6 Months (Flexible)",
    price: "PKR 2,500 / month",
    icon: "smartphone",
    highlight: "Fast results",
    benefits: ["Cross‑platform apps", "Device features (GPS/Camera)", "API backend + data strategy"],
    sections: [
      {
        title: "The Mobile Frontend",
        description:
          "React Native: native components, navigation (React Navigation), and touch interactions.",
        icon: "smartphone",
      },
      {
        title: "Device Features",
        description:
          "Access camera, GPS, and local storage while keeping performance smooth.",
        icon: "wrench",
      },
      {
        title: "Universal Backend + Dual Database Strategy",
        description:
          "Node.js & Express for a centralized API. MongoDB for flexible profiles + PostgreSQL for transactional data and complex querying.",
        icon: "database",
      },
    ],
    technologies: [
      { id: "react-native", label: "React Native" },
      { id: "react", label: "React" },
      { id: "node", label: "Node.js" },
      { id: "express", label: "Express" },
      { id: "mongodb", label: "MongoDB" },
      { id: "postgres", label: "PostgreSQL" },
    ],
    projects: [
      {
        title: "Cross-platform mobile app",
        description: "List → detail flow, navigation, and clean UI.",
      },
      {
        title: "Device feature integration",
        description: "Camera/GPS/local storage with best practices.",
      },
      {
        title: "Centralized backend",
        description: "One API serving web + mobile clients.",
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "Ecommerce (Shopify + WordPress + Wix)",
    subtitle:
      "Become business-ready: launch stores, build sites fast, and deliver client work with confidence.",
    duration: "6 Months",
    price: "PKR 2,500 / month",
    icon: "store",
    highlight: "Business-ready",
    benefits: ["Client-ready stores/sites", "Shopify + WP + Wix mastery", "SEO + conversion setup"],
    sections: [
      {
        title: "Shopify: E‑Commerce Specialist",
        description:
          "Store infrastructure (account, domain, payments), product architecture (inventory, variants, collections), theme engine (Online Store 2.0 + Liquid basics), and the ecosystem (apps for reviews/upsells/email).",
        icon: "store",
      },
      {
        title: "WordPress: The Open‑Source Powerhouse",
        description:
          "Core management (hosting, database basics), visual building (Elementor/Gutenberg), plugins + SEO (security/caching/Yoast/RankMath), and dynamic data (CPTs + WooCommerce).",
        icon: "database",
      },
      {
        title: "Wix: Design & Rapid Prototyping",
        description:
          "Wix Studio & Editor (responsive breakpoints, animations), vertical solutions (Bookings/Events), Velo basics (JS + collections), and business suite (CRM + invoicing + SEO Wiz).",
        icon: "wrench",
      },
    ],
    technologies: [
      { id: "shopify", label: "Shopify" },
      { id: "liquid", label: "Liquid" },
      { id: "wordpress", label: "WordPress" },
      { id: "woocommerce", label: "WooCommerce" },
      { id: "elementor", label: "Elementor" },
      { id: "wix", label: "Wix" },
      { id: "velo", label: "Velo" },
    ],
    projects: [
      {
        title: "High-converting Shopify store",
        description: "Products, collections, theme setup, and apps ecosystem.",
      },
      {
        title: "WordPress business site",
        description: "Builder + SEO + performance + plugin stack.",
      },
      {
        title: "Wix booking/event site",
        description: "Design + animations + CRM/business tooling.",
      },
    ],
  },
]

export function getPublicCourse(slug: string) {
  return PUBLIC_COURSES.find((c) => c.slug === slug)
}

