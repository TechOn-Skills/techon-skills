
"use client"

import { StudentCoursesHeader } from "@/lib/ui/screen-components"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { CheckCircle2Icon, Loader2Icon, SearchIcon, SparklesIcon } from "lucide-react"

import { useCourses } from "@/lib/providers/courses"
import { formatCourseDuration, formatCoursePrice } from "@/lib/helpers"
import { Button } from "@/lib/ui/useable-components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/lib/ui/useable-components/card"

export const StudentCoursesScreen = () => {
    const router = useRouter()
    const { courses } = useCourses()
    const [toast, setToast] = useState<null | { status: "loading" | "success"; text: string }>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (!toast) return
        if (toast.status !== "success") return
        const t = window.setTimeout(() => setToast(null), 2200)
        return () => window.clearTimeout(t)
    }, [toast])

    const handleEnroll = () => {
        setToast({ status: "loading", text: "Sending request…" })
        window.setTimeout(() => {
            setToast({ status: "success", text: "Request sent successfully" })
        }, 1200)
    }

    const filteredCourses = useMemo(() => {
        if (!searchQuery.trim()) return courses

        const query = searchQuery.toLowerCase().trim()

        return courses.filter((course) => {
            const durationStr = formatCourseDuration(course)
            const priceStr = formatCoursePrice(course)
            const sections = course.modules[0]?.sections ?? []
            const projects = course.modules[0]?.projects ?? []

            // Search in title
            if (course.title.toLowerCase().includes(query)) return true

            // Search in subtitle
            if (course.subtitle.toLowerCase().includes(query)) return true

            // Search in duration
            if (durationStr.toLowerCase().includes(query)) return true

            // Search in price
            if (priceStr.toLowerCase().includes(query)) return true

            // Search in technologies
            if (course.technologiesSection.technologies.some((tech) => tech.label.toLowerCase().includes(query))) return true

            // Search in sections
            if (sections.some((section) =>
                section.title.toLowerCase().includes(query) ||
                section.description.toLowerCase().includes(query)
            )) return true

            // Search in projects
            if (projects.some((project) =>
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query)
            )) return true

            return false
        })
    }, [searchQuery, courses])

    return (
        <div className="w-full py-10">
            <StudentCoursesHeader
                searchProps={{
                    type: "text",
                    placeholder: "Search courses, technologies, or skills...",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value)
                }}
            />

            {filteredCourses.length === 0 ? (
                <div className="flex min-h-[400px] items-center justify-center rounded-3xl border bg-background/70 backdrop-blur">
                    <div className="text-center">
                        <SearchIcon className="mx-auto size-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Try adjusting your search to find what you&apos;re looking for.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {filteredCourses.map((c) => (
                        <div
                            key={c.slug}
                            className="group rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.30),rgba(255,138,61,0.14),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
                        >
                            <Link href={`/courses/${c.slug}`} className="block">
                            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden animate-in fade-in fade-out duration-300 cursor-pointer h-full">
                                <div className="relative h-1.5 w-full bg-[linear-gradient(to_right,rgba(70,208,255,0.75),rgba(255,138,61,0.6))] opacity-70 transition-opacity group-hover:opacity-100" />
                                <CardHeader className="space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <CardTitle className="text-xl">{c.title}</CardTitle>
                                            <CardDescription className="text-sm leading-6">
                                                {c.subtitle}
                                            </CardDescription>
                                            <div className="text-muted-foreground mt-2 text-xs">
                                                Duration: <span className="font-semibold">{formatCourseDuration(c)}</span> • {formatCoursePrice(c)}
                                            </div>
                                        </div>
                                        <span className="bg-(--brand-secondary) text-(--text-on-dark) inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                                            <SparklesIcon className="size-3.5" />
                                            Best value
                                        </span>
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {c.technologiesSection.technologies.slice(0, 4).map((t) => (
                                            <div key={t.label} className="flex items-start gap-2 rounded-2xl border bg-background/40 p-3">
                                                <CheckCircle2Icon className="mt-0.5 size-4 text-(--brand-highlight)" />
                                                <div className="text-sm">
                                                    <div className="font-semibold">{t.label}</div>
                                                    <div className="text-muted-foreground text-xs">Real projects</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-foreground shrink-0 whitespace-nowrap inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium">
                                        View details
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="brand-secondary"
                                            shape="pill"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleEnroll()
                                            }}
                                        >
                                            Enroll now
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            shape="pill"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                router.push(`/contact?course=${encodeURIComponent(c.slug)}`)
                                            }}
                                        >
                                            Contact
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {!!toast && (
                <div className="fixed right-4 top-20 z-50 w-[min(22rem,calc(100vw-2rem))]">
                    <div className="rounded-2xl border bg-background/80 p-4 shadow-xl backdrop-blur supports-backdrop-filter:bg-background/60">
                        <div className="flex items-center gap-3">
                            {toast.status === "loading" ? (
                                <Loader2Icon className="size-5 animate-spin text-(--brand-highlight)" />
                            ) : (
                                <CheckCircle2Icon className="size-5 text-(--brand-highlight)" />
                            )}
                            <div className="text-sm font-semibold">{toast.text}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}