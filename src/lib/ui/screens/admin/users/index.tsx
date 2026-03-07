"use client"

import Link from "next/link"
import { useState, useMemo, useRef, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  SearchIcon,
  FilterIcon,
  UserIcon,
  MoreVerticalIcon,
  CheckCircle2Icon,
  XCircleIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  Loader2Icon,
  BookOpenIcon,
  MailIcon,
  SendIcon,
} from "lucide-react"
import toast from "react-hot-toast"

import { getApiDisplayMessage } from "@/lib/helpers"
import { apiService } from "@/lib/services"
import { useUser } from "@/lib/providers/user"
import { GET_USERS, GET_COURSES, ENROLL_USER_IN_COURSE, UPDATE_USER_INPUT, DELETE_USER } from "@/lib/graphql"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { RichTextEditor } from "@/lib/ui/useable-components/rich-text-editor"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/lib/ui/useable-components/sheet"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { SheetContentSide } from "@/utils/enums"
import { cn } from "@/lib/helpers"

type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN"
type UserStatus = "ACTIVE" | "INACTIVE"

interface GraphQLUser {
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

export const AdminUsersScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus | "suspended">("all")
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [assignCoursesUser, setAssignCoursesUser] = useState<GraphQLUser | null>(null)
  const [sendEmailUser, setSendEmailUser] = useState<GraphQLUser | null>(null)
  const [editUser, setEditUser] = useState<GraphQLUser | null>(null)
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<GraphQLUser | null>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const { userProfileInfo } = useUser()
  const currentUserRole = userProfileInfo?.role ?? null
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN"
  const canManageStatus = currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN"

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showActionMenu != null && actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setShowActionMenu(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [showActionMenu])

  const { data, loading, error, refetch } = useQuery<{ getUsers: GraphQLUser[] }>(GET_USERS)
  const users = useMemo(() => data?.getUsers ?? [], [data?.getUsers])
  const [updateUserMutation] = useMutation(UPDATE_USER_INPUT, { onCompleted: () => { toast.success("User updated"); refetch(); }, onError: (e) => toast.error(e.message) })
  const [deleteUserMutation] = useMutation(DELETE_USER, { onCompleted: () => { toast.success("User deleted"); setDeleteConfirmUser(null); refetch(); }, onError: (e) => toast.error(e.message) })

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        user.email.toLowerCase().includes(searchLower) ||
        (user.fullName ?? "").toLowerCase().includes(searchLower)
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "suspended"
            ? user.isSuspended
            : user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  const stats = [
    { label: "Total Users", value: users.length, color: "text-blue-600" },
    { label: "Active Students", value: users.filter((u) => u.role === "STUDENT" && u.status === "ACTIVE").length, color: "text-green-600" },
    { label: "Instructors", value: users.filter((u) => u.role === "INSTRUCTOR").length, color: "text-purple-600" },
    { label: "Suspended", value: users.filter((u) => u.isSuspended).length, color: "text-red-600" },
  ]

