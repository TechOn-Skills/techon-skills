
"use client"

import { StudentCoursesHeader } from "@/lib/ui/screen-components"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle2Icon, Loader2Icon, SparklesIcon } from "lucide-react"

import { PUBLIC_COURSES } from "@/lib/data/public-courses"
import { Button } from "@/lib/ui/useable-components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/lib/ui/useable-components/card"

export const StudentCoursesScreen = () => {
    const [toast, setToast] = useState<null | { status: "loading" | "success"; text: string }>(null)

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

    return (
        <div className="w-full py-10">
            <StudentCoursesHeader />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
                {PUBLIC_COURSES.map((c) => (
                    <div
                        key={c.slug}
                        className="group rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.30),rgba(255,138,61,0.14),transparent_70%)] p-px transition-all hover:-translate-y-0.5 hover:shadow-xl"
                    >
                        <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
                            <div className="relative h-1.5 w-full bg-[linear-gradient(to_right,rgba(70,208,255,0.75),rgba(255,138,61,0.6))] opacity-70 transition-opacity group-hover:opacity-100" />
                            <CardHeader className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <CardTitle className="text-xl">{c.title}</CardTitle>
                                        <CardDescription className="text-sm leading-6">
                                            {c.subtitle}
                                        </CardDescription>
                                        <div className="text-muted-foreground mt-2 text-xs">
                                            Duration: <span className="font-semibold">{c.duration}</span> • {c.price}
                                        </div>
                                    </div>
                                    <span className="bg-(--brand-secondary) text-(--text-on-dark) inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                                        <SparklesIcon className="size-3.5" />
                                        Best value
                                    </span>
                                </div>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    {c.technologies.slice(0, 4).map((t) => (
                                        <div key={t.id} className="flex items-start gap-2 rounded-2xl border bg-background/40 p-3">
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
                                <Button asChild variant="outline" shape="pill">
                                    <Link href={`/courses/${c.slug}`}>View details</Link>
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="brand-secondary"
                                        shape="pill"
                                        onClick={handleEnroll}
                                    >
                                        Enroll now
                                    </Button>
                                    <Button asChild variant="ghost" shape="pill">
                                        <Link href={`/contact?course=${encodeURIComponent(c.title)}`}>Contact</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

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