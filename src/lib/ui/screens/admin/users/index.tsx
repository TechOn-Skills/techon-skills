"use client"

import { useState, useMemo } from "react"
import {
  SearchIcon,
  FilterIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  MoreVerticalIcon,
  CheckCircle2Icon,
  XCircleIcon,
  EditIcon,
  TrashIcon,
  EyeIcon
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { cn } from "@/lib/helpers"
import type { IUser } from "@/utils/interfaces"

const DEMO_USERS: IUser[] = [
  {
    id: "1",
    name: "Ahmad Hassan",
    email: "ahmad.hassan@example.com",
    phone: "+92 300 1234567",
    role: "student",
    status: "active",
    enrolledCourse: "Web Development",
    joinedDate: "Jan 15, 2026",
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Fatima Ali",
    email: "fatima.ali@example.com",
    phone: "+92 301 2345678",
    role: "student",
    status: "active",
    enrolledCourse: "Mobile Development",
    joinedDate: "Jan 10, 2026",
    lastActive: "5 minutes ago"
  },
  {
    id: "3",
    name: "Muhammad Khan",
    email: "muhammad.khan@example.com",
    phone: "+92 302 3456789",
    role: "student",
    status: "active",
    enrolledCourse: "Software Engineering",
    joinedDate: "Jan 5, 2026",
    lastActive: "1 day ago"
  },
  {
    id: "4",
    name: "Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    phone: "+92 303 4567890",
    role: "instructor",
    status: "active",
    joinedDate: "Dec 1, 2025",
    lastActive: "10 minutes ago"
  },
  {
    id: "5",
    name: "Ali Raza",
    email: "ali.raza@example.com",
    phone: "+92 304 5678901",
    role: "student",
    status: "inactive",
    enrolledCourse: "Web Development",
    joinedDate: "Dec 20, 2025",
    lastActive: "1 week ago"
  },
  {
    id: "6",
    name: "Zainab Malik",
    email: "zainab.malik@example.com",
    phone: "+92 305 6789012",
    role: "student",
    status: "active",
    enrolledCourse: "Ecommerce",
    joinedDate: "Jan 20, 2026",
    lastActive: "3 hours ago"
  },
  {
    id: "7",
    name: "Hassan Ali",
    email: "hassan.ali@example.com",
    phone: "+92 306 7890123",
    role: "student",
    status: "suspended",
    enrolledCourse: "Web Development",
    joinedDate: "Dec 15, 2025",
    lastActive: "2 weeks ago"
  },
  {
    id: "8",
    name: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    phone: "+92 307 8901234",
    role: "student",
    status: "active",
    enrolledCourse: "Mobile Development",
    joinedDate: "Jan 12, 2026",
    lastActive: "30 minutes ago"
  },
]

export const AdminUsersScreen = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | IUser["role"]>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | IUser["status"]>("all")
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)

  const filteredUsers = useMemo(() => {
    return DEMO_USERS.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery) ||
        user.enrolledCourse?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [searchQuery, roleFilter, statusFilter])

  const stats = [
    { label: "Total Users", value: DEMO_USERS.length, color: "text-blue-600" },
    { label: "Active Students", value: DEMO_USERS.filter(u => u.role === "student" && u.status === "active").length, color: "text-green-600" },
    { label: "Instructors", value: DEMO_USERS.filter(u => u.role === "instructor").length, color: "text-purple-600" },
    { label: "Suspended", value: DEMO_USERS.filter(u => u.status === "suspended").length, color: "text-red-600" },
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-border border-b bg-background/40">
                  <tr>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Joined</th>
                    <th className="p-4 font-semibold">Last Active</th>
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
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-muted-foreground text-xs">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <MailIcon className="size-3 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <PhoneIcon className="size-3" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn("font-semibold capitalize", roleConfig[user.role].color)}>
                          {roleConfig[user.role].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{user.enrolledCourse || "—"}</span>
                      </td>
                      <td className="p-4">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", statusConfig[user.status].color)}>
                          {user.status === "active" && <CheckCircle2Icon className="size-3" />}
                          {user.status === "suspended" && <XCircleIcon className="size-3" />}
                          {statusConfig[user.status].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarIcon className="size-3" />
                          {user.joinedDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-muted-foreground">{user.lastActive}</span>
                      </td>
                      <td className="p-4">
                        <div className="relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            shape="pill"
                            onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                          >
                            <MoreVerticalIcon className="size-4" />
                          </Button>
                          {showActionMenu === user.id && (
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
          </CardContent>
        </Card>
      </div>

      {filteredUsers.length === 0 && (
        <div className="mt-8 text-center text-muted-foreground">
          <SearchIcon className="size-12 mx-auto mb-4 opacity-50" />
          <p>No users found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
