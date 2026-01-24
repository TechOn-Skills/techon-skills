export type StudentAssignment = {
  id: string
  title: string
  dueDate: string
  course: string
  brief: string
  requirements: string[]
}

export const STUDENT_ASSIGNMENTS: StudentAssignment[] = [
  {
    id: "a-101",
    title: "Landing Page (Hero + CTA)",
    dueDate: "2026-02-03",
    course: "Web Development",
    brief:
      "Create a responsive landing hero section with a CTA button and feature cards.",
    requirements: [
      "Use semantic HTML and Tailwind",
      "Mobile-first responsive layout",
      "Include at least 3 feature cards",
    ],
  },
  {
    id: "a-102",
    title: "API Fetch + Loading State",
    dueDate: "2026-02-07",
    course: "Software Engineering",
    brief:
      "Implement a fetch flow (mock API) with loading, empty, and error states.",
    requirements: [
      "Show a skeleton/loader",
      "Handle empty results",
      "Handle an error state",
    ],
  },
  {
    id: "a-103",
    title: "Mobile Screen Navigation",
    dueDate: "2026-02-10",
    course: "Mobile App Development",
    brief:
      "Design a simple screen flow with a list and a details screen (mock data).",
    requirements: [
      "List screen with cards",
      "Details screen with sections",
      "Primary action button",
    ],
  },
]

