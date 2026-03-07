import { PublicNewsDetailScreen } from "@/lib/ui/screens/public/news/detail"

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PublicNewsDetailScreen id={id} />
}
