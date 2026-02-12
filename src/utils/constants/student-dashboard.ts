import type { ILecture } from "@/utils/interfaces"

export const LECTURES: ILecture[] = [
  {
    id: "l-1",
    course: "Web Development",
    title: "React Components & Props",
    meetUrl: "https://meet.google.com/xxx-yyyy-zzz",
    durationMins: 60,
    startOffsetSeconds: 2 * 60 * 60 + 15 * 60,
  },
  {
    id: "l-2",
    course: "Mobile App Development",
    title: "Navigation + Screens Flow",
    meetUrl: "https://meet.google.com/aaa-bbbb-ccc",
    durationMins: 60,
    startOffsetSeconds: 5 * 60 * 60 + 30 * 60,
  },
  {
    id: "l-3",
    course: "Software Engineering",
    title: "Git Workflow (Branching)",
    meetUrl: "https://meet.google.com/ddd-eeee-fff",
    durationMins: 60,
    startOffsetSeconds: 24 * 60 * 60 + 10 * 60,
  },
  {
    id: "l-4",
    course: "Web Development",
    title: "State Management Basics",
    meetUrl: "https://meet.google.com/ggg-hhhh-iii",
    durationMins: 60,
    startOffsetSeconds: 48 * 60 * 60 + 30 * 60,
  },
  {
    id: "l-5",
    course: "Software Engineering",
    title: "API Design: REST vs GraphQL",
    meetUrl: "https://meet.google.com/jjj-kkkk-lll",
    durationMins: 60,
    startOffsetSeconds: 72 * 60 * 60 + 20 * 60,
  },
]
