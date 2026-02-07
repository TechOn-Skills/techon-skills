import { MagicLinkStatus } from "@/utils/enums";

export const VERIFY_MAGIC_LINK_STATUS_CONTENT = {
    [MagicLinkStatus.IDLE]: {
        title: "Preparing verification",
        description: "Getting everything ready for a secure sign-in experience.",
        accent: "bg-slate-500/10 text-slate-600",
    },
    [MagicLinkStatus.VERIFYING]: {
        title: "Verifying your magic link",
        description: "This takes just a moment. Please keep this tab open.",
        accent: "bg-indigo-500/10 text-indigo-600",
    },
    [MagicLinkStatus.VERIFIED]: {
        title: "Verified successfully",
        description: "Welcome back! Redirecting you to your dashboard.",
        accent: "bg-emerald-500/10 text-emerald-600",
    },
    [MagicLinkStatus.ERROR]: {
        title: "Verification failed",
        description: "The link may have expired. Please request a new magic link.",
        accent: "bg-rose-500/10 text-rose-600",
    },
}