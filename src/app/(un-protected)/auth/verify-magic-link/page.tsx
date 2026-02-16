import { LoadingScreen, VerifyMagicLinkScreen } from "@/lib/ui/screens";
import { Suspense } from "react";

export default function VerifyMagicLink() {
    return <Suspense fallback={<LoadingScreen />}><VerifyMagicLinkScreen /></Suspense>
}