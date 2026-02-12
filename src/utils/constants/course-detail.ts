export const HERO_GRADIENT_CLASS =
  "bg-[radial-gradient(circle_at_top,rgba(79,195,232,0.3),transparent_60%),radial-gradient(circle_at_bottom,rgba(242,140,40,0.2),transparent_55%)]"

export const COURSE_DETAIL = {
  notFound: {
    title: "Course not found",
    description: "Go back to courses.",
    backLabel: "View all courses",
  },
  hero: {
    cardTitle: "What you'll become",
    cardDescription:
      "A confident builder with real projects and a structured submission + marks flow.",
    bullets: [
      "Build portfolio-worthy projects",
      "Submit assignments and get marks",
      "Learn industry workflows (Git, deployments, clean code)",
    ],
    careerNote:
      "TechOn Skills offers job opportunities to deserving candidates who show consistent performance, strong projects, and discipline during the course journey.",
    enrollLabel: "Enroll now",
    backToCoursesLabel: "Back to courses",
  },
  articleSection: {
    badgeLabel: "Why students love it",
    heading: "Amazing things you'll get from this course",
    subtext:
      "Real outcomes, real skills, and a path that leads to confidence and career growth.",
  },
  technologies: {
    label: "Technologies",
    heading: "Tools you'll master (with real projects)",
    subtext:
      "You won't just “see” these technologies — you'll build with them, submit work, and track marks.",
  },
  steps: {
    label: "Your step‑by‑step path",
    heading: "From day 1 to job-ready outcomes",
    subtext:
      "This is the exact flow students follow inside the platform. It keeps motivation high and results measurable.",
    items: [
      { title: "Step 1: Enroll", description: "Choose your track and set your weekly study plan.", iconKey: "rocket" },
      { title: "Step 2: Learn", description: "Attend structured lectures and understand core concepts.", iconKey: "graduation-cap" },
      { title: "Step 3: Practice", description: "Work on guided tasks and real projects.", iconKey: "clipboard-list" },
      { title: "Step 4: Submit", description: "Submit assignments directly from your dashboard.", iconKey: "list-checks" },
      { title: "Step 5: Marks + Growth", description: "Get marks, see progress, and qualify for career support.", iconKey: "trophy" },
    ],
  },
  infoCard: {
    items: [
      { key: "weekly", label: "Weekly plan", value: "2–4 live sessions + practice" },
      { key: "assignments", label: "Assignments", value: "Submit weekly tasks + projects" },
      { key: "career", label: "Career support", value: "For top performers" },
    ],
  },
  cta: {
    heading: "Ready to start?",
    subtext: "Send your details and we'll guide you to enrollment.",
    buttonLabel: "Enroll now",
  },
} as const
