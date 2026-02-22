"use client"

import { useState, useEffect } from "react"
import {
  SearchIcon,
  MailIcon,
  CalendarIcon,
  UserIcon,
  CheckCircle2Icon,
  Loader2Icon,
  UserPlusIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { getApiDisplayMessage } from "@/lib/helpers"
import { apiService } from "@/lib/services"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { IUser } from "@/utils/interfaces"

export const AdminRegistrationRequestsScreen = () => {
  const [requests, setRequests] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [approvingId, setApprovingId] = useState<string | null>(null)



  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      const studentRegistrationRequests = await apiService.getStudentRegistrationRequests()
      if (studentRegistrationRequests?.data?.length && studentRegistrationRequests.data.length > 0) {
        setRequests(studentRegistrationRequests.data)
      } else {
        setRequests([])
        if (!studentRegistrationRequests.success) {
          toast.error(getApiDisplayMessage(studentRegistrationRequests, "Failed to load registration requests."))
        }
      }
      setLoading(false)
    }

    fetchRequests()
  }, [])

  const handleApprove = async (id: string) => {
    setApprovingId(id)
    const toastId = toast.loading("Approving registration...")
    const response = await apiService.approveStudentRegistrationRequest(id)
    toast.dismiss(toastId)
    setApprovingId(null)
    if (response.success) {
      toast.success(getApiDisplayMessage(response, "Registration approved. Student can now sign in."))
      setRequests((prev) => prev.filter((r) => r._id !== id))
    } else {
      toast.error(getApiDisplayMessage(response, "Failed to approve registration. Please try again."))
    }
  }

  const filteredRequests = requests.filter(
    (r) =>
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Student registration requests
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Review and approve student sign-up requests. Approved students can sign in with a magic link.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardContent className="p-6">
              <div className="text-muted-foreground text-xs mb-1">Pending requests</div>
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
            placeholder="Search by email or name..."
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
                <span>Loading registration requests...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-border border-b bg-background/40">
                    <tr>
                      <th className="p-4 font-semibold">Request</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Requested</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req, idx) => (
                      <tr
                        key={req._id}
                        className="border-border border-b transition-colors hover:bg-background/60 animate-in fade-in slide-in-from-bottom-2 duration-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-(--brand-primary) text-(--text-on-dark) size-10 rounded-xl flex items-center justify-center shrink-0">
                              <UserIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-semibold">{req.fullName || "—"}</div>
                              <div className="text-muted-foreground text-xs">{req.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-xs">
                            <MailIcon className="size-3 text-muted-foreground" />
                            <span className="truncate max-w-[240px]">{req.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarIcon className="size-3" />
                            {req.createdAt ? new Date(req.createdAt).toLocaleString() : "—"}
                          </div>
                        </td>
                        <td className="p-4">
                          <Button
                            type="button"
                            variant="brand-secondary"
                            size="sm"
                            shape="pill"
                            onClick={() => handleApprove(req._id)}
                            disabled={approvingId === req._id}
                          >
                            {approvingId === req._id ? (
                              <Loader2Icon className="size-4 animate-spin" />
                            ) : (
                              <CheckCircle2Icon className="size-4" />
                            )}
                            <span className="ml-2">
                              {approvingId === req._id ? "Approving..." : "Approve"}
                            </span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!loading && filteredRequests.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed bg-background/40 py-16 text-center">
          <UserPlusIcon className="size-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium">
            {requests.length === 0
              ? "No registration requests at the moment."
              : "No requests match your search."}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {requests.length === 0
              ? "New requests will appear here when students sign up."
              : "Try a different search term."}
          </p>
        </div>
      )}
    </div>
  )
}
