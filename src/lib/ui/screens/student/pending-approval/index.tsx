"use client"

import { ClockIcon, MailIcon } from "lucide-react"
import Link from "next/link"

import { CONFIG } from "@/utils/constants"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { useUser } from "@/lib/providers/user"

export const StudentPendingApprovalScreen = () => {
  const { userProfileInfo } = useUser()
  const email = userProfileInfo?.email

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-10">
      <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl border">
        <CardHeader className="text-center">
          <div className="bg-amber-500/15 text-amber-700 dark:text-amber-400 mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl">
            <ClockIcon className="size-8" />
          </div>
          <CardTitle className="text-2xl">Awaiting approval</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Your registration was received. An administrator will review your details and fee payment screenshot. You will be able to use the full student dashboard once your account is activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
          {email ? (
            <p>
              We have your email on file: <span className="font-medium text-foreground">{email}</span>. You can sign in with a magic link after approval.
            </p>
          ) : null}
          <p className="flex items-center justify-center gap-2">
            <MailIcon className="size-4 shrink-0" />
            Questions? Reach us via the public{" "}
            <Link href={CONFIG.ROUTES.PUBLIC.CONTACT} className="text-(--brand-highlight) font-medium hover:underline">
              contact page
            </Link>
            .
          </p>
          <Button asChild variant="outline" shape="pill" className="mt-2 w-full sm:w-auto">
            <Link href={CONFIG.ROUTES.PUBLIC.HOME}>Back to website</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
