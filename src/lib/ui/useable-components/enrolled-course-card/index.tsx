"use client"

import Link from "next/link"
import { BookOpenIcon, ChevronRightIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { ProgressRing } from "@/lib/ui/useable-components/progress-ring"
import { cn } from "@/lib/helpers"

type Props = {
    slug: string
    title: string
    progressPercent: number
    className?: string
}

export function EnrolledCourseCard({ slug, title, progressPercent, className }: Props) {
    return (
        <Link href={`/student/course/${slug}`} className={cn("block", className)}>
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                        <div className="bg-(--brand-secondary)/15 text-(--brand-secondary) flex size-12 shrink-0 items-center justify-center rounded-xl">
                            <BookOpenIcon className="size-6" />
                        </div>
                        <ProgressRing value={progressPercent} size={48} strokeWidth={4}>
                            <span className="text-xs font-bold tabular-nums text-(--brand-primary) dark:text-(--text-primary-dark)">
                                {progressPercent}%
                            </span>
                        </ProgressRing>
                    </div>
                    <CardTitle className="mt-3 text-lg leading-tight">{title}</CardTitle>
                    <CardDescription>
                        {progressPercent >= 100 ? "Completed" : progressPercent > 0 ? `${progressPercent}% complete` : "Not started"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-1 text-sm font-medium text-(--brand-highlight)">
                    <span>Open course</span>
                    <ChevronRightIcon className="size-4" />
                </CardContent>
            </Card>
        </Link>
    )
}
