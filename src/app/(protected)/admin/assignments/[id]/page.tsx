import { AdminAssignmentSubmissionsScreen } from "@/lib/ui/screens/admin/assignments/detail"

export default async function AdminAssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AdminAssignmentSubmissionsScreen assignmentId={id} />
}
