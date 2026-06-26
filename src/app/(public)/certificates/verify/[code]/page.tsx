import { PublicCertificateVerifyScreen } from "@/lib/ui/screens/public/certificates/verify"

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <PublicCertificateVerifyScreen code={code} />
}
