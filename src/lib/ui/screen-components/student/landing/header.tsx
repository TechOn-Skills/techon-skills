import { WorkspaceHeader } from "@/lib/ui/screen-components"

export const StudentLandingHeader = ({ className }: { className?: string }) => {
    const quickLinks = [
        { label: "Courses", href: "/student/courses" },
        { label: "News", href: "/student/news" },
        { label: "Events", href: "/student/events" },
        { label: "Profile", href: "/student/profile" },
    ]

    return (
        <WorkspaceHeader
            className={className}
            contextLabel="Student workspace"
            title="Learn faster with a modern student portal."
            description="Browse courses, track assignments, stay updated with news & events, and keep your profile in sync — all in one clean, focused workspace."
            quickLinks={quickLinks}
            primaryAction={{ label: "Explore courses", href: "/student/courses" }}
            secondaryAction={{ label: "View events", href: "/student/events" }}
        />
    )
}