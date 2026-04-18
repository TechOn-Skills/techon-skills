import { StudentLayout } from "@/lib/layouts";
import { StudentApprovalGate, StudentFeeGate, StudentRouteGuard } from "@/lib/route-guards";

export default function StudentRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <StudentRouteGuard>
            <StudentApprovalGate>
                <StudentFeeGate>
                    <StudentLayout>{children}</StudentLayout>
                </StudentFeeGate>
            </StudentApprovalGate>
        </StudentRouteGuard>
    )
}