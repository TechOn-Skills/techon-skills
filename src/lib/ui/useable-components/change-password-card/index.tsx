"use client"

import { KeyRoundIcon } from "lucide-react"
import { useQuery } from "@apollo/client/react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { PasswordForm } from "@/lib/ui/useable-components/password-form"
import { GET_MY_PASSWORD_STATUS } from "@/lib/graphql"

/** Settings card: set a password (if none yet) or change the current one. */
export function ChangePasswordCard() {
  const { data, refetch } = useQuery<{ userProfileInfo?: { hasPassword: boolean } }>(GET_MY_PASSWORD_STATUS, {
    fetchPolicy: "network-only",
  })
  const hasPassword = Boolean(data?.userProfileInfo?.hasPassword)

  return (
    <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
      <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRoundIcon className="size-5 text-(--brand-accent)" />
            <div>
              <CardTitle className="text-base">{hasPassword ? "Change password" : "Create a password"}</CardTitle>
              <CardDescription className="text-xs">
                {hasPassword
                  ? "Saving a new password signs you out on your other devices."
                  : "Sign in with email and password instead of an emailed link each time."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PasswordForm
            requireCurrent={hasPassword}
            submitLabel={hasPassword ? "Change password" : "Create password"}
            onSuccess={() => void refetch()}
          />
        </CardContent>
      </Card>
    </div>
  )
}
