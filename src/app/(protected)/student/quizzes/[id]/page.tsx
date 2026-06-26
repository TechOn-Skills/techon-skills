import { StudentQuizDetailScreen } from "@/lib/ui/screens/student/quizzes/detail"

type Props = { params: Promise<{ id: string }> }

export default async function StudentQuizDetailPage({ params }: Props) {
  const { id } = await params
  return <StudentQuizDetailScreen quizId={id} />
}
