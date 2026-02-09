import { ReactNode } from "react";
import { ThemeProvider } from "./theme";
import { UserProvider } from "./user";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </ThemeProvider >
    )
}