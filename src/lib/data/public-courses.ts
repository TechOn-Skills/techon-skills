import {
  CodeIcon,
  DatabaseIcon,
  LayersIcon,
  LayoutDashboardIcon,
  NetworkIcon,
  SmartphoneIcon,
  StoreIcon,
  WrenchIcon,
} from "lucide-react"

export type CourseSection = {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export type PublicCourse = {
  slug: string
  title: string
  subtitle: string
  duration: string
  price: string
  heroGradient: string
  sections: CourseSection[]
}

export const PUBLIC_COURSES: PublicCourse[] = [
  {
    slug: "software-engineering",
    title: "Software Engineering",
    subtitle:
      "Go from full-stack developer to high-level engineer who can handle complex data, architecture, and scalability.",
    duration: "1 Year (Comprehensive Program)",
    price: "PKR 2,500 / month",
    heroGradient:
      "bg-[radial-gradient(circle_at_top,rgba(79,195,232,0.35),transparent_55%),radial-gradient(circle_at_bottom,rgba(242,140,40,0.20),transparent_55%)]",
    sections: [
      {
        title: "Phase 1: The MERN Core (Months 1–6)",
        description:
          "Frontend: React hooks, Context API, and state management. Backend: Node.js runtime and Express framework. Database: NoSQL modeling with MongoDB.",
        icon: LayersIcon,
      },
      {
        title: "Phase 2: Specialized Tooling (Months 7–9)",
        description:
          "Python integration for data processing, automation scripts, and FastAPI basics. Advanced databases: move from NoSQL to relational data with PostgreSQL.",
        icon: DatabaseIcon,
      },
      {
        title: "Phase 3: Architecture & Design (Months 10–12)",
        description:
          "API design: RESTful principles vs GraphQL flexibility. System design: scalability, load balancing, caching strategies, and microservices architecture.",
        icon: NetworkIcon,
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
    heroGradient:
      "bg-[radial-gradient(circle_at_top,rgba(79,195,232,0.35),transparent_60%),radial-gradient(circle_at_bottom,rgba(27,119,182,0.25),transparent_55%)]",
    sections: [
      {
        title: "Frontend Fundamentals",
        description:
          "HTML5 & CSS3 (semantic markup, Flexbox, Grid, responsive design) + Modern JavaScript (ES6+, async programming, DOM manipulation).",
        icon: CodeIcon,
      },
      {
        title: "The React Ecosystem",
        description:
          "Component-based architecture, SPAs, reusable UI patterns, and modern tooling used in real teams.",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Backend & Database",
        description:
          "Build APIs with Node.js + CRUD operations and schema design with MongoDB.",
        icon: DatabaseIcon,
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
    heroGradient:
      "bg-[radial-gradient(circle_at_top,rgba(242,140,40,0.24),transparent_60%),radial-gradient(circle_at_bottom,rgba(79,195,232,0.25),transparent_55%)]",
    sections: [
      {
        title: "The Mobile Frontend",
        description:
          "React Native: native components, navigation (React Navigation), and touch interactions.",
        icon: SmartphoneIcon,
      },
      {
        title: "Device Features",
        description:
          "Access camera, GPS, and local storage while keeping performance smooth.",
        icon: WrenchIcon,
      },
      {
        title: "Universal Backend + Dual Database Strategy",
        description:
          "Node.js & Express for a centralized API. MongoDB for flexible profiles + PostgreSQL for transactional data and complex querying.",
        icon: DatabaseIcon,
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
    heroGradient:
      "bg-[radial-gradient(circle_at_top,rgba(27,119,182,0.28),transparent_60%),radial-gradient(circle_at_bottom,rgba(242,140,40,0.22),transparent_55%)]",
    sections: [
      {
        title: "Shopify: E‑Commerce Specialist",
        description:
          "Store infrastructure (account, domain, payments), product architecture (inventory, variants, collections), theme engine (Online Store 2.0 + Liquid basics), and the ecosystem (apps for reviews/upsells/email).",
        icon: StoreIcon,
      },
      {
        title: "WordPress: The Open‑Source Powerhouse",
        description:
          "Core management (hosting, database basics), visual building (Elementor/Gutenberg), plugins + SEO (security/caching/Yoast/RankMath), and dynamic data (CPTs + WooCommerce).",
        icon: DatabaseIcon,
      },
      {
        title: "Wix: Design & Rapid Prototyping",
        description:
          "Wix Studio & Editor (responsive breakpoints, animations), vertical solutions (Bookings/Events), Velo basics (JS + collections), and business suite (CRM + invoicing + SEO Wiz).",
        icon: WrenchIcon,
      },
    ],
  },
]

export function getPublicCourse(slug: string) {
  return PUBLIC_COURSES.find((c) => c.slug === slug)
}

