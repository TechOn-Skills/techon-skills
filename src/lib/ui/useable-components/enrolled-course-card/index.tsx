"use client"

import Link from "next/link"
import { BookOpenIcon, ChevronRightIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"

type Props = {
  slug: string
  title: string
  className?: string
}

export function EnrolledCourseCard({ slug, title, className }: Props) {
  return (
    <Link href={`/student/course/${slug}`} className={cn("block", className)}>
      <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="bg-(--brand-secondary)/15 text-(--brand-secondary) flex size-12 shrink-0 items-center justify-center rounded-xl">
            <BookOpenIcon className="size-6" />
          </div>
          <CardTitle className="mt-3 text-lg leading-tight">{title}</CardTitle>
          <CardDescription>Quizzes &amp; assignments</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-1 text-sm font-medium text-(--brand-highlight)">
          <span>Open course</span>
          <ChevronRightIcon className="size-4" />
        </CardContent>
      </Card>
    </Link>
  )
}
