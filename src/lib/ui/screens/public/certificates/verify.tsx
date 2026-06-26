"use client"

import { useQuery } from "@apollo/client/react"
import { Loader2Icon, ShieldCheckIcon, ShieldXIcon } from "lucide-react"

import { CertificateView } from "@/lib/ui/useable-components/certificate-view"
import { VERIFY_CERTIFICATE } from "@/lib/graphql"

export const PublicCertificateVerifyScreen = ({ code }: { code: string }) => {
  const { data, loading, error } = useQuery<{
    verifyCertificate: {
      verificationCode: string
      studentName: string
      courseName: string
      percentage: number
      grade: string
      message: string
      status: string
      issuedAt: string | null
      template?: { titleLine?: string; subtitleLine?: string; footerLine?: string } | null
    } | null
  }>(VERIFY_CERTIFICATE, {
    variables: { code: code.toUpperCase() },
    skip: !code,
    fetchPolicy: "network-only",
  })

  const cert = data?.verifyCertificate

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2Icon className="size-10 animate-spin text-(--brand-highlight)" />
      </div>
    )
  }

  if (error || !cert) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <ShieldXIcon className="text-destructive mb-4 size-16" />
        <h1 className="text-2xl font-semibold">Certificate not found</h1>
        <p className="text-muted-foreground mt-2">
          This verification code is invalid or the certificate has not been published yet.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
        <ShieldCheckIcon className="size-6" />
        <span className="font-semibold">Verified TechOn Skills certificate</span>
      </div>
      <CertificateView
        data={{
          studentName: cert.studentName,
          courseName: cert.courseName,
          percentage: cert.percentage,
          grade: cert.grade,
          message: cert.message,
          verificationCode: cert.verificationCode,
          status: cert.status,
          titleLine: cert.template?.titleLine,
          subtitleLine: cert.template?.subtitleLine,
          footerLine: cert.template?.footerLine,
        }}
        pendingBadge={false}
      />
      {cert.issuedAt && (
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Issued on {new Date(cert.issuedAt).toLocaleDateString(undefined, { dateStyle: "long" })}
        </p>
      )}
    </div>
  )
}
