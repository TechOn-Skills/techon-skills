"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { type ChangeEvent, FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2Icon, MailIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Input } from "@/lib/ui/useable-components/input"
import { cn, getApiDisplayMessage, logger } from "@/lib/helpers"
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
        const message = getApiDisplayMessage(data, "Magic link sent.")
        setResponseMessage(message)
        if (message.includes("requested")) {
          setResponseStatus(ResponseStatus.INFO)
        } else {
          setResponseStatus(ResponseStatus.SUCCESS)
        }
        logger({ type: LoggerLevel.INFO, message, showToast: true })
        setFormData({ email: "" })
      } else {
        const message = getApiDisplayMessage(data, "Unable to send magic link.")
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

  const resetDialog = () => {
    setSubmitted(false)
    setResponseMessage(null)
    setResponseStatus(ResponseStatus.INFO)
    setFormData({ email: "" })
  }

  if (dashboardHref) {
    return (
      <Button asChild variant="brand-secondary" shape="pill" className={cn("px-3 sm:px-4", className)}>
        <Link href={dashboardHref}>
          <span className="sm:hidden">Dashboard</span>
          <span className="hidden sm:inline">Continue to dashboard</span>
        </Link>
      </Button>
    )
  }

  const showSuccess = status === ResponseStatus.SUCCESS
  const showInfo = status === ResponseStatus.INFO && submitted

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => {
      setOpen(v)
      if (!v) resetDialog()
    }}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="brand-secondary" shape="pill" className={cn("max-w-46 px-3 sm:max-w-none sm:px-4", className)}>
          <span className="sm:hidden">Dashboard</span>
          <span className="hidden sm:inline">Continue to dashboard</span>
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
            {showSuccess ? (
              <div className="rounded-3xl bg-[var(--system-success)] px-6 py-10 text-center text-white">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-white/20">
                  <CheckCircle2Icon className="size-10 animate-in zoom-in-50 duration-500" strokeWidth={2.5} />
                </div>
                <DialogPrimitive.Title className="text-xl font-semibold text-white">
                  Magic link sent
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-3 text-sm leading-7 text-white/90">
                  {responseMessage ?? "Check your email inbox for the sign-in link. It may take a minute to arrive — also check spam or promotions."}
                </DialogPrimitive.Description>
                <Button
                  type="button"
                  variant="outline"
                  shape="pill"
                  className="mt-6 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
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

                {!submitted || status === ResponseStatus.ERROR ? (
                  <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                    {status === ResponseStatus.ERROR && responseMessage && (
                      <p className="text-destructive text-sm">{responseMessage}</p>
                    )}
                  </form>
                ) : showInfo ? (
                  <div className="mt-6 rounded-2xl border bg-background/50 p-4 text-sm">
                    <div className="text-primary font-semibold">Please wait for approval</div>
                    <div className="text-muted-foreground mt-1 leading-7">{responseMessage}</div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
