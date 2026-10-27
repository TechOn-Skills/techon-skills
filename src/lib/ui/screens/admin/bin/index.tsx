"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { ArchiveIcon, DownloadIcon, Loader2Icon, MailIcon, RotateCcwIcon, SearchIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { ConfirmDialog } from "@/lib/ui/useable-components/confirm-dialog"
import { GET_BINNED_USERS, RESTORE_USERS_FROM_BIN } from "@/lib/graphql"
import { formatDate } from "@/lib/helpers"
import { BulkEmailSheet } from "../users/bulk-email-sheet"

type BinnedUser = {
  id: string
  email: string
  fullName: string | null
  phoneNumber: string | null
  role: string
  status: string
  marketingOptOut: boolean
  deletedAt: string | null
  deletedBy: { id: string; email: string; fullName: string | null } | null
  enrolledCourses: { id: string; title: string }[]
  createdAt: string
}

function csvCell(value: string | null | undefined): string {
  const s = String(value ?? "")
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Downloads the bin as CSV (for marketing tools / spreadsheets). */
function exportCsv(users: BinnedUser[]) {
  const header = ["Name", "Email", "Phone", "Role", "Courses", "Unsubscribed", "Binned on", "Registered on"]
  const rows = users.map((u) => [
    u.fullName,
    u.email,
    u.phoneNumber,
    u.role,
    u.enrolledCourses.map((c) => c.title).join("; "),
    u.marketingOptOut ? "yes" : "no",
    u.deletedAt ? u.deletedAt.slice(0, 10) : "",
    u.createdAt.slice(0, 10),
  ])
  const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const a = document.createElement("a")
  a.href = url
  a.download = `techon-user-bin-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const AdminUserBinScreen = () => {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [emailOpen, setEmailOpen] = useState(false)
  const [restoreIds, setRestoreIds] = useState<string[] | null>(null)

  const { data, loading, error, refetch } = useQuery<{ getBinnedUsers: BinnedUser[] }>(GET_BINNED_USERS, {
    fetchPolicy: "network-only",
  })
  const users = useMemo(() => data?.getBinnedUsers ?? [], [data])
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.email.toLowerCase().includes(q) || (u.fullName ?? "").toLowerCase().includes(q) || (u.phoneNumber ?? "").includes(q))
  }, [users, search])

  const [restore, { loading: restoring }] = useMutation<{ restoreUsersFromBin: number }>(RESTORE_USERS_FROM_BIN, {
    onCompleted: (d) => {
      toast.success(`${d.restoreUsersFromBin} user(s) restored`)
      setSelected(new Set())
      setRestoreIds(null)
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const allSelected = filtered.length > 0 && filtered.every((u) => selected.has(u.id))
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((u) => u.id)))
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-secondary">User Management</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">User bin</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Users moved out of the active list. They can&apos;t sign in, but their details are kept for marketing.
            Restore anyone to give them access again.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" shape="pill" className="gap-2" onClick={() => exportCsv(filtered)} disabled={!filtered.length}>
            <DownloadIcon className="size-4" />
            Export CSV
          </Button>
          <Button variant="brand-secondary" shape="pill" className="gap-2" onClick={() => setEmailOpen(true)} disabled={!users.length}>
            <MailIcon className="size-4" />
            Email
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or phone" className="pl-10" />
        </div>
        {selected.size > 0 && (
          <Button variant="outline" shape="pill" className="gap-2" onClick={() => setRestoreIds([...selected])}>
            <RotateCcwIcon className="size-4" />
            Restore {selected.size}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-destructive">Failed to load the bin: {error.message}</div>
      ) : (
        <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted-surface/40">
                  <tr>
                    <th className="w-10 p-4">
                      <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
                    </th>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold">Courses</th>
                    <th className="p-4 font-semibold">Binned</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b transition-colors hover:bg-muted-surface/20">
                      <td className="p-4">
                        <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggle(u.id)} aria-label={`Select ${u.email}`} />
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{u.fullName || u.email}</div>
                        <div className="text-muted-foreground text-xs">
                          {u.email} · {u.role.toLowerCase().replace("_", " ")}
                          {u.marketingOptOut && <span className="ml-2 rounded-full bg-slate-500/10 px-2 py-0.5">unsubscribed</span>}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{u.phoneNumber || "—"}</td>
                      <td className="p-4 text-muted-foreground text-xs">{u.enrolledCourses.map((c) => c.title).join(", ") || "—"}</td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {u.deletedAt ? formatDate(u.deletedAt) : "—"}
                        {u.deletedBy && <div>by {u.deletedBy.fullName || u.deletedBy.email}</div>}
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => setRestoreIds([u.id])}>
                          <RotateCcwIcon className="size-4" />
                          Restore
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <ArchiveIcon className="size-12 mx-auto mb-4 opacity-50" />
                <p>{users.length ? "No users match your search." : "The bin is empty."}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={!!restoreIds}
        onOpenChange={(open) => !open && setRestoreIds(null)}
        title="Restore users"
        description={`Restore ${restoreIds?.length ?? 0} user(s)? They'll be back in the users list and can sign in again.`}
        confirmLabel="Restore"
        onConfirm={() => restoreIds && restore({ variables: { ids: restoreIds } })}
        loading={restoring}
      />

      <BulkEmailSheet
        key={emailOpen ? "open" : "closed"}
        open={emailOpen}
        onOpenChange={setEmailOpen}
        selectedIds={[...selected]}
        audiences={selected.size ? ["SELECTED", "BIN"] : ["BIN", "SELECTED"]}
      />
    </div>
  )
}
