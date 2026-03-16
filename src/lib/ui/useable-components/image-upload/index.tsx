"use client"

import { useRef, useEffect, useMemo } from "react"
import { ImagePlusIcon, XIcon } from "lucide-react"
import { Button } from "@/lib/ui/useable-components/button"
import { cn } from "@/lib/helpers"

export type ImageUploadProps = {
  value?: string
  onChange?: (url: string) => void
  /** Pending file (not yet uploaded). Parent should upload on form submit then clear this and set value. */
  pendingFile?: File | null
  onPendingFileChange?: (file: File | null) => void
  category: string
  subPath?: string
  label?: string
  className?: string
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  pendingFile,
  onPendingFileChange,
  category,
  subPath,
  label = "Image",
  className,
  disabled,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = useMemo(() => (pendingFile ? URL.createObjectURL(pendingFile) : null), [pendingFile])
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const displaySrc = previewUrl ?? value ?? null

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      onPendingFileChange?.(file)
    }
    e.target.value = ""
  }

  const clear = () => {
    onChange?.("")
    onPendingFileChange?.(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground block">{label}</label>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 border-dashed transition-colors overflow-hidden bg-muted-surface/30",
            "hover:border-(--brand-primary)/50 hover:bg-muted-surface/50",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          {displaySrc ? (
            <img
              src={displaySrc}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <ImagePlusIcon className="size-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Upload</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </button>
        {displaySrc && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={clear}
            disabled={disabled}
          >
            <XIcon className="size-4" />
            Remove
          </Button>
        )}
        {pendingFile && (
          <span className="text-xs text-muted-foreground truncate max-w-[140px]">
            {pendingFile.name} (will upload on save)
          </span>
        )}
      </div>
    </div>
  )
}
