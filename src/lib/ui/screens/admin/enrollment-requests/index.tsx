"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  SearchIcon,
  CheckCircle2Icon,
  Loader2Icon,
  BookOpenIcon,
  UserIcon,
  BanknoteIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { GET_COURSE_ENROLLMENT_REQUESTS, ENROLL_USER_IN_COURSE } from "@/lib/graphql"

type EnrollmentRequest = {
  userId: string
  courseId: string
  user: { id: string; email: string; fullName: string | null }
  course: {
    id: string
    title: string
    slug: string
    feePerMonth: number
    totalNumberOfInstallments: number
    totalFee: number
    currency: string
  }
}

export const AdminEnrollmentRequestsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [approvingKey, setApprovingKey] = useState<string | null>(null)

  const { data, loading, refetch } = useQuery<{ getCourseEnrollmentRequests: EnrollmentRequest[] }>(
    GET_COURSE_ENROLLMENT_REQUESTS
  )
  const [enrollUserInCourse] = useMutation(ENROLL_USER_IN_COURSE, {
    onCompleted: () => {
      setApprovingKey(null)
      toast.success("Enrollment approved. Installments created with due dates on the 12th of each month.")
      refetch()
    },
    onError: (e) => {
      setApprovingKey(null)
      toast.error(e.message ?? "Failed to approve enrollment.")
    },
  })

  const requests = data?.getCourseEnrollmentRequests ?? []
  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests
    const q = searchQuery.toLowerCase()
    return requests.filter(
      (r) =>
        r.user.email.toLowerCase().includes(q) ||
        (r.user.fullName?.toLowerCase().includes(q) ?? false) ||
        r.course.title.toLowerCase().includes(q)
    )
  }, [requests, searchQuery])

  const handleApprove = (req: EnrollmentRequest) => {
    const key = `${req.userId}-${req.courseId}`
    setApprovingKey(key)
    enrollUserInCourse({
      variables: {
        input: { userId: req.userId, courseId: req.courseId },
      },
    })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Course enrollment requests
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Approve student course requests. Fees are taken from the course (add course screen). Each installment is due on the 12th of every month; students with overdue fees can only access the fee screen until they clear dues.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="text-muted-foreground text-xs mb-1">Pending enrollment requests</div>
              <div className="text-3xl font-semibold tracking-tight text-(--brand-primary)">
                {loading ? "—" : requests.length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by student name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
        <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                <Loader2Icon className="size-6 animate-spin" />
                <span>Loading enrollment requests...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-border border-b bg-background/40">
                    <tr>
                      <th className="p-4 font-semibold">Student</th>
                      <th className="p-4 font-semibold">Course</th>
                      <th className="p-4 font-semibold">Fee (from course)</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => {
                      const key = `${req.userId}-${req.courseId}`
                      const isApproving = approvingKey === key
                      const feeLabel = req.course.totalNumberOfInstallments
                        ? `${req.course.currency} ${req.course.feePerMonth?.toLocaleString() ?? 0} × ${req.course.totalNumberOfInstallments} (12th of each month)`
                        : `${req.course.currency} ${req.course.totalFee?.toLocaleString() ?? 0} total`
                      return (
                        <tr
                          key={key}
                          className="border-border border-b transition-colors hover:bg-background/60 animate-in fade-in slide-in-from-bottom-2 duration-500"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <UserIcon className="size-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{req.user.fullName || "—"}</div>
                                <div className="text-muted-foreground text-xs">{req.user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <BookOpenIcon className="size-4 text-muted-foreground" />
                              <span>{req.course.title}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <BanknoteIcon className="size-4 text-muted-foreground" />
                              <span className="text-muted-foreground text-xs">{feeLabel}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button
                              type="button"
                              variant="brand-secondary"
                              size="sm"
                              shape="pill"
                              disabled={isApproving}
                              onClick={() => handleApprove(req)}
                            >
                              {isApproving ? (
                                <Loader2Icon className="size-4 animate-spin" />
                              ) : (
                                <CheckCircle2Icon className="size-4" />
                              )}
                              <span className="ml-2">{isApproving ? "Approving..." : "Approve"}</span>
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && filteredRequests.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                {requests.length === 0
                  ? "No course enrollment requests at the moment."
                  : "No requests match your search."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
