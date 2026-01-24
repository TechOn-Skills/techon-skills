import { StudentLayout } from "@/lib/layouts";

export default function StudentRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <StudentLayout>
            {children}
        </StudentLayout>
    )
}