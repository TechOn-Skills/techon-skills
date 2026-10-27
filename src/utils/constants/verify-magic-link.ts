import { MagicLinkStatus } from "@/utils/enums";

export const VERIFY_MAGIC_LINK_STATUS_CONTENT = {
    [MagicLinkStatus.IDLE]: {
        title: "Preparing verification",
        description: "Getting everything ready for a secure sign-in experience.",
        accent: "bg-slate-500/10 text-slate-600",
    },
    [MagicLinkStatus.VERIFYING]: {
        title: "Verifying your sign-in link",
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
        description: "This link is invalid, expired or already used. Request a new sign-in link from the website.",
        accent: "bg-rose-500/10 text-rose-600",
    },
}