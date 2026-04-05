import { StudentArticleDetailScreen } from "@/lib/ui/screens/student/articles/detail"

export default async function StudentArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <StudentArticleDetailScreen slug={slug} />
}
