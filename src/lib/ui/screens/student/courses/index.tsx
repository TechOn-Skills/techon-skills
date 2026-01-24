
import { StudentCoursesHeader } from "@/lib/ui/screen-components"
import { Button } from "@/lib/ui/useable-components/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/lib/ui/useable-components/card"

export const StudentCoursesScreen = () => {
    return (
        <div className="w-full py-10">
            <StudentCoursesHeader />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((course) => (
                    <Card
                        key={course}
                        className="bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50 transition-shadow hover:shadow-lg cursor-pointer"
                    >
                        <CardHeader>
                            <CardTitle>Course Title {course}</CardTitle>
                            <CardDescription>
                                Short description for course {course}. Connect this with real course data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="text-muted-foreground text-sm">
                                Instructor: Example Name
                            </div>
                            <Button variant="default" shape="pill" className="w-fit">
                                View course
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}