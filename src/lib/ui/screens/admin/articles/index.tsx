"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  Loader2Icon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  FileTextIcon,
  EyeIcon,
} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

import { apiService } from "@/lib/services"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Textarea } from "@/lib/ui/useable-components/textarea"
import { RichTextEditor } from "@/lib/ui/useable-components/rich-text-editor"
import { ImageUpload } from "@/lib/ui/useable-components/image-upload"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { CREATE_ARTICLE, UPDATE_ARTICLE, DELETE_ARTICLE, GET_ARTICLES, GET_ARTICLE } from "@/lib/graphql"

type ArticleRow = {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  publishedAt?: string | null
  authorName: string
  createdAt: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export const AdminArticlesScreen = () => {
  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    authorName: "",
    metaTitle: "",
    metaDescription: "",
  })

  const { data, loading, error, refetch } = useQuery<{ getArticles: ArticleRow[] }>(GET_ARTICLES, {
    variables: { publishedOnly: false },
  })
  const { data: editData } = useQuery<{ getArticle: ArticleRow & { content?: string; metaTitle?: string; metaDescription?: string; coverImage?: string } }>(GET_ARTICLE, {
    variables: { id: editId! },
    skip: !editId,
  })
  const [createArticle, { loading: creating }] = useMutation(CREATE_ARTICLE, {
    onCompleted: () => {
      toast.success("Article created")
      setCreateOpen(false)
      resetForm()
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })
  const [updateArticle, { loading: updating }] = useMutation(UPDATE_ARTICLE, {
    onCompleted: () => {
      toast.success("Article updated")
      setEditId(null)
      resetForm()
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })
  const [deleteArticle, { loading: deleting }] = useMutation(DELETE_ARTICLE, {
    onCompleted: () => {
      toast.success("Article deleted")
      refetch()
    },
    onError: (e) => toast.error(e.message),
  })

  const articles = data?.getArticles ?? []

  useEffect(() => {
    if (editId && editData?.getArticle) {
      const a = editData.getArticle
      setForm({
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt ?? "",
        content: a.content ?? "",
        coverImage: a.coverImage ?? "",
        published: a.published,
        authorName: a.authorName ?? "",
        metaTitle: a.metaTitle ?? "",
        metaDescription: a.metaDescription ?? "",
      })
    }
  }, [editId, editData])

  const resetForm = () => {
    setCoverImageFile(null)
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      published: false,
      authorName: "",
      metaTitle: "",
      metaDescription: "",
    })
  }

  const openEdit = (a: ArticleRow) => {
    setEditId(a.id)
    setCoverImageFile(null)
    setForm({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt ?? "",
      content: "",
      coverImage: "",
      published: a.published,
      authorName: a.authorName ?? "",
      metaTitle: "",
      metaDescription: "",
    })
  }

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: f.slug || slugify(title) }))
  }

  const handleCreate = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required")
      return
    }
    let coverImage = form.coverImage.trim() || undefined
    if (coverImageFile) {
      const res = await apiService.uploadImage(coverImageFile, "articles", form.slug.trim() || undefined)
      if (res.success && res.data?.url) coverImage = res.data.url
      else { toast.error("Failed to upload cover image"); return }
      setCoverImageFile(null)
    }
    createArticle({
      variables: {
        input: {
          title: form.title.trim(),
          slug: form.slug.trim(),
          excerpt: form.excerpt.trim() || undefined,
          content: form.content.trim() || "",
          coverImage,
          published: form.published,
          authorName: form.authorName.trim() || undefined,
          metaTitle: form.metaTitle.trim() || undefined,
          metaDescription: form.metaDescription.trim() || undefined,
        },
      },
    })
  }

  const handleUpdate = async () => {
    if (!editId || !form.title.trim() || !form.slug.trim()) return
    let coverImage = form.coverImage.trim() || undefined
    if (coverImageFile) {
      const res = await apiService.uploadImage(coverImageFile, "articles", form.slug.trim() || undefined)
      if (res.success && res.data?.url) coverImage = res.data.url
      else { toast.error("Failed to upload cover image"); return }
      setCoverImageFile(null)
    }
    updateArticle({
      variables: {
        input: {
          id: editId,
          title: form.title.trim(),
          slug: form.slug.trim(),
          excerpt: form.excerpt.trim() || undefined,
          content: form.content.trim() || undefined,
          coverImage,
          published: form.published,
          authorName: form.authorName.trim() || undefined,
          metaTitle: form.metaTitle.trim() || undefined,
          metaDescription: form.metaDescription.trim() || undefined,
        },
      },
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this article?")) return
    deleteArticle({ variables: { id } })
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-secondary">Admin</div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Articles</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
            Publish articles with rich content. They appear on the public /articles page. Use HTML in content for formatting.
          </p>
        </div>
        <DialogPrimitive.Root open={createOpen} onOpenChange={setCreateOpen}>
          <DialogPrimitive.Trigger asChild>
            <Button variant="brand-secondary" shape="pill" className="gap-2">
              <PlusIcon className="size-4" />
              New Article
            </Button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=closed]:animate-out" />
            <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(42rem,calc(100vw-2rem))] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-background p-6 shadow-xl">
              <DialogPrimitive.Title className="text-lg font-semibold">Create Article</DialogPrimitive.Title>
              <ArticleForm form={form} setForm={setForm} onTitleChange={handleTitleChange} coverImageFile={coverImageFile} onCoverImageFileChange={setCoverImageFile} />
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
          <p className="text-destructive">Failed to load articles.</p>
        </div>
      ) : (
        <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Slug</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Author</th>
                    <th className="p-4 font-semibold">Created</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id} className="border-b transition-colors hover:bg-muted/20">
                      <td className="p-4 font-medium">{a.title}</td>
                      <td className="p-4 text-muted-foreground font-mono text-xs">{a.slug}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${a.published ? "bg-green-500/20 text-green-600" : "bg-amber-500/20 text-amber-600"}`}>
                          {a.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{a.authorName || "—"}</td>
                      <td className="p-4 text-muted-foreground text-xs">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/articles/${a.slug}`} target="_blank" rel="noopener">
                              <EyeIcon className="size-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
                            <PencilIcon className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(a.id)} disabled={deleting}>
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {articles.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <FileTextIcon className="size-12 mx-auto mb-4 opacity-50" />
                <p>No articles yet. Create one to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <DialogPrimitive.Root open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=closed]:animate-out" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(42rem,calc(100vw-2rem))] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-background p-6 shadow-xl">
            <DialogPrimitive.Title className="text-lg font-semibold">Edit Article</DialogPrimitive.Title>
            <ArticleForm form={form} setForm={setForm} onTitleChange={handleTitleChange} coverImageFile={coverImageFile} onCoverImageFileChange={setCoverImageFile} />
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

