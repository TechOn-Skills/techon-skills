import { ReactNode } from "react";
import { ThemeProvider } from "./theme";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    )
}