"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react"
import { useQuery } from "@apollo/client/react"
import { GET_COURSES, GET_MY_FEE_STATUS } from "@/lib/graphql"
import { mapApiCourseToICourse, type IApiCourse } from "@/lib/helpers/course"
import { COURSE_DISPLAY_BY_SLUG } from "@/utils/constants/course-display"
import { useUser } from "@/lib/providers/user"
import { UserRole } from "@/utils/enums/user"
import type { ICourse, IStudentAssignment } from "@/utils/interfaces"

export interface IFeaturedCourse {
  slug: string
  title: string
  description: string
  icon: string
  bullets: string[]
}

function mapApiCoursesToICourses(apiCourses: IApiCourse[]): ICourse[] {
  return apiCourses.map((api) =>
    mapApiCourseToICourse(api)
  )
}

function deriveFeaturedCourses(courses: ICourse[]): IFeaturedCourse[] {
  return courses.map((c) => {
    const display = COURSE_DISPLAY_BY_SLUG[c.slug]
    return {
      slug: c.slug,
      title: c.title,
      description: c.subDescription ?? c.subtitle,
      icon: display?.icon ?? "code",
      bullets: display?.benefits ?? [],
    }
  })
}

export interface ICoursesContextValue {
  courses: ICourse[]
  featuredCourses: IFeaturedCourse[]
  assignments: IStudentAssignment[]
  getCourseBySlug: (slug: string) => ICourse | undefined
  getAssignmentById: (id: string) => IStudentAssignment | undefined
  loading: boolean
  error: Error | undefined
}

const CoursesContext = createContext<ICoursesContextValue | null>(null)

export function CoursesProvider({ children }: { children: ReactNode }) {
  const { userProfileInfo } = useUser()
  const isStudent = userProfileInfo?.role === UserRole.STUDENT

  const { data: feeData } = useQuery<{ getMyFeeStatus: { locked: boolean } }>(GET_MY_FEE_STATUS, {
    skip: !isStudent || !userProfileInfo?.id,
    fetchPolicy: "cache-and-network",
  })
  const feeLocked = isStudent && (feeData?.getMyFeeStatus?.locked ?? false)

  const { data, loading, error } = useQuery<{ getCourses: IApiCourse[] }>(GET_COURSES, {
    skip: feeLocked,
  })

  const courses = useMemo(
    () => (data?.getCourses ? mapApiCoursesToICourses(data.getCourses) : []),
    [data?.getCourses]
  )

  const assignments = useMemo<IStudentAssignment[]>(() => [], [])

  const featuredCourses = useMemo(
    () => deriveFeaturedCourses(courses),
    [courses]
  )

  const getCourseBySlug = useCallback(
    (slug: string) => courses.find((c) => c.slug === slug),
    [courses]
  )

  const getAssignmentById = useCallback(
    (id: string) => assignments.find((a) => a.id === id),
    [assignments]
  )

  const value = useMemo<ICoursesContextValue>(
    () => ({
      courses,
      featuredCourses,
      assignments,
      getCourseBySlug,
      getAssignmentById,
      loading: feeLocked ? false : loading,
      error: error ?? undefined,
    }),
    [courses, featuredCourses, assignments, getCourseBySlug, getAssignmentById, loading, error, feeLocked]
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
