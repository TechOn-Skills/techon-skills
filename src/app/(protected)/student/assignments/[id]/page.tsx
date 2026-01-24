import { StudentAssignmentDetailScreen } from "@/lib/ui/screens/student/assignments/detail"

export default async function StudentAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StudentAssignmentDetailScreen assignmentId={id} />
}

