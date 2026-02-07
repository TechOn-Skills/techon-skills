"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { type ChangeEvent, FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { MailIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Input } from "@/lib/ui/useable-components/input"
import { Separator } from "@/lib/ui/useable-components/separator"
import { cn, logger } from "@/lib/helpers"
import { CONFIG, HTTP_RESPONSES } from "@/utils/constants"
import { apiService } from "@/lib/services"
import { ApiResponse } from "@/utils/interfaces"
import { LoggerLevel } from "@/utils/enums/logger"
import toast from "react-hot-toast"

// used to remember last attempted email (and for other flows)
const ENROLLED_EMAIL_KEY = "techon:enrolledEmail"
const DASHBOARD_ALLOWED_EMAIL = "ahmadrazawebexpert@gmail.com"
const MAGIC_LINK_SENT_EMAIL = "ahmadrazayousaf30@gmail.com"

function isDashboardAllowed(email: string) {
  return email.trim().toLowerCase() === DASHBOARD_ALLOWED_EMAIL.toLowerCase()
}

export const ContinueToDashboardDialog = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const toastId = toast.loading("Sending magic link...")
    try {
      const data: ApiResponse<null> = await apiService.sendMagicLink(formData.email.trim())
      logger({ type: LoggerLevel.INFO, message: JSON.stringify(data) })
      if (data.success) {
        toast.dismiss(toastId)
        if (data.message === HTTP_RESPONSES.HTTP_RESPONSE_200.message || data.message === HTTP_RESPONSES.HTTP_RESPONSE_201.message) {
          localStorage.setItem(CONFIG.STORAGE_KEYS.TEMP.EMAIL, formData.email.trim())
        }
        logger({ type: LoggerLevel.INFO, message: data.detail || data.message, showToast: true })
      } else {
        toast.dismiss(toastId)
        logger({ type: LoggerLevel.ERROR, message: data.detail || data.message, showToast: true })
      }
    } catch (error) {
      logger({ type: LoggerLevel.ERROR, message: JSON.stringify(error) });
      toast.error("Failed to send magic link")
    } finally {
      toast.dismiss(toastId)
    }
    setSubmitted(true)
  }

  const status = useMemo(() => {
    if (!submitted) return "idle" as const
    // Explicit behavior requested:
    // - allow dashboard for DASHBOARD_ALLOWED_EMAIL
    // - for any other email show enroll-required messaging
    return isDashboardAllowed(formData.email) ? ("magic" as const) : ("enroll" as const)
  }, [formData.email, submitted])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => {
      setOpen(v)
      if (!v) setSubmitted(false)
    }}>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="brand-secondary"
          shape="pill"
          className={cn(className)}
        >
          Continue to dashboard
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "bg-card text-primary data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed left-1/2 top-1/2 z-50 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border shadow-xl outline-none"
          )}
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="bg-(--brand-primary) text-(--text-on-dark) inline-flex size-10 items-center justify-center rounded-2xl">
                <MailIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <DialogPrimitive.Title className="text-primary text-lg font-semibold">
                  Continue to dashboard
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-muted-foreground text-sm">
                  Enter your enrolled email to receive a magic link.
                </DialogPrimitive.Description>
              </div>
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={handleSubmit}
            >
              <Input
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="h-11 rounded-full"
                required
              />

              <Button
                type="submit"
                variant="brand-secondary"
                shape="pill"
                className="h-11 w-full"
              >
                Send magic link
              </Button>
            </form>

            {status !== "idle" && (
              <>
                <Separator className="my-6" />

                {status === "magic" ? (
                  <div className="rounded-2xl border bg-background/50 p-4 text-sm">
                    <div className="text-primary font-semibold">
                      Magic link sent to {MAGIC_LINK_SENT_EMAIL}
                    </div>
                    <div className="text-muted-foreground mt-1 leading-7">
                      Check your email inbox. After you sign in, you’ll be redirected to your dashboard.
                    </div>
                    <div className="mt-3">
                      <Button asChild variant="outline" shape="pill">
                        <Link href={CONFIG.ROUTES.STUDENT.DASHBOARD}>Open dashboard</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border bg-background/50 p-4 text-sm">
                    <div className="text-primary font-semibold">
                      Dashboard access is available after enrollment
                    </div>
                    <div className="text-muted-foreground mt-1 leading-7">
                      Dashboard access is available after enrollment. Explore courses and enroll to get started.
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Button asChild variant="brand-secondary" shape="pill">
                        <Link href="/courses" onClick={() => setOpen(false)}>View courses</Link>
                      </Button>
                      <Button asChild variant="outline" shape="pill">
                        <Link href="/contact" onClick={() => setOpen(false)}>Contact us</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { ENROLLED_EMAIL_KEY }

