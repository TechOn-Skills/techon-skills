import { UserRole } from "@/utils/enums/user"

type CourseRow = { id: string; title: string; slug?: string; courseDurationInMonths?: number | null }

/** Super-admin and admin see all courses; instructors only see assigned courses. */
export function filterCoursesForGrader(
  allCourses: CourseRow[],
  role: UserRole | undefined,
  allowedMarkGradesOn: string[] | undefined
): CourseRow[] {
  if (!role || role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) return allCourses
  const allowed = allowedMarkGradesOn ?? []
  return allCourses.filter((c) => allowed.includes(c.id))
}
