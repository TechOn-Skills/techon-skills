export interface IAdminUserListItem {
  id: string
  name: string
  email: string
  phone: string
  role: "student" | "instructor" | "admin"
  status: "active" | "inactive" | "suspended"
  enrolledCourse?: string
  joinedDate: string
  lastActive: string
}
