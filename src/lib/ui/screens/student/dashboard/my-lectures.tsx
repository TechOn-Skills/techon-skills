import Link from "next/link"
import { CalendarIcon, ClockIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { CONFIG } from "@/utils/constants"

const SCHEDULED = [
  {
    id: "l-1",
    title: "React Components & Props",
    course: "Web Development",
    time: "Mon 7:00 PM",
    duration: "60 min",
  },
  {
    id: "l-2",
    title: "State Management Basics",
    course: "Web Development",
    time: "Wed 7:00 PM",
    duration: "60 min",
  },
  {
    id: "l-3",
    title: "Git Workflow (Branching)",
    course: "Software Engineering",
    time: "Fri 7:00 PM",
    duration: "60 min",
  },
]

export const StudentMyLecturesScreen = () => {
  return (
    <div className="w-full py-10">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">My Lectures</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Your scheduled classes
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          This is your dashboard home. Once enrolled, your lecture schedule and course access will appear here.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {SCHEDULED.map((l) => (
          <Card key={l.id} className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
            <CardHeader>
              <CardTitle>{l.title}</CardTitle>
              <CardDescription>{l.course}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarIcon className="size-4" />
                {l.time}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <ClockIcon className="size-4" />
                {l.duration}
              </div>
              <Button asChild variant="brand-secondary" shape="pill" className="w-fit">
                <Link href={CONFIG.ROUTES.STUDENT.COURSES}>Open course</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

