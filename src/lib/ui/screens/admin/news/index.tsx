"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { Loader2Icon, PlusIcon, PencilIcon, Trash2Icon, NewspaperIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { ConfirmDialog } from "@/lib/ui/useable-components/confirm-dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { formatDate } from "@/lib/helpers"
import { GET_NEWS_POSTS, CREATE_NEWS, UPDATE_NEWS, DELETE_NEWS } from "@/lib/graphql"

type NewsRow = { id: string; title: string; description: string; createdAt: string }

export const AdminNewsScreen = () => {
  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const { data, loading, error, refetch } = useQuery<{ getNewsPosts: NewsRow[] }>(GET_NEWS_POSTS)
  const [createNews, { loading: creating }] = useMutation(CREATE_NEWS, {
    onCompleted: () => {
      toast.success("News post created")
      setCreateOpen(false)
      setTitle("")
      setDescription("")
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })
  const [updateNews, { loading: updating }] = useMutation(UPDATE_NEWS, {
    onCompleted: () => {
      toast.success("News post updated")
      setEditId(null)
      setTitle("")
      setDescription("")
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })
  const [deleteNews, { loading: deleting }] = useMutation(DELETE_NEWS, {
    onCompleted: () => { toast.success("Deleted"); refetch() },
    onError: (e) => toast.error(e.message),
  })

  const posts = data?.getNewsPosts ?? []

  const openEdit = (p: NewsRow) => {
    setEditId(p.id)
    setTitle(p.title)
    setDescription(p.description)
  }

  const handleCreate = () => {
    if (!title.trim()) { toast.error("Title required"); return }
    createNews({ variables: { input: { title: title.trim(), description: description.trim() || "—" } } })
  }

  const handleUpdate = () => {
    if (!editId || !title.trim()) return
    updateNews({ variables: { input: { id: editId, title: title.trim(), description: description.trim() || undefined } } })
  }

  const handleDelete = (id: string) => setDeleteConfirmId(id)
  const onConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteNews({ variables: { id: deleteConfirmId } })
      setDeleteConfirmId(null)
    }
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-secondary">Admin</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">News</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Create and publish news posts. They appear on the public news page.
          </p>
        </div>
        <ConfirmDialog
          open={!!deleteConfirmId}
          onOpenChange={(open) => !open && setDeleteConfirmId(null)}
          title="Delete news post"
          description="Delete this news post? This cannot be undone."
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={onConfirmDelete}
          loading={deleting}
        />
        <DialogPrimitive.Root open={createOpen} onOpenChange={setCreateOpen}>
          <DialogPrimitive.Trigger asChild>
            <Button variant="brand-secondary" shape="pill" className="gap-2">
              <PlusIcon className="size-4" />
              New Post
            </Button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-background p-6 shadow-xl outline-none">
              <DialogPrimitive.Title className="text-lg font-semibold">Create News Post</DialogPrimitive.Title>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" rows={3} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button variant="brand-secondary" onClick={handleCreate} disabled={creating}>
                  {creating ? <Loader2Icon className="size-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-destructive">Failed to load news.</p>
        </div>
      ) : (
        <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted-surface/40">
                  <tr>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold">Created</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} className="border-b transition-colors hover:bg-muted-surface/20">
                      <td className="p-4 font-medium">{p.title}</td>
                      <td className="p-4 text-muted-foreground line-clamp-2">{p.description}</td>
                      <td className="p-4 text-muted-foreground text-xs">{formatDate(p.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                            <PencilIcon className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)} disabled={deleting}>
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {posts.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <NewspaperIcon className="size-12 mx-auto mb-4 opacity-50" />
                <p>No news posts yet. Create one to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <DialogPrimitive.Root open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-background p-6 shadow-xl outline-none">
            <DialogPrimitive.Title className="text-lg font-semibold">Edit News Post</DialogPrimitive.Title>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
              <Button variant="brand-secondary" onClick={handleUpdate} disabled={updating}>
                {updating ? <Loader2Icon className="size-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
