"use client"

import { useState, useMemo, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { BookOpenIcon, Loader2Icon, SendIcon } from "lucide-react"
import toast from "react-hot-toast"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { getApiDisplayMessage } from "@/lib/helpers"
import { apiService } from "@/lib/services"
import {
  GET_COURSES,
  GET_USER_BY_ID,
  ENROLL_USER_IN_COURSE,
  CREATE_USER,
  UPDATE_USER_INPUT,
} from "@/lib/graphql"
import { Button } from "@/lib/ui/useable-components/button"
import { Input } from "@/lib/ui/useable-components/input"
import { PhoneInput, getFullPhone, parsePhoneFromString } from "@/lib/ui/useable-components/phone-input"
import { RichTextEditor } from "@/lib/ui/useable-components/rich-text-editor"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/lib/ui/useable-components/sheet"
import { SheetContentSide } from "@/utils/enums"

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN"
export type UserStatus = "ACTIVE" | "INACTIVE"

export interface GraphQLUser {
  id: string
  email: string
  fullName?: string | null
  phoneNumber?: string | null
  role: UserRole
  status: UserStatus
  isBlocked: boolean
  isSuspended: boolean
  isDeleted: boolean
}

function enrollmentDateDefaultYmd(): string {
  const t = new Date()
  const y = t.getFullYear()
  const m = String(t.getMonth() + 1).padStart(2, "0")
  const d = String(t.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function GradingCoursesSelector({
  selectedIds,
  onToggle,
  loading,
}: {
  selectedIds: string[]
  onToggle: (id: string) => void
  loading?: boolean
}) {
  const { data: coursesData } = useQuery<{ getCourses: { id: string; title: string }[] }>(GET_COURSES)
  const courses = useMemo(() => coursesData?.getCourses ?? [], [coursesData])

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Loading courses…
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-xs">
        Select courses this instructor can grade, manage quizzes, and schedule lectures for.
      </p>
      {courses.length === 0 ? (
        <p className="text-muted-foreground text-sm">No courses available.</p>
      ) : (
        courses.map((c) => (
          <label
            key={c.id}
            className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted-surface/50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(c.id)}
              onChange={() => onToggle(c.id)}
              className="rounded border-input"
            />
            <span className="text-sm font-medium">{c.title}</span>
          </label>
        ))
      )}
    </div>
  )
}

export function CreateUserSheet({
  open,
  onOpenChange,
  onSuccess,
  isSuperAdmin,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  isSuperAdmin: boolean
}) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneValue, setPhoneValue] = useState(parsePhoneFromString(""))
  const [role, setRole] = useState<UserRole>("STUDENT")
  const [status, setStatus] = useState<UserStatus>("ACTIVE")
  const [gradingCourseIds, setGradingCourseIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const [createUserMutation] = useMutation(CREATE_USER, {
    onError: (e) => toast.error(e.message),
  })

  useEffect(() => {
    if (open) {
      setFullName("")
      setEmail("")
      setPhoneValue(parsePhoneFromString(""))
      setRole("STUDENT")
      setStatus("ACTIVE")
      setGradingCourseIds([])
    }
  }, [open])

  useEffect(() => {
    if (role !== "INSTRUCTOR") {
      setGradingCourseIds([])
    }
  }, [role])

  const toggleGradingCourse = (id: string) => {
    setGradingCourseIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleCreate = async () => {
    if (!email.trim()) {
      toast.error("Email is required.")
      return
    }
    if (role === "INSTRUCTOR" && gradingCourseIds.length === 0) {
      toast.error("Assign at least one course for the instructor.")
      return
    }
    setSaving(true)
    try {
      const fullPhone = getFullPhone(phoneValue)
      await createUserMutation({
        variables: {
          input: {
            email: email.trim(),
            fullName: fullName.trim() || undefined,
            phoneNumber: fullPhone.trim() || undefined,
            role,
            status,
            ...(role === "INSTRUCTOR" ? { allowedMarkGradesOn: gradingCourseIds } : {}),
          },
        },
      })
      toast.success("User created successfully.")
      onSuccess()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add new user</SheetTitle>
          <SheetDescription>Create a new platform account. Instructors must be assigned courses to access grading tools.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Full name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="rounded-xl" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-xl" required />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Phone</label>
            <PhoneInput value={phoneValue} onChange={setPhoneValue} placeholder="Phone number" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
              {isSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
            </select>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {role === "INSTRUCTOR" && (
            <div className="rounded-2xl border bg-background/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BookOpenIcon className="size-4" />
                Assigned courses
              </div>
              <GradingCoursesSelector selectedIds={gradingCourseIds} onToggle={toggleGradingCourse} />
            </div>
          )}
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="brand-secondary" onClick={handleCreate} disabled={saving || !email.trim()}>
            {saving ? <Loader2Icon className="size-4 animate-spin" /> : "Create user"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function EditUserSheet({
  user,
  open,
  onOpenChange,
  onSuccess,
  updateUserMutation,
  isSuperAdmin,
}: {
  user: GraphQLUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  updateUserMutation: (opts: {
    variables: {
      input: {
        id: string
        fullName?: string
        email?: string
        phoneNumber?: string
        role?: UserRole
        status?: UserStatus
        allowedMarkGradesOn?: string[]
      }
    }
  }) => Promise<unknown>
  isSuperAdmin: boolean
}) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneValue, setPhoneValue] = useState(parsePhoneFromString(""))
  const [role, setRole] = useState<UserRole>("STUDENT")
  const [status, setStatus] = useState<UserStatus>("ACTIVE")
  const [gradingCourseIds, setGradingCourseIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const { data: userData, loading: userLoading } = useQuery<{ getUser: { allowedMarkGradesOn: string[] } | null }>(
    GET_USER_BY_ID,
    { variables: { id: user?.id ?? "" }, skip: !user?.id || !open }
  )

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "")
      setEmail(user.email ?? "")
      setPhoneValue(parsePhoneFromString(user.phoneNumber ?? ""))
      setRole(user.role)
      setStatus(user.status)
    }
  }, [user?.id, user?.fullName, user?.email, user?.phoneNumber, user?.role, user?.status])

  useEffect(() => {
    if (open && userData?.getUser && user?.role === "INSTRUCTOR") {
      setGradingCourseIds(userData.getUser.allowedMarkGradesOn ?? [])
    } else if (open && role === "INSTRUCTOR" && userData?.getUser) {
      setGradingCourseIds(userData.getUser.allowedMarkGradesOn ?? [])
    } else if (role !== "INSTRUCTOR") {
      setGradingCourseIds([])
    }
  }, [open, user?.id, user?.role, role, userData?.getUser])

  const toggleGradingCourse = (id: string) => {
    setGradingCourseIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSave = async () => {
    if (!user) return
    if (role === "INSTRUCTOR" && gradingCourseIds.length === 0) {
      toast.error("Assign at least one course for the instructor.")
      return
    }
    setSaving(true)
    try {
      const fullPhone = getFullPhone(phoneValue)
      await updateUserMutation({
        variables: {
          input: {
            id: user.id,
            fullName: fullName.trim() || undefined,
            email: email.trim() || undefined,
            phoneNumber: fullPhone.trim() || undefined,
            role,
            status,
            ...(role === "INSTRUCTOR" ? { allowedMarkGradesOn: gradingCourseIds } : {}),
          },
        },
      })
      onSuccess()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit user</SheetTitle>
          <SheetDescription>{user ? `Update profile for ${user.email}` : null}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Full name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="rounded-xl" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-xl" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Phone</label>
            <PhoneInput value={phoneValue} onChange={setPhoneValue} placeholder="Phone number" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              disabled={user?.role === "SUPER_ADMIN" && !isSuperAdmin}
            >
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
              {isSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
            </select>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {role === "INSTRUCTOR" && (
            <div className="rounded-2xl border bg-background/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BookOpenIcon className="size-4" />
                Assigned courses
              </div>
              <GradingCoursesSelector
                selectedIds={gradingCourseIds}
                onToggle={toggleGradingCourse}
                loading={userLoading}
              />
            </div>
          )}
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="brand-secondary" onClick={handleSave} disabled={saving || userLoading}>
            {saving ? <Loader2Icon className="size-4 animate-spin" /> : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: {
  user: GraphQLUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(24rem,100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-xl">
          <DialogPrimitive.Title className="text-lg font-semibold">Delete user</DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">
            {user ? (
              <>This will mark &quot;{user.fullName || user.email}&quot; as deleted. This action cannot be undone. Continue?</>
            ) : null}
          </DialogPrimitive.Description>
          <div className="mt-6 flex justify-end gap-2">
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogPrimitive.Close>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              Delete
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function AssignCoursesForUserSheet({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: GraphQLUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [enrollmentDateYmd, setEnrollmentDateYmd] = useState(enrollmentDateDefaultYmd)
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [paymentPreviewUrl, setPaymentPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { data: coursesData } = useQuery<{ getCourses: { id: string; slug: string; title: string }[] }>(GET_COURSES)
  const [enrollMutation] = useMutation(ENROLL_USER_IN_COURSE)
  const courses = useMemo(() => coursesData?.getCourses ?? [], [coursesData])

  useEffect(() => {
    if (user) {
      setSelectedIds([])
      setEnrollmentDateYmd(enrollmentDateDefaultYmd())
      setPaymentFile(null)
      setPaymentPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
    }
  }, [user?.id])

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const onPaymentFileChange = (file: File | null) => {
    setPaymentFile(file)
    setPaymentPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  const handleAssign = async () => {
    if (!user) return
    setSaving(true)
    const toastId = toast.loading("Assigning courses...")
    try {
      let paymentScreenshotUrl: string | undefined
      if (paymentFile) {
        const uploadRes = await apiService.uploadImage(paymentFile, "users", user.id)
        if (!uploadRes.success || !uploadRes.data?.url) {
          toast.dismiss(toastId)
          toast.error(getApiDisplayMessage(uploadRes, "Failed to upload payment screenshot."))
          return
        }
        paymentScreenshotUrl = uploadRes.data.url
      }
      const inputBase = {
        userId: user.id,
        enrollmentDate: enrollmentDateYmd.trim() || undefined,
        ...(paymentScreenshotUrl ? { paymentScreenshotUrl } : {}),
      }
      for (const courseId of selectedIds) {
        await enrollMutation({ variables: { input: { ...inputBase, courseId } } })
      }
      toast.dismiss(toastId)
      toast.success("Courses assigned successfully.")
      onSuccess()
      onOpenChange(false)
    } catch (e) {
      toast.dismiss(toastId)
      toast.error(e instanceof Error ? e.message : "Failed to assign courses.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Assign courses</SheetTitle>
          <SheetDescription>
            {user ? (
              <>
                Enroll: <span className="font-medium text-foreground">{user.fullName || user.email}</span>
                <span className="text-muted-foreground"> ({user.email})</span>
              </>
            ) : null}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Date of enrollment</label>
            <Input
              type="date"
              value={enrollmentDateYmd}
              onChange={(e) => setEnrollmentDateYmd(e.target.value)}
              className="rounded-xl"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Fees are due on the 12th of each month. If enrollment is before today, one fee row is created for each due date from the first due through today (up to the course installment limit). Enrollment on or after today still opens the full installment schedule.
            </p>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Payment screenshot (optional)</label>
            <Input
              type="file"
              accept="image/*,application/pdf"
              className="rounded-xl cursor-pointer text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5"
              onChange={(e) => onPaymentFileChange(e.target.files?.[0] ?? null)}
            />
            {paymentPreviewUrl && paymentFile?.type.startsWith("image/") && (
              <div
                className="mt-2 h-40 w-full rounded-xl border bg-muted/30 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${paymentPreviewUrl})` }}
                role="img"
                aria-label="Payment proof preview"
              />
            )}
            {paymentFile && !paymentFile.type.startsWith("image/") && (
              <p className="text-muted-foreground mt-1 text-xs">{paymentFile.name}</p>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              If you attach proof, the first fee installment for each assigned course is marked paid (admin-attested).
            </p>
          </div>
          <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Courses</div>
          <div className="space-y-2">
            {courses.map((c) => (
              <label key={c.id} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted-surface/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onChange={() => toggle(c.id)}
                  className="rounded border-input"
                />
                <span className="text-sm font-medium">{c.title}</span>
              </label>
            ))}
          </div>
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand-secondary"
            onClick={handleAssign}
            disabled={saving || selectedIds.length === 0}
          >
            {saving ? <Loader2Icon className="size-4 animate-spin" /> : <BookOpenIcon className="size-4" />}
            <span className="ml-2">{saving ? "Saving..." : "Assign courses"}</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function AssignGradingCoursesForUserSheet({
  user,
  open,
  onOpenChange,
  onSuccess,
  updateUserMutation,
}: {
  user: GraphQLUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  updateUserMutation: (opts: { variables: { input: { id: string; allowedMarkGradesOn?: string[] } } }) => Promise<unknown>
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const { data: userData, loading: userLoading } = useQuery<{ getUser: { allowedMarkGradesOn: string[] } | null }>(
    GET_USER_BY_ID,
    { variables: { id: user?.id ?? "" }, skip: !user?.id || !open }
  )

  useEffect(() => {
    if (open && userData?.getUser) {
      setSelectedIds(userData.getUser.allowedMarkGradesOn ?? [])
    } else if (open && user) {
      setSelectedIds([])
    }
  }, [open, user?.id, userData?.getUser])

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSave = async () => {
    if (!user) return
    if (selectedIds.length === 0) {
      toast.error("Assign at least one course for the instructor.")
      return
    }
    setSaving(true)
    try {
      await updateUserMutation({
        variables: {
          input: {
            id: user.id,
            allowedMarkGradesOn: selectedIds,
          },
        },
      })
      toast.success("Instructor courses updated.")
      onSuccess()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Assign instructor courses</SheetTitle>
          <SheetDescription>
            {user ? (
              <>
                Choose which courses{" "}
                <span className="font-medium text-foreground">{user.fullName || user.email}</span> can grade, manage
                quizzes, and schedule lectures for.
                <span className="mt-2 block text-xs">
                  Instructors only see courses selected here. They cannot self-enroll in courses.
                </span>
              </>
            ) : null}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 max-h-[60vh] overflow-y-auto">
          <GradingCoursesSelector selectedIds={selectedIds} onToggle={toggle} loading={userLoading} />
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="brand-secondary" onClick={handleSave} disabled={saving || userLoading}>
            {saving ? <Loader2Icon className="size-4 animate-spin" /> : "Save assignments"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function SendEmailToUserSheet({
  user,
  open,
  onOpenChange,
  onSuccess,
}: {
  user: GraphQLUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (user) {
      setSubject("")
      setBody("")
    }
  }, [user?.id])

  const handleSend = async () => {
    if (!user) return
    setSending(true)
    const toastId = toast.loading("Sending email...")
    const response = await apiService.sendEmailToUser(user.id, subject, body)
    toast.dismiss(toastId)
    setSending(false)
    if (response.success) {
      toast.success(getApiDisplayMessage(response, "Email sent successfully."))
      onSuccess()
      onOpenChange(false)
    } else {
      toast.error(getApiDisplayMessage(response, "Failed to send email. Please try again."))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Send email</SheetTitle>
          <SheetDescription>
            {user ? (
              <>
                To: <span className="font-medium text-foreground">{user.fullName || user.email}</span>
                <span className="text-muted-foreground"> ({user.email})</span>
              </>
            ) : null}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" className="rounded-xl" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Message</label>
            <RichTextEditor value={body} onChange={setBody} placeholder="Write your message..." minHeight="160px" />
          </div>
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="brand-secondary"
            onClick={handleSend}
            disabled={sending || !subject.trim() || !body.trim()}
          >
            {sending ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
            <span className="ml-2">{sending ? "Sending..." : "Send email"}</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
