"use client"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/helpers"

type FormSubmitSuccessProps = {
  title: string
  description?: string
  className?: string
}

export function FormSubmitSuccess({ title, description, className }: FormSubmitSuccessProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 py-10 text-center sm:py-12",
        "animate-in fade-in zoom-in-95 duration-500",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex size-21 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full bg-emerald-500/15 ring-[6px] ring-emerald-500/20 motion-safe:animate-[form-success-pop_0.55s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
          aria-hidden
        />
        <span className="relative flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg motion-safe:animate-[form-success-pop_0.45s_cubic-bezier(0.34,1.56,0.64,1)_0.08s_both] dark:bg-emerald-500">
          <CheckIcon className="size-8" strokeWidth={2.75} aria-hidden />
        </span>
      </div>
      <div className="max-w-md space-y-1.5 px-2">
        <p className="text-lg font-semibold tracking-tight">{title}</p>
        {description ? <p className="text-muted-foreground text-sm leading-relaxed">{description}</p> : null}
      </div>
    </div>
  )
}