  const statusConfig: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: "Active", color: "bg-green-500/20 text-green-600 dark:text-green-400" },
    INACTIVE: { label: "Inactive", color: "bg-gray-500/20 text-gray-600 dark:text-gray-400" },
    suspended: { label: "Suspended", color: "bg-red-500/20 text-red-600 dark:text-red-400" },
  }

  const roleConfig: Record<string, { label: string; color: string }> = {
    STUDENT: { label: "Student", color: "text-blue-600 dark:text-blue-400" },
    INSTRUCTOR: { label: "Instructor", color: "text-purple-600 dark:text-purple-400" },
    ADMIN: { label: "Admin", color: "text-orange-600 dark:text-orange-400" },
    SUPER_ADMIN: { label: "Super Admin", color: "text-amber-600 dark:text-amber-400" },
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">User Management</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Manage users & access
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          View, manage, and control user accounts across the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.20),rgba(255,138,61,0.10),transparent_70%)] p-px animate-in fade-in slide-in-from-top-4 duration-700"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardContent className="p-6">
                <div className="text-muted-foreground text-xs mb-1">{stat.label}</div>
                <div className={cn("text-3xl font-semibold tracking-tight", stat.color)}>{stat.value}</div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users by name, email, phone, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="brand-secondary" shape="pill">
            <UserIcon className="size-4" />
            Add New User
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <FilterIcon className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground shrink-0">Role:</span>
          {(["all", "STUDENT", "INSTRUCTOR", "ADMIN"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all capitalize",
                roleFilter === role
                  ? "bg-(--brand-primary) text-(--text-on-dark)"
                  : "bg-background/70 border hover:bg-background/90"
              )}
            >
              {role === "all" ? "All" : roleConfig[role]?.label ?? role}
            </button>
          ))}
          <span className="text-sm text-muted-foreground shrink-0 ml-4">Status:</span>
          {(["all", "ACTIVE", "INACTIVE", "suspended"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all capitalize",
                statusFilter === status
                  ? "bg-(--brand-primary) text-(--text-on-dark)"
                  : "bg-background/70 border hover:bg-background/90"
              )}
            >
              {status === "all" ? "All" : statusConfig[status]?.label ?? status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
        <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                <Loader2Icon className="size-6 animate-spin" />
                <span>Loading users...</span>
              </div>
            ) : error ? (
              <div className="py-16 text-center text-muted-foreground">
                <p className="text-destructive">Failed to load users. Please try again.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-border border-b bg-background/40">
                    <tr>
                      <th className="p-4 font-semibold">User</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Blocked</th>
                      <th className="p-4 font-semibold">Suspended</th>
                      <th className="p-4 font-semibold">Deleted</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        className="border-border border-b transition-colors hover:bg-background/60 animate-in fade-in slide-in-from-bottom-2 duration-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-(--brand-primary) text-(--text-on-dark) size-10 rounded-xl flex items-center justify-center shrink-0">
                              <UserIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-semibold truncate max-w-[200px]">{user.fullName || user.email}</div>
                              <div className="text-muted-foreground text-xs">{user.email} · ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={cn("font-semibold capitalize", roleConfig[user.role]?.color ?? "text-muted-foreground")}>
                            {roleConfig[user.role]?.label ?? user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", user.isSuspended ? statusConfig.suspended.color : (statusConfig[user.status]?.color ?? "bg-gray-500/20 text-gray-600"))}>
                            {user.status === "ACTIVE" && !user.isSuspended && <CheckCircle2Icon className="size-3" />}
                            {user.isSuspended && <XCircleIcon className="size-3" />}
                            {user.isSuspended ? statusConfig.suspended.label : (statusConfig[user.status]?.label ?? user.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn("text-xs font-medium", user.isBlocked ? "text-amber-600" : "text-muted-foreground")}>
                            {user.isBlocked ? "Yes" : "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn("text-xs font-medium", user.isSuspended ? "text-red-600" : "text-muted-foreground")}>
                            {user.isSuspended ? "Yes" : "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn("text-xs font-medium", user.isDeleted ? "text-red-600" : "text-muted-foreground")}>
                            {user.isDeleted ? "Yes" : "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="relative" ref={showActionMenu === user.id ? actionMenuRef : undefined}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              shape="pill"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowActionMenu(showActionMenu === user.id ? null : user.id)
                              }}
                            >
                              <MoreVerticalIcon className="size-4" />
                            </Button>
                            {showActionMenu === user.id && (
                              <div className="absolute right-0 top-full mt-1 z-10 w-52 rounded-2xl border bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2 space-y-1">
                                  <Link
                                    href={`/admin/users/${user.id}`}
                                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                    onClick={() => setShowActionMenu(null)}
                                  >
                                    <EyeIcon className="size-4" />
                                    View Details
                                  </Link>
                                  <button
                                    type="button"
                                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                    onClick={() => { setEditUser(user); setShowActionMenu(null) }}
                                  >
                                    <EditIcon className="size-4" />
                                    Edit User
                                  </button>
                                  {canManageStatus && user.role !== "SUPER_ADMIN" && (
                                    <>
                                      {user.status === "ACTIVE" ? (
                                        <button
                                          type="button"
                                          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                          onClick={() => { updateUserMutation({ variables: { input: { id: user.id, status: "INACTIVE" } } }); setShowActionMenu(null) }}
                                        >
                                          Mark as Inactive
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                          onClick={() => { updateUserMutation({ variables: { input: { id: user.id, status: "ACTIVE" } } }); setShowActionMenu(null) }}
                                        >
                                          Mark as Active
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                        onClick={() => { apiService.toggleSuspendStudent(user.id).then((r) => { if (r.success) { toast.success(user.isSuspended ? "User unsuspended" : "User suspended"); refetch(); } else toast.error(getApiDisplayMessage(r, "Failed")); }); setShowActionMenu(null) }}
                                      >
                                        {user.isSuspended ? "Unsuspend" : "Suspend"}
                                      </button>
                                      <button
                                        type="button"
                                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                        onClick={() => { apiService.toggleBlockStudent(user.id).then((r) => { if (r.success) { toast.success(user.isBlocked ? "User unblocked" : "User blocked"); refetch(); } else toast.error(getApiDisplayMessage(r, "Failed")); }); setShowActionMenu(null) }}
                                      >
                                        {user.isBlocked ? "Unblock" : "Block"}
                                      </button>
                                    </>
                                  )}
                                  {user.role === "STUDENT" && user.status === "ACTIVE" && !user.isSuspended && (
                                    <button
                                      type="button"
                                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                      onClick={() => {
                                        setAssignCoursesUser(user)
                                        setShowActionMenu(null)
                                      }}
                                    >
                                      <BookOpenIcon className="size-4" />
                                      Assign courses
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                    onClick={() => {
                                      setSendEmailUser(user)
                                      setShowActionMenu(null)
                                    }}
                                  >
                                    <MailIcon className="size-4" />
                                    Send email
                                  </button>
                                  {isSuperAdmin && user.role !== "SUPER_ADMIN" && (
                                    <button
                                      type="button"
                                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 transition-colors"
                                      onClick={() => { setDeleteConfirmUser(user); setShowActionMenu(null) }}
                                    >
                                      <TrashIcon className="size-4" />
                                      Delete User
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
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

      {!loading && !error && filteredUsers.length === 0 && (
        <div className="mt-8 text-center text-muted-foreground">
          <SearchIcon className="size-12 mx-auto mb-4 opacity-50" />
          <p>No users found matching your filters.</p>
        </div>
      )}

      <EditUserSheet
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        onSuccess={() => setEditUser(null)}
        updateUserMutation={updateUserMutation}
      />
      <DeleteUserDialog
        user={deleteConfirmUser}
        open={!!deleteConfirmUser}
        onOpenChange={(open) => !open && setDeleteConfirmUser(null)}
        onConfirm={() => deleteConfirmUser && deleteUserMutation({ variables: { input: { id: deleteConfirmUser.id } } })}
      />
      <AssignCoursesForUserSheet
        user={assignCoursesUser}
        open={!!assignCoursesUser}
        onOpenChange={(open) => !open && setAssignCoursesUser(null)}
        onSuccess={() => setAssignCoursesUser(null)}
      />
      <SendEmailToUserSheet
        user={sendEmailUser}
        open={!!sendEmailUser}
        onOpenChange={(open) => !open && setSendEmailUser(null)}
        onSuccess={() => setSendEmailUser(null)}
      />
    </div>
  )
}

function EditUserSheet({
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
  updateUserMutation: (opts: { variables: { input: { id: string; fullName?: string; email?: string; phoneNumber?: string; role?: UserRole; status?: UserStatus } } }) => Promise<unknown>
}) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState<UserRole>("STUDENT")
  const [status, setStatus] = useState<UserStatus>("ACTIVE")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "")
      setEmail(user.email ?? "")
      setPhoneNumber(user.phoneNumber ?? "")
      setRole(user.role)
      setStatus(user.status)
    }
  }, [user?.id, user?.fullName, user?.email, user?.phoneNumber, user?.role, user?.status])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserMutation({
        variables: {
          input: {
            id: user.id,
            fullName: fullName.trim() || undefined,
            email: email.trim() || undefined,
            phoneNumber: phoneNumber.trim() || undefined,
            role,
            status,
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
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit user</SheetTitle>
          <SheetDescription>
            {user ? `Update profile for ${user.email}` : null}
          </SheetDescription>
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
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" className="rounded-xl" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="text-muted-foreground mb-1.5 block text-sm font-medium">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as UserStatus)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        <SheetFooter className="flex-row gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" variant="brand-secondary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2Icon className="size-4 animate-spin" /> : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function DeleteUserDialog({
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
              <Button type="button" variant="outline">Cancel</Button>
            </DialogPrimitive.Close>
            <Button type="button" variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); }}>
              Delete
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function AssignCoursesForUserSheet({
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
  const [saving, setSaving] = useState(false)
  const { data: coursesData } = useQuery<{ getCourses: { id: string; slug: string; title: string }[] }>(GET_COURSES)
  const [enrollMutation] = useMutation(ENROLL_USER_IN_COURSE)
  const courses = useMemo(() => coursesData?.getCourses ?? [], [coursesData])

  useEffect(() => {
    if (user) setSelectedIds([])
  }, [user?.id])

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleAssign = async () => {
    if (!user) return
    setSaving(true)
    const toastId = toast.loading("Assigning courses...")
    try {
      for (const courseId of selectedIds) {
        await enrollMutation({ variables: { input: { userId: user.id, courseId } } })
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
      <SheetContent side={SheetContentSide.RIGHT} className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Assign courses</SheetTitle>
          <SheetDescription>
            {user ? (
              <>
                For: <span className="font-medium text-foreground">{user.fullName || user.email}</span>
                <span className="text-muted-foreground"> ({user.email})</span>
              </>
            ) : null}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {courses.map((c) => (
            <label key={c.id} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted/50 cursor-pointer">
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

function SendEmailToUserSheet({
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
