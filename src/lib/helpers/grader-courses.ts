import { UserRole } from "@/utils/enums/user"

type CourseRow = { id: string; title: string; slug?: string }

/** Matches backend canGradeCourse: super-admin sees all; empty allowedMarkGradesOn = all courses. */
export function filterCoursesForGrader(
  allCourses: CourseRow[],
  role: UserRole | undefined,
  allowedMarkGradesOn: string[] | undefined
): CourseRow[] {
  if (!role || role === UserRole.SUPER_ADMIN) return allCourses
  const allowed = allowedMarkGradesOn ?? []
  if (allowed.length === 0) return allCourses
  return allCourses.filter((c) => allowed.includes(c.id))
}
