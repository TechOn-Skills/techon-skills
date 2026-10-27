"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { KeyRoundIcon } from "lucide-react"

import { PasswordForm } from "@/lib/ui/useable-components/password-form"
import { useUser } from "@/lib/providers/user"
import { CONFIG } from "@/utils/constants"

/** Only allow redirects to in-app paths (never to another site). */
function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : CONFIG.ROUTES.PUBLIC.HOME
}

/**
 * Shown right after signing in with an emailed link. First-time users set a password;
 * users who forgot theirs can set a new one or skip.
 */
export const SetPasswordScreen = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refetchProfile } = useUser()
  const next = safeNext(searchParams.get("next"))
  const isFirst = searchParams.get("first") === "1"

  const done = async () => {
    await refetchProfile()
    router.push(next)
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 shrink-0 items-center justify-center rounded-2xl">
            <KeyRoundIcon className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-semibold">{isFirst ? "Create your password" : "Set a new password?"}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isFirst
                ? "Next time, sign in with your email and this password. No email link needed."
                : "If you forgot your password, choose a new one now. Otherwise you can skip this."}
            </p>
          </div>
        </div>

        <PasswordForm className="mt-6" submitLabel={isFirst ? "Create password" : "Save new password"} onSuccess={done} />

        <div className="mt-4 text-center">
          <Link href={next} onClick={() => void refetchProfile()} className="text-muted-foreground text-sm hover:underline">
            {isFirst ? "Skip for now" : "Skip, keep my current password"}
          </Link>
        </div>
      </div>
    </div>
  )
}
