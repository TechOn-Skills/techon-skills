"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react"
import { COURSES } from "@/lib/data/public-courses"
import { COURSE_DISPLAY_BY_SLUG } from "@/utils/constants/course-display"
import type { ICourse, IStudentAssignment } from "@/utils/interfaces"

export interface IFeaturedCourse {
  slug: string
  title: string
  description: string
  icon: string
  bullets: string[]
}

function deriveFeaturedCourses(): IFeaturedCourse[] {
  return COURSES.map((c) => {
    const display = COURSE_DISPLAY_BY_SLUG[c.slug]
    return {
      slug: c.slug,
      title: c.title,
      description: c.heroDescription ?? c.subtitle,
      icon: display?.icon ?? "code",
      bullets: display?.benefits ?? [],
    }
  })
}

function deriveAssignments(courses: ICourse[]): IStudentAssignment[] {
  const list: IStudentAssignment[] = []
  for (const course of courses) {
    course.modules.forEach((mod, mi) => {
      mod.projects.forEach((proj, pi) => {
        const id = `${course.slug}-${mi}-${pi}`
        const dueDate =
          proj.dueDate != null && proj.dueDate !== ""
            ? typeof proj.dueDate === "string"
              ? proj.dueDate
              : (proj.dueDate as Date).toISOString().slice(0, 10)
            : ""
        list.push({
          id,
          title: proj.title,
          dueDate,
          course: course.title,
          brief: proj.description,
          requirements: [],
        })
      })
    })
  }
  return list
}

export interface ICoursesContextValue {
  courses: ICourse[]
  featuredCourses: IFeaturedCourse[]
  assignments: IStudentAssignment[]
  getCourseBySlug: (slug: string) => ICourse | undefined
  getAssignmentById: (id: string) => IStudentAssignment | undefined
}

const CoursesContext = createContext<ICoursesContextValue | null>(null)

export function CoursesProvider({ children }: { children: ReactNode }) {
  const assignments = useMemo(() => deriveAssignments(COURSES), [])
  const featuredCourses = useMemo(() => deriveFeaturedCourses(), [])

  const getCourseBySlug = useCallback((slug: string) => {
    return COURSES.find((c) => c.slug === slug)
  }, [])

  const getAssignmentById = useCallback(
    (id: string) => assignments.find((a) => a.id === id),
    [assignments]
  )

  const value = useMemo<ICoursesContextValue>(
    () => ({
      courses: COURSES,
      featuredCourses,
      assignments,
      getCourseBySlug,
      getAssignmentById,
    }),
    [assignments, featuredCourses, getCourseBySlug, getAssignmentById]
  )

  return (
    <CoursesContext.Provider value={value}>
      {children}
    </CoursesContext.Provider>
  )
}

export function useCourses(): ICoursesContextValue {
  const ctx = useContext(CoursesContext)
  if (!ctx) {
    throw new Error("useCourses must be used within a CoursesProvider")
  }
  return ctx
}
