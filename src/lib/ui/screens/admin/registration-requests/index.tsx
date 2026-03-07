"use client"

import { useState, useEffect, useCallback } from "react"
import { useMutation } from "@apollo/client/react"
import {
  SearchIcon,
  MailIcon,
  CalendarIcon,
  UserIcon,
  CheckCircle2Icon,
  Loader2Icon,
  UserPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImagePlusIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { getApiDisplayMessage } from "@/lib/helpers"
import { apiService } from "@/lib/services"
import { UPDATE_USER_INPUT } from "@/lib/graphql"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/lib/ui/useable-components/sheet"
import { SheetContentSide } from "@/utils/enums"
import { IUser } from "@/utils/interfaces"

const PAGE_SIZE = 10

export const AdminRegistrationRequestsScreen = () => {
  const [requests, setRequests] = useState<IUser[]>([])
  const [total, setTotal] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [approvalSheetUser, setApprovalSheetUser] = useState<IUser | null>(null)

  const fetchRequests = useCallback(async (pageNum: number) => {
    setLoading(true)
    const studentRegistrationRequests = await apiService.getStudentRegistrationRequests(pageNum, PAGE_SIZE)
    if (studentRegistrationRequests?.data?.length !== undefined) {
      setRequests(studentRegistrationRequests.data ?? [])
      setTotal(studentRegistrationRequests.total)
    } else {
      setRequests([])
      if (studentRegistrationRequests?.total !== undefined) setTotal(studentRegistrationRequests.total)
    }
    if (!studentRegistrationRequests?.success) {
      toast.error(getApiDisplayMessage(studentRegistrationRequests!, "Failed to load registration requests."))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    queueMicrotask(() => fetchRequests(page))
  }, [fetchRequests, page])

  const openApprovalSheet = (user: IUser) => setApprovalSheetUser(user)

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
              <div className="text-muted-foreground text-xs mb-1">
                {total != null ? "Total pending requests" : "Requests on this page"}
              </div>
              <div className="text-3xl font-semibold tracking-tight text-(--brand-primary)">
                {loading ? "—" : total != null ? total : requests.length}
              </div>
              <div className="text-muted-foreground text-xs mt-1">Page {page}{total != null ? ` of ${Math.ceil(total / PAGE_SIZE) || 1}` : ""}</div>
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
                {page === 1 && <span>Loading registration requests...</span>}
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
                            onClick={() => openApprovalSheet(req)}
                          >
                            <CheckCircle2Icon className="size-4" />
                            <span className="ml-2">Approve</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          {!loading && (requests.length > 0 || page > 1) && (
            <div className="border-border flex items-center justify-between border-t px-4 py-3">
              <div className="text-muted-foreground text-sm">
                {total != null
                  ? `Page ${page} of ${Math.ceil(total / PAGE_SIZE) || 1}`
                  : `Page ${page}`}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeftIcon className="size-4" />
                  <span className="ml-1">Previous</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={total != null ? page * PAGE_SIZE >= total : requests.length < PAGE_SIZE}
                >
                  <span className="mr-1">Next</span>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
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

      <ApproveRegistrationSheet
        user={approvalSheetUser}
        open={!!approvalSheetUser}
        onOpenChange={(open) => !open && setApprovalSheetUser(null)}
        onSuccess={() => {
          setApprovalSheetUser(null)
          fetchRequests(page)
        }}
      />
    </div>
  )
}

function ApproveRegistrationSheet({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: IUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [updateUser] = useMutation(UPDATE_USER_INPUT)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "")
      setPhoneNumber(user.phoneNumber ?? "")
      setProfileFile(null)
      setProfilePreview(null)
    }
  }, [user?._id])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
      setProfilePreview(URL.createObjectURL(file))
    } else {
      setProfileFile(null)
      setProfilePreview(null)
    }
  }

  const handleApprove = async () => {
    if (!user) return
    if (!fullName.trim()) {
      toast.error("Please enter the student's full name.")
      return
    }
    setSaving(true)
    const toastId = toast.loading("Updating profile and approving...")
    try {
      let profilePictureUrl: string | undefined
      if (profileFile) {
        const uploadRes = await apiService.uploadImage(profileFile, "profiles", user._id)
        if (uploadRes.success && uploadRes.data?.url) profilePictureUrl = uploadRes.data.url
      }
      await updateUser({
        variables: {
          input: {
            id: user._id,
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim() || undefined,
            profilePicture: profilePictureUrl,
          },
        },
      })
      const response = await apiService.approveStudentRegistrationRequest(user._id)
      toast.dismiss(toastId)
      setSaving(false)
      if (response.success) {
        toast.success(getApiDisplayMessage(response, "Registration approved. Student can now sign in."))
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(getApiDisplayMessage(response, "Failed to approve registration. Please try again."))
      }
    } catch (e) {
      toast.dismiss(toastId)
      setSaving(false)
      toast.error(e instanceof Error ? e.message : "Failed to update profile and approve.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Approve registration</SheetTitle>
          <SheetDescription>
            {user ? (
              <>
                Complete the student profile, then approve. Email: <span className="font-medium text-foreground">{user.email}</span>
              </>
            ) : null}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Full name *</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Student's full name"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Phone number</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +92 300 1234567"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Profile picture</label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-muted-foreground/30 hover:border-(--brand-primary)/50 cursor-pointer transition-colors overflow-hidden bg-muted/30">
                {profilePreview ? (
                  <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImagePlusIcon className="size-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
              {profileFile && (
                <span className="text-sm text-muted-foreground truncate max-w-[160px]">{profileFile.name}</span>
              )}
            </div>
          </div>
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand-secondary"
            onClick={handleApprove}
            disabled={saving || !fullName.trim()}
          >
            {saving ? <Loader2Icon className="size-4 animate-spin" /> : <CheckCircle2Icon className="size-4" />}
            <span className="ml-2">{saving ? "Saving..." : "Save & approve"}</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
