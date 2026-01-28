export interface IEvent {
  id: string
  title: string
  description: string
  type: "workshop" | "webinar" | "hackathon" | "networking" | "career"
  date: string
  time: string
  duration: string
  location: string
  isOnline: boolean
  spotsLeft: number
  totalSpots: number
  isRegistered: boolean
  tags: string[]
  instructor?: string
}
