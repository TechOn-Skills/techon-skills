import { redirect } from "next/navigation"

type Props = { params: Promise<{ courseSlug: string }> }

/** Chapter reader removed — course work is quizzes & assignments only. */
export default async function ChapterPage({ params }: Props) {
  const { courseSlug } = await params
  redirect(`/student/course/${courseSlug}`)
}
