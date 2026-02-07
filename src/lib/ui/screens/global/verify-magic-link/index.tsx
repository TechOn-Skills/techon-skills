"use client"

import { logger } from "@/lib/helpers"
import { apiService } from "@/lib/services"
import { CONFIG, VERIFY_MAGIC_LINK_STATUS_CONTENT } from "@/utils/constants"
import { MagicLinkStatus } from "@/utils/enums"
import { LoggerLevel } from "@/utils/enums/logger"
import { ApiResponse, IUserProfileInfo } from "@/utils/interfaces"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

export const VerifyMagicLinkScreen = () => {
    const router = useRouter()

    const searchParams = useSearchParams()
    const user_id = searchParams.get("user_id")

    const [verifyingStatus, setVerifyingStatus] = useState<MagicLinkStatus>(MagicLinkStatus.IDLE)

    const handleVerifyMagicLink = useCallback(async () => {
        setVerifyingStatus(MagicLinkStatus.VERIFYING)
        const toastId = toast.loading("Please wait while we verify your magic link...")
        try {
            if (user_id) {
                const data: ApiResponse<IUserProfileInfo> = await apiService.verifyMagicLink(user_id)
                if (!data.success) {
                    logger({ type: LoggerLevel.ERROR, message: data.message, showToast: true })
                    setVerifyingStatus(MagicLinkStatus.ERROR)
                } else {
                    setVerifyingStatus(MagicLinkStatus.VERIFIED)
                    router.push(CONFIG.ROUTES.STUDENT.DASHBOARD)
                }
            } else {
                logger({ type: LoggerLevel.ERROR, message: "Unable to verify magic link please try again", showToast: true })
                router.push(CONFIG.ROUTES.PUBLIC.HOME)
            }
        } catch (error) {
            logger({ type: LoggerLevel.ERROR, message: JSON.stringify(error), showToast: true })
            setVerifyingStatus(MagicLinkStatus.ERROR)
            toast.error("Failed to verify magic link")
        } finally {
            toast.dismiss(toastId)
        }
    }, [user_id, router])

    useEffect(() => {
        handleVerifyMagicLink()
    }, [handleVerifyMagicLink])

    if (!user_id) {
        logger({ type: LoggerLevel.ERROR, message: "Unable to verify magic link please try again", showToast: true })
        router.push(CONFIG.ROUTES.PUBLIC.HOME)
        return null
    }

    const statusContent = VERIFY_MAGIC_LINK_STATUS_CONTENT[verifyingStatus]

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_55%)]" />
                <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${statusContent.accent}`}>
                        {verifyingStatus === MagicLinkStatus.VERIFYING && (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                        )}
                        {verifyingStatus === MagicLinkStatus.VERIFIED && (
                            <span className="text-xl">✓</span>
                        )}
                        {verifyingStatus === MagicLinkStatus.ERROR && (
                            <span className="text-xl">!</span>
                        )}
                        {verifyingStatus === MagicLinkStatus.IDLE && (
                            <span className="text-xl">…</span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Magic Link</p>
                        <h1 className="text-2xl font-semibold text-slate-900">{statusContent.title}</h1>
                    </div>
                </div>

                <p className="mt-4 text-base text-slate-600">{statusContent.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                        { label: "Secure connection", value: "TLS encrypted" },
                        { label: "Session status", value: verifyingStatus === MagicLinkStatus.VERIFIED ? "Active" : "Pending" },
                        { label: "Redirect", value: verifyingStatus === MagicLinkStatus.VERIFIED ? "In progress" : "Queued" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <p className="text-xs uppercase tracking-widest text-slate-400">{item.label}</p>
                            <p className="mt-2 text-sm font-medium text-slate-700">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                        <span
                            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${verifyingStatus === MagicLinkStatus.ERROR ? "animate-ping bg-rose-400" : "animate-ping bg-indigo-400"
                                }`}
                        />
                        <span
                            className={`relative inline-flex h-3 w-3 rounded-full ${verifyingStatus === MagicLinkStatus.ERROR ? "bg-rose-500" : "bg-indigo-500"
                                }`}
                        />
                    </span>
                    <p className="text-sm text-slate-500">
                        {verifyingStatus === MagicLinkStatus.ERROR
                            ? "We couldn’t validate this link."
                            : "We’ll move you forward as soon as verification completes."}
                    </p>
                </div>
            </div>
        </div>
    )
}