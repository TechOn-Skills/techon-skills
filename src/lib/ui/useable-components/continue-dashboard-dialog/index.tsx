"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { type ChangeEvent, FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { MailIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Input } from "@/lib/ui/useable-components/input"
import { Separator } from "@/lib/ui/useable-components/separator"
import { cn, logger } from "@/lib/helpers"
import { CONFIG } from "@/utils/constants"
import { apiService } from "@/lib/services"
import { ApiResponse } from "@/utils/interfaces"
import { LoggerLevel } from "@/utils/enums/logger"
import { ResponseStatus } from "@/utils/enums/magic-link"
import { UserRole } from "@/utils/enums/user"

import toast from "react-hot-toast"
import { useUser } from "@/lib/providers/user"


export const ContinueToDashboardDialog = ({ className }: { className?: string }) => {
  const { userProfileInfo } = useUser()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>(ResponseStatus.INFO)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResponseMessage(null)
    setResponseStatus(ResponseStatus.INFO)
    const toastId = toast.loading("Sending magic link...")
    try {
      const data: ApiResponse<null> = await apiService.sendMagicLink(formData.email.trim())
      logger({ type: LoggerLevel.INFO, message: JSON.stringify(data) })
      if (data.success) {
        const message = data.detail || data.message
        setResponseMessage(message)
        if (message.includes("requested")) {
          setResponseStatus(ResponseStatus.INFO)
        } else {
          setResponseStatus(ResponseStatus.SUCCESS)
        }
        logger({ type: LoggerLevel.INFO, message, showToast: true })
      } else {
        const message = data.detail || data.message
        setResponseMessage(message)
        setResponseStatus(ResponseStatus.ERROR)
        logger({ type: LoggerLevel.ERROR, message, showToast: true })
      }
    } catch (error) {
      logger({ type: LoggerLevel.ERROR, message: JSON.stringify(error) })
      toast.error("Failed to send magic link")
      setResponseMessage("Failed to send magic link.")
      setResponseStatus(ResponseStatus.ERROR)
    } finally {
      toast.dismiss(toastId)
    }
    setSubmitted(true)
  }

  const status = useMemo(() => {
    if (!submitted) return "idle" as const
    return responseStatus
  }, [responseStatus, submitted])

  const dashboardHref = useMemo(() => {
    if (!userProfileInfo) return null
    return userProfileInfo.role === UserRole.STUDENT
      ? CONFIG.ROUTES.STUDENT.DASHBOARD
      : CONFIG.ROUTES.ADMIN.DASHBOARD
  }, [userProfileInfo])

  if (dashboardHref) {
    return (
      <Button asChild variant="brand-secondary" shape="pill" className={cn(className)}>
        <Link href={dashboardHref}>Continue to dashboard</Link>
      </Button>
    )
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => {
      setOpen(v)
      if (!v) {
        setSubmitted(false)
        setResponseMessage(null)
        setResponseStatus(ResponseStatus.INFO)
      }
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

            {status !== "idle" && responseMessage && (
              <>
                <Separator className="my-6" />

                <div className="rounded-2xl border bg-background/50 p-4 text-sm">
                  <div className="text-primary font-semibold">
                    {status === ResponseStatus.SUCCESS ? "Magic link sent" : status === ResponseStatus.INFO ? "Please wait for approval" : "Unable to send magic link"}
                  </div>
                  <div className="text-muted-foreground mt-1 leading-7">
                    {responseMessage}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