function ArticleForm({
  form,
  setForm,
  onTitleChange,
  coverImageFile,
  onCoverImageFileChange,
}: {
  form: { title: string; slug: string; excerpt: string; content: string; coverImage: string; published: boolean; authorName: string; metaTitle: string; metaDescription: string }
  setForm: React.Dispatch<React.SetStateAction<typeof form>>
  onTitleChange: (title: string) => void
  coverImageFile?: File | null
  onCoverImageFileChange?: (file: File | null) => void
}) {
  return (
    <div className="grid gap-4 py-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Title</label>
        <Input value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Article title" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Slug (URL)</label>
        <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="my-article" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Excerpt</label>
        <Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary" rows={2} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Content</label>
        <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} minHeight="200px" placeholder="Write your article content..." />
      </div>
      <div>
        <ImageUpload
          label="Cover image"
          category="articles"
          subPath={form.slug.trim() || undefined}
          value={form.coverImage || undefined}
          onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
          pendingFile={coverImageFile ?? null}
          onPendingFileChange={onCoverImageFileChange}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Author name</label>
        <Input value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))} placeholder="TechOn Skills" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Meta title (SEO)</label>
        <Input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} placeholder="Optional" />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Meta description (SEO)</label>
        <Textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} placeholder="Optional" rows={2} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="rounded border-input" />
        <label htmlFor="published" className="text-sm font-medium">Published (visible on public site)</label>
      </div>
    </div>
  )
}
