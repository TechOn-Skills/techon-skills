import { StudentCertificateDetailScreen } from "@/lib/ui/screens/student/certificates/detail"

export default async function StudentCertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StudentCertificateDetailScreen certificateId={id} />
}
