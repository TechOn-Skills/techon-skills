import { ReactNode } from "react"
import { CoursesProvider } from "./courses"
import { ThemeProvider } from "./theme"
import { UserProvider } from "./user"
import { ApolloClientProvider } from "./apollo-client"
import { LecturesProvider } from "./lectures"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloClientProvider>
      <ThemeProvider>
        <UserProvider>
          <CoursesProvider>
            <LecturesProvider>
              {children}
            </LecturesProvider>
          </CoursesProvider>
        </UserProvider>
      </ThemeProvider>
    </ApolloClientProvider>
  )
}