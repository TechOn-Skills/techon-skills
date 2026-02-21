import { StudentLayout } from "@/lib/layouts";
import { StudentRouteGuard } from "@/lib/route-guards";

export default function StudentRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <StudentRouteGuard>
            <StudentLayout>
                {children}
            </StudentLayout>
        </StudentRouteGuard>
    )
}