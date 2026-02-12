import type { ICourse } from "@/utils/interfaces"

/** Format course duration for display (e.g. "6 Months", "1 Year"). */
export function formatCourseDuration(course: ICourse): string {
  const n = course.courseDurationInMonths
  if (n >= 12) return n === 12 ? "1 Year" : `${n / 12} Year (${n} months)`
  return `${n} Months`
}

/** Format course price for display (e.g. "PKR 2,500 / month"). */
export function formatCoursePrice(course: ICourse): string {
  const { currency, feePerMonth } = course
  return `${currency} ${feePerMonth.toLocaleString()} / month`
}
