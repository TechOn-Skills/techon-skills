import { AdminLayout } from "@/lib/layouts";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    )
}