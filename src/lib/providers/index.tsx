import { ReactNode } from "react"
import { CoursesProvider } from "./courses"
import { ThemeProvider } from "./theme"
import { UserProvider } from "./user"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CoursesProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </CoursesProvider>
    </ThemeProvider>
  )
}