import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <p className="text-sm text-primary">Loading...</p>
            <p className="text-sm text-primary">Please wait while we load the page...</p>
            <p className="text-sm text-primary">This may take a few seconds...</p>
            <p className="text-sm text-primary">If it takes too long, please refresh the page...</p>
            <p className="text-sm text-primary">If you continue to see this message, please contact support...</p>
            <p className="text-sm text-primary">Thank you for your patience...</p>
        </div>
    )
}