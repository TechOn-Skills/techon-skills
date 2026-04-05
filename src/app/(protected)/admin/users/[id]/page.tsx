import { AdminUserDetailScreen } from "@/lib/ui/screens/admin/users/detail"

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AdminUserDetailScreen id={id} />
}
