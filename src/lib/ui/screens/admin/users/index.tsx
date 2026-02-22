"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@apollo/client/react"
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
} from "lucide-react"

import { GET_USERS } from "@/lib/graphql"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { cn } from "@/lib/helpers"

type UserRole = "student" | "instructor" | "admin"
type UserStatus = "active" | "inactive" | "suspended"

interface GraphQLUser {
  _id: string
  email: string
  role: UserRole
  status: UserStatus
  isBlocked: boolean
  isSuspended: boolean
  isDeleted: boolean
}

export const AdminUsersScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all")
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)

  const { data, loading, error } = useQuery<{ getUsers: GraphQLUser[] }>(GET_USERS)
  const users = useMemo(() => data?.getUsers ?? [], [data?.getUsers])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  const stats = [
    { label: "Total Users", value: users.length, color: "text-blue-600" },
    { label: "Active Students", value: users.filter((u) => u.role === "student" && u.status === "active").length, color: "text-green-600" },
    { label: "Instructors", value: users.filter((u) => u.role === "instructor").length, color: "text-purple-600" },
    { label: "Suspended", value: users.filter((u) => u.status === "suspended").length, color: "text-red-600" },
  ]

  const statusConfig = {
    active: { label: "Active", color: "bg-green-500/20 text-green-600 dark:text-green-400" },
    inactive: { label: "Inactive", color: "bg-gray-500/20 text-gray-600 dark:text-gray-400" },
    suspended: { label: "Suspended", color: "bg-red-500/20 text-red-600 dark:text-red-400" },
  }

  const roleConfig = {
    student: { label: "Student", color: "text-blue-600 dark:text-blue-400" },
    instructor: { label: "Instructor", color: "text-purple-600 dark:text-purple-400" },
    admin: { label: "Admin", color: "text-orange-600 dark:text-orange-400" },
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
          {(["all", "student", "instructor", "admin"] as const).map((role) => (
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
              {role}
            </button>
          ))}
          <span className="text-sm text-muted-foreground shrink-0 ml-4">Status:</span>
          {(["all", "active", "inactive", "suspended"] as const).map((status) => (
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
              {status}
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
                        key={user._id}
                        className="border-border border-b transition-colors hover:bg-background/60 animate-in fade-in slide-in-from-bottom-2 duration-500"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-(--brand-primary) text-(--text-on-dark) size-10 rounded-xl flex items-center justify-center shrink-0">
                              <UserIcon className="size-5" />
                            </div>
                            <div>
                              <div className="font-semibold truncate max-w-[200px]">{user.email}</div>
                              <div className="text-muted-foreground text-xs">ID: {user._id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={cn("font-semibold capitalize", roleConfig[user.role]?.color ?? "text-muted-foreground")}>
                            {roleConfig[user.role]?.label ?? user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", statusConfig[user.status]?.color ?? "bg-gray-500/20 text-gray-600")}>
                            {user.status === "active" && <CheckCircle2Icon className="size-3" />}
                            {user.status === "suspended" && <XCircleIcon className="size-3" />}
                            {statusConfig[user.status]?.label ?? user.status}
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
                          <div className="relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              shape="pill"
                              onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                            >
                              <MoreVerticalIcon className="size-4" />
                            </Button>
                            {showActionMenu === user._id && (
                              <div className="absolute right-0 top-full mt-1 z-10 w-48 rounded-2xl border bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2 space-y-1">
                                  <button className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors">
                                    <EyeIcon className="size-4" />
                                    View Details
                                  </button>
                                  <button className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-background/60 transition-colors">
                                    <EditIcon className="size-4" />
                                    Edit User
                                  </button>
                                  <button className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 transition-colors">
                                    <TrashIcon className="size-4" />
                                    Delete User
                                  </button>
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
    </div>
  )
}
