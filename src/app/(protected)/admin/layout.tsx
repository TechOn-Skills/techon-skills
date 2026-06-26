import { AdminLayout } from "@/lib/layouts";
import { AdminRouteGuard, InstructorAccessGate } from "@/lib/route-guards";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayout>
            <AdminRouteGuard>
                <InstructorAccessGate>{children}</InstructorAccessGate>
            </AdminRouteGuard>
        </AdminLayout>
    )
}