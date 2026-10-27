import { LoadingScreen, SetPasswordScreen } from "@/lib/ui/screens";
import { Suspense } from "react";

export default function SetPassword() {
    return <Suspense fallback={<LoadingScreen />}><SetPasswordScreen /></Suspense>
}
