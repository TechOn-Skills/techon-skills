import { PublicCourseDetailScreen } from "@/lib/ui/screens/public/courses/detail"

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <PublicCourseDetailScreen slug={slug} />
}

