import { ReactNode } from "react"
import { CoursesProvider } from "./courses"
import { ThemeProvider } from "./theme"
import { UserProvider } from "./user"
import { ApolloClientProvider } from "./apollo-client"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloClientProvider>
      <ThemeProvider>
        <CoursesProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </CoursesProvider>
      </ThemeProvider>
    </ApolloClientProvider>
  )
}