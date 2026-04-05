import { ChapterReaderScreen } from "@/lib/ui/screens/student/chapter-reader"

type Props = {
    params: Promise<{ courseSlug: string; moduleSlug: string; chapterSlug: string }>
}

function toTitle(slug: string): string {
    return slug
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default async function ChapterPage({ params }: Props) {
    const { courseSlug, moduleSlug, chapterSlug } = await params
    const chapterTitle = toTitle(chapterSlug)
    return (
        <ChapterReaderScreen
            courseSlug={courseSlug}
            moduleSlug={moduleSlug}
            chapterSlug={chapterSlug}
            chapterTitle={chapterTitle}
        />
    )
}
