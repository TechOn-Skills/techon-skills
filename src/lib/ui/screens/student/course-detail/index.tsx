"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { useUser } from "@/lib/providers/user"
import { GET_MY_COURSE_ASSIGNMENTS, GET_MY_QUIZZES, GET_PAYMENTS_BY_USER } from "@/lib/graphql"
import { isDueMonthReached } from "@/lib/helpers"
import { CONFIG } from "@/utils/constants"
import { CreditCardIcon, ListTodoIcon, ClipboardListIcon } from "lucide-react"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"

type Props = { courseSlug: string }

export const CourseDetailScreen = ({ courseSlug }: Props) => {
  const { userProfileInfo, enrolledCoursesFromApi } = useUser()

  const course = useMemo(
    () => enrolledCoursesFromApi?.find((c) => c.slug === courseSlug) ?? null,
    [enrolledCoursesFromApi, courseSlug]
  )

  const { data: paymentsData } = useQuery<{
    getPaymentsByUser: Array<{ courseDetails?: { courseId: string } | null; isPaid: boolean; paymentDate: string }>
  }>(GET_PAYMENTS_BY_USER, {
    variables: { userId: userProfileInfo?.id ?? "" },
    skip: !userProfileInfo?.id || !course?.id,
  })

  const { data: assignData } = useQuery<{ getMyCourseAssignments: { id: string; courseId: string }[] }>(
    GET_MY_COURSE_ASSIGNMENTS,
    { skip: !userProfileInfo?.id, fetchPolicy: "cache-first" }
  )
  const { data: quizData } = useQuery<{ getMyQuizzes: { id: string; courseId: string }[] }>(GET_MY_QUIZZES, {
    skip: !userProfileInfo?.id,
    fetchPolicy: "cache-first",
  })

  const assignmentCount = (assignData?.getMyCourseAssignments ?? []).filter((a) => a.courseId === course?.id).length
  const quizCount = (quizData?.getMyQuizzes ?? []).filter((q) => q.courseId === course?.id).length

  const hasPendingFee = useMemo(() => {
    if (!course?.id || !paymentsData?.getPaymentsByUser?.length) return false
    return paymentsData.getPaymentsByUser.some(
      (p) => p.courseDetails?.courseId === course.id && !p.isPaid && isDueMonthReached(p.paymentDate)
    )
  }, [course?.id, paymentsData?.getPaymentsByUser])

  if (!course) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border bg-background/70 backdrop-blur">
        <h2 className="text-xl font-semibold">Course not found or access denied</h2>
        <p className="text-muted-foreground mt-2 text-sm">You may not be enrolled in this course.</p>
        <Link href="/student/my-enrolled-courses" className="text-(--brand-highlight) mt-4 text-sm font-medium hover:underline">
          Back to My Enrolled Courses
        </Link>
      </div>
    )
  }

  if (hasPendingFee) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border bg-background/70 backdrop-blur p-8 text-center">
        <CreditCardIcon className="text-muted-foreground mb-4 size-12" />
        <h2 className="text-xl font-semibold">This course&apos;s fee is pending</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">Clear your due fees to access quizzes and assignments.</p>
        <Button asChild variant="brand-secondary" shape="pill" className="mt-6">
          <Link href={CONFIG.ROUTES.STUDENT.FEES}>Go to Fees</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full py-6">
      <Link href="/student/my-enrolled-courses" className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm">
        ← My Enrolled Courses
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">Quizzes and assignments for this course.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={CONFIG.ROUTES.STUDENT.QUIZZES}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-(--brand-secondary)/15 text-(--brand-secondary) mb-2 flex size-11 items-center justify-center rounded-xl">
                <ClipboardListIcon className="size-5" />
              </div>
              <CardTitle>Quizzes</CardTitle>
              <CardDescription>
                {quizCount > 0
                  ? `${quizCount} published quiz${quizCount !== 1 ? "zes" : ""} — MCQ results are instant after submit.`
                  : "No quizzes yet. Your instructor will publish them here."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm font-medium text-(--brand-highlight)">Open quizzes →</CardContent>
          </Card>
        </Link>

        <Link href={CONFIG.ROUTES.STUDENT.ASSIGNMENTS}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <div className="bg-(--brand-secondary)/15 text-(--brand-secondary) mb-2 flex size-11 items-center justify-center rounded-xl">
                <ListTodoIcon className="size-5" />
              </div>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>
                {assignmentCount > 0
                  ? `${assignmentCount} assignment${assignmentCount !== 1 ? "s" : ""} — submit work; instructor marks manually.`
                  : "No assignments yet. Your instructor will publish them here."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm font-medium text-(--brand-highlight)">Open assignments →</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
