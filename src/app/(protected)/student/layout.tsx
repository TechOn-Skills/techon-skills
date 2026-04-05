import { StudentLayout } from "@/lib/layouts";
import { StudentFeeGate, StudentRouteGuard } from "@/lib/route-guards";

export default function StudentRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <StudentRouteGuard>
            <StudentFeeGate>
                <StudentLayout>{children}</StudentLayout>
            </StudentFeeGate>
        </StudentRouteGuard>
    )
}