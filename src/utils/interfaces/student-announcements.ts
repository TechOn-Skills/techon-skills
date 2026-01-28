export interface IAnnouncement {
  id: string
  title: string
  content: string
  date: string
  isNew?: boolean
  category: "news" | "feature" | "achievement" | "opportunity"
}
