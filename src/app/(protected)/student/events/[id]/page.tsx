import { StudentEventDetailScreen } from "@/lib/ui/screens/student/events/detail"

export default async function StudentEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StudentEventDetailScreen id={id} />
}
