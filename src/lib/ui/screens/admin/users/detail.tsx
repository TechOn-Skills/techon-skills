"use client"

import Link from "next/link"
import { useQuery } from "@apollo/client/react"
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarIcon,
  Loader2Icon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { GET_USER_BY_ID } from "@/lib/graphql"
import { cn } from "@/lib/helpers"

type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN"
type UserStatus = "ACTIVE" | "INACTIVE"

type UserDetail = {
  id: string
  email: string
  fullName?: string | null
  phoneNumber?: string | null
  profilePicture?: string | null
  role: UserRole
  status: UserStatus
  isBlocked: boolean
  isSuspended: boolean
  isDeleted: boolean
  enrolledCourses?: Array<{ id: string; title: string; slug: string }>
  requestedCourses?: Array<{ id: string; title: string; slug: string }>
  payments?: Array<{ id: string; amount: number }>
  createdAt?: string
  updatedAt?: string
}

const roleConfig: Record<string, string> = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
}

export const AdminUserDetailScreen = ({ id }: { id: string }) => {
  const { data, loading, error } = useQuery<{ getUser: UserDetail | null }>(GET_USER_BY_ID, {
    variables: { id },
  })

  const user = data?.getUser

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading user...</span>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="w-full px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-background/70 backdrop-blur">
            <CardHeader>
              <CardTitle>User not found</CardTitle>
              <CardDescription>
                This user may have been removed or the link is incorrect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="brand-secondary" shape="pill">
                <Link href="/admin/users" className="gap-2">
                  <ArrowLeftIcon className="size-4" />
                  Back to users
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const enrolled = user.enrolledCourses ?? []
  const requested = user.requestedCourses ?? []
  const payments = user.payments ?? []

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
            <Link href="/admin/users" className="gap-2">
              <ArrowLeftIcon className="size-4" />
              Back to users
            </Link>
          </Button>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
            <div className="h-1.5 w-full bg-[linear-gradient(to_right,rgba(79,195,232,0.75),rgba(242,140,40,0.6))]" />
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-start gap-4">
                <div className="bg-(--brand-primary) text-(--text-on-dark) size-16 rounded-2xl flex items-center justify-center shrink-0">
                  <UserIcon className="size-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-2xl">{user.fullName || user.email}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {user.email}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                      {roleConfig[user.role] ?? user.role}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        user.isSuspended && "bg-red-500/20 text-red-600",
                        user.isBlocked && "bg-amber-500/20 text-amber-600",
                        user.isDeleted && "bg-gray-500/20 text-gray-600",
                        !user.isSuspended && !user.isBlocked && !user.isDeleted && "bg-green-500/20 text-green-600"
                      )}
                    >
                      {user.isDeleted ? "Deleted" : user.isSuspended ? "Suspended" : user.isBlocked ? "Blocked" : user.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                {user.phoneNumber && (
                  <div className="flex items-center gap-3 rounded-2xl border bg-background/40 p-4">
                    <PhoneIcon className="size-5 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <div className="font-medium">{user.phoneNumber}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-2xl border bg-background/40 p-4">
                  <MailIcon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="font-medium truncate">{user.email}</div>
                  </div>
                </div>
                {user.createdAt && (
                  <div className="flex items-center gap-3 rounded-2xl border bg-background/40 p-4">
                    <CalendarIcon className="size-5 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Joined</div>
                      <div className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="bg-background/70 backdrop-blur rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenIcon className="size-5" />
                Enrolled courses ({enrolled.length})
              </CardTitle>
              <CardDescription>Courses this user is enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolled.length === 0 ? (
                <p className="text-muted-foreground text-sm">No enrollments</p>
              ) : (
                <ul className="space-y-2">
                  {enrolled.map((c) => (
                    <li key={c.id} className="rounded-xl border bg-background/40 px-3 py-2 text-sm font-medium">
                      {c.title}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="bg-background/70 backdrop-blur rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenIcon className="size-5" />
                Requested courses ({requested.length})
              </CardTitle>
              <CardDescription>Pending course requests</CardDescription>
            </CardHeader>
            <CardContent>
              {requested.length === 0 ? (
                <p className="text-muted-foreground text-sm">No requests</p>
              ) : (
                <ul className="space-y-2">
                  {requested.map((c) => (
                    <li key={c.id} className="rounded-xl border bg-background/40 px-3 py-2 text-sm font-medium">
                      {c.title}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-background/70 backdrop-blur rounded-3xl">
          <CardHeader>
            <CardTitle>Payments ({payments.length})</CardTitle>
            <CardDescription>Payment history</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No payments</p>
            ) : (
              <ul className="space-y-2">
                {payments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-xl border bg-background/40 px-3 py-2 text-sm"
                  >
                    <span className="font-mono text-muted-foreground">{p.id.slice(0, 8)}…</span>
                    <span className="font-semibold">PKR {p.amount?.toLocaleString() ?? 0}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
