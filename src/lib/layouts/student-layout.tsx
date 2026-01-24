import { StudentAppbar, StudentFooter, StudentSidebar, SidebarInset, SidebarProvider } from "@/lib/ui/useable-components"
import { ReactNode } from "react"

export const StudentLayout = ({ children }: { children: ReactNode }) => {
    const containerClass =
        "w-full px-4 sm:px-6 lg:px-8 2xl:px-10"

    return (
        <SidebarProvider defaultOpen={false}>
            <StudentSidebar />
            <SidebarInset className="bg-foreground min-h-svh">
                <StudentAppbar />
                <div className="flex flex-1 flex-col">
                    <div className={`${containerClass} flex-1 py-6`}>{children}</div>
                    <StudentFooter className="mt-auto" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}