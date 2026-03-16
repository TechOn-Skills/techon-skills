"use client"

import { useState, useEffect, useCallback } from "react"
import { ImageIcon, Loader2Icon, Trash2Icon } from "lucide-react"
import toast from "react-hot-toast"

import { getApiDisplayMessage } from "@/lib/helpers"
import { apiService } from "@/lib/services"
import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"

const CATEGORIES = ["courses", "articles", "users", "profiles"] as const

type UploadItem = {
  id: string
  category: string
  subPath: string
  filename: string
  url: string
  relativePath: string
  createdAt: string
}

export const AdminImagesScreen = () => {
  const [items, setItems] = useState<UploadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    setLoading(true)
    const params = categoryFilter !== "all" ? { category: categoryFilter } : undefined
    const res = await apiService.getUploadedImages(params)
    setLoading(false)
    if (res.success && Array.isArray(res.data)) {
      setItems(res.data)
    } else {
      setItems([])
      if (!res.success) toast.error(getApiDisplayMessage(res, "Failed to load images."))
    }
  }, [categoryFilter])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const res = await apiService.deleteUploadedImage(id)
    setDeletingId(null)
    if (res.success) {
      toast.success("Image deleted.")
      fetchImages()
    } else {
      toast.error(getApiDisplayMessage(res, "Failed to delete image."))
    }
  }

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Uploaded images
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          View and delete images uploaded via the admin panel. Filter by category (courses, articles, users, profiles).
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Category:</span>
        {["all", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              categoryFilter === cat
                ? "bg-(--brand-primary) text-(--text-on-dark)"
                : "bg-muted/60 hover:bg-muted"
            )}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      <Card className="bg-background/70 backdrop-blur rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2Icon className="size-6 animate-spin" />
              <span>Loading images...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <ImageIcon className="size-12 mx-auto mb-4 opacity-50" />
              <p>No uploaded images found.</p>
              <p className="text-sm mt-1">Images appear here when you upload them in Articles, Courses, or Registration.</p>
            </div>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border bg-background/60 overflow-hidden group"
                >
                  <div className="aspect-video bg-muted/50 relative">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-xs font-mono truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                      {item.subPath ? ` / ${item.subPath}` : ""}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : (
                        <Trash2Icon className="size-4" />
                      )}
                      <span className="ml-1">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
