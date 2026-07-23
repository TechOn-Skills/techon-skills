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
} from "lucide-react"
import toast from "react-hot-toast"

import { getApiDisplayMessage } from "@/lib/helpers"
import { apiService } from "@/lib/services"
import { useUser } from "@/lib/providers/user"
import { GET_USERS, UPDATE_USER_INPUT, DELETE_USER } from "@/lib/graphql"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { cn } from "@/lib/helpers"
import {
  type GraphQLUser,
  type UserRole,
  type UserStatus,
  CreateUserSheet,
  EditUserSheet,
  DeleteUserDialog,
  AssignCoursesForUserSheet,
  AssignGradingCoursesForUserSheet,
  SendEmailToUserSheet,
} from "./user-sheets"

export const AdminUsersScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus | "suspended">("all")
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [assignCoursesUser, setAssignCoursesUser] = useState<GraphQLUser | null>(null)
  const [assignGradingCoursesUser, setAssignGradingCoursesUser] = useState<GraphQLUser | null>(null)
  const [sendEmailUser, setSendEmailUser] = useState<GraphQLUser | null>(null)
  const [editUser, setEditUser] = useState<GraphQLUser | null>(null)
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<GraphQLUser | null>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)
  const { userProfileInfo } = useUser()
  const currentUserRole = userProfileInfo?.role ?? null
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN"
  const canManageStatus = currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN"
  const canAssignStudentCourses = currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN"

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
  const [updateUserMutation] = useMutation(UPDATE_USER_INPUT, {
    onCompleted: () => {
      toast.success("User updated")
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })
  const [deleteUserMutation] = useMutation(DELETE_USER, {
    onCompleted: () => {
      toast.success("User deleted")
      setDeleteConfirmUser(null)
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })

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
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">User Management</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Manage users & access
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          View, manage, and control user accounts across the platform.
        </p>
      </div>

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
          {canManageStatus && (
            <Button variant="brand-secondary" shape="pill" onClick={() => setCreateUserOpen(true)}>
              <UserIcon className="size-4" />
              Add New User
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <FilterIcon className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground shrink-0">Role:</span>
          {(["all", "STUDENT", "INSTRUCTOR", "ADMIN", "SUPER_ADMIN"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all capitalize",
                roleFilter === role
                  ? "bg-[var(--brand-secondary)] text-[color:var(--text-on-dark)]"
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
                  ? "bg-[var(--brand-secondary)] text-[color:var(--text-on-dark)]"
                  : "bg-background/70 border hover:bg-background/90"
              )}
            >
              {status === "all" ? "All" : statusConfig[status]?.label ?? status}
            </button>
          ))}
        </div>
      </div>

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
                                  {canAssignStudentCourses &&
                                    user.role === "STUDENT" &&
                                    user.status === "ACTIVE" &&
                                    !user.isSuspended && (
                                    <button
                                      type="button"
                                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                      onClick={() => {
                                        setAssignCoursesUser(user)
                                        setShowActionMenu(null)
                                      }}
                                    >
                                      <BookOpenIcon className="size-4" />
                                      Enroll in courses
                                    </button>
                                  )}
                                  {canAssignStudentCourses &&
                                    user.role === "INSTRUCTOR" &&
                                    user.status === "ACTIVE" &&
                                    !user.isSuspended && (
                                    <button
                                      type="button"
                                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors"
                                      onClick={() => {
                                        setAssignGradingCoursesUser(user)
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

      <CreateUserSheet
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        onSuccess={() => refetch()}
        isSuperAdmin={isSuperAdmin}
      />
      <EditUserSheet
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        onSuccess={() => setEditUser(null)}
        updateUserMutation={updateUserMutation}
        isSuperAdmin={isSuperAdmin}
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
        onSuccess={() => {
          setAssignCoursesUser(null)
          refetch()
        }}
      />
      <AssignGradingCoursesForUserSheet
        user={assignGradingCoursesUser}
        open={!!assignGradingCoursesUser}
        onOpenChange={(open) => !open && setAssignGradingCoursesUser(null)}
        onSuccess={() => {
          setAssignGradingCoursesUser(null)
          refetch()
        }}
        updateUserMutation={updateUserMutation}
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
