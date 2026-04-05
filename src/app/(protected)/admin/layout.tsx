import { AdminLayout } from "@/lib/layouts";
import { AdminRouteGuard } from "@/lib/route-guards";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayout>
            <AdminRouteGuard>{children}</AdminRouteGuard>
        </AdminLayout>
    )
}