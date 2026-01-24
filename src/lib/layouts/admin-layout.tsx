import { ReactNode } from "react"
import { AdminAppbar, AdminFooter, AdminSidebar, SidebarInset, SidebarProvider } from "@/lib/ui/useable-components"

export const AdminLayout = ({ children }: { children: ReactNode }) => {
    const containerClass =
        "w-full px-4 sm:px-6 lg:px-8 2xl:px-10"

    return (
        <SidebarProvider defaultOpen={false}>
            <AdminSidebar />
            <SidebarInset className="bg-surface min-h-svh">
                <AdminAppbar />
                <div className="flex flex-1 flex-col">
                    <div className={`${containerClass} flex-1 py-6`}>{children}</div>
                    <AdminFooter className="mt-auto" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}