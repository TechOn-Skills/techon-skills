import { CourseDetailScreen } from "@/lib/ui/screens/student/course-detail"

type Props = { params: Promise<{ courseSlug: string }> }

export default async function CoursePage({ params }: Props) {
    const { courseSlug } = await params
    return <CourseDetailScreen courseSlug={courseSlug} />
}
