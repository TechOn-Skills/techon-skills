import { StudentLandingHeader } from "@/lib/ui/screen-components"
import { Button } from "@/lib/ui/useable-components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/lib/ui/useable-components/card"

export const StudentLandingScreen = () => {
    return (
        <div className="w-full py-10">
            <StudentLandingHeader />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                    <CardHeader>
                        <CardTitle>Continue where you left off</CardTitle>
                        <CardDescription>
                            Pick up a lesson in seconds — your progress stays synced.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <div className="text-muted-foreground text-sm">
                            Connect this to your real course data when ready.
                        </div>
                        <Button variant="default" shape="pill" className="w-fit">
                            Resume learning
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
                    <CardHeader>
                        <CardTitle>What’s new this week</CardTitle>
                        <CardDescription>
                            Fresh announcements, events, and new content drops.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <div className="text-muted-foreground text-sm">
                            Hook this up to your news/events modules when available.
                        </div>
                        <Button variant="brand-secondary" shape="pill" className="w-fit">
                            View updates
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}