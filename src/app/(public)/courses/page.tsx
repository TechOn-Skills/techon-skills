import type { Metadata } from "next"
import { PublicCoursesScreen } from "@/lib/ui/screens/public/courses"

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Choose from Software Engineering, Web Development, Mobile App Development, and E-commerce. Learn with projects, assignments, and career support.",
  openGraph: {
    title: "Courses | TechOn Skills",
    description: "Choose from Software Engineering, Web Development, Mobile App Development, and E-commerce.",
    type: "website",
  },
  alternates: { canonical: "/courses" },
}

export default function CoursesPage() {
  return <PublicCoursesScreen />
}

