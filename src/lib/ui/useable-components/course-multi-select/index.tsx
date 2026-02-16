"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/helpers"
import { useCourses } from "@/lib/providers/courses"
import { Input } from "@/lib/ui/useable-components/input"
import type { ICourseMultiSelectProps } from "@/utils/interfaces"

export function CourseMultiSelect({
  value,
  onChange,
  placeholder = "Search and select courses…",
  required,
  className,
  disabled,
}: ICourseMultiSelectProps) {
  const { courses } = useCourses()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses
    const q = search.toLowerCase()
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q)
    )
  }, [search, courses])

  const toggleCourse = useCallback(
    (course: { slug: string; title: string }) => {
      if (value.some((c) => c.slug === course.slug)) {
        onChange(value.filter((c) => c.slug !== course.slug))
      } else {
        onChange([...value, { slug: course.slug, title: course.title }])
      }
    },
    [value, onChange]
  )

  const removeCourse = useCallback(
    (e: React.MouseEvent, slug: string) => {
      e.stopPropagation()
      onChange(value.filter((c) => c.slug !== slug))
    },
    [value, onChange]
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const displayLabel = value.length === 0
    ? placeholder
    : value.length === 1
      ? value[0].title
      : `${value.length} courses selected`

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "border-border bg-card text-foreground placeholder:text-muted-foreground flex min-h-11 w-full cursor-pointer flex-wrap items-center gap-2 rounded-2xl border px-4 py-2.5 text-left text-sm outline-none transition-colors",
          "focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          open && "border-ring ring-2 ring-ring/30"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={placeholder}
      >
        {value.length > 0 ? (
          <span className="flex min-w-0 max-h-24 flex-1 flex-wrap items-center gap-1.5 overflow-y-auto overflow-x-hidden">
            {value.map((course) => (
              <span
                key={course.slug}
                className="border-border text-foreground inline-flex max-w-full shrink-0 items-center gap-1 rounded-full border bg-transparent px-2.5 py-0.5 text-xs"
              >
                <span className="min-w-0 truncate">{course.title}</span>
                <button
                  type="button"
                  onClick={(e) => removeCourse(e, course.slug)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${course.title}`}
                >
                  <XIcon className="size-3" />
                </button>
              </span>
            ))}
          </span>
        ) : (
          <span className="text-muted-foreground">{displayLabel}</span>
        )}
        <ChevronDownIcon
          className={cn("ml-auto size-4 shrink-0 text-muted-foreground", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className="border-border bg-popover text-popover-foreground absolute top-full z-50 mt-1.5 max-h-[min(20rem,70vh)] w-full overflow-hidden rounded-lg border shadow-md"
          role="listbox"
        >
          <div className="border-border border-b p-2">
            <Input
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="h-9 rounded-md border-border bg-transparent dark:bg-transparent"
              autoFocus
            />
          </div>
          <div className="max-h-[min(16rem,50vh)] overflow-y-auto overflow-x-hidden p-1">
            {filteredCourses.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center text-sm">
                No courses match your search.
              </div>
            ) : (
              filteredCourses.map((course) => {
                const isSelected = value.some((c) => c.slug === course.slug)
                return (
                  <button
                    key={course.slug}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggleCourse({ slug: course.slug, title: course.title })}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-3 rounded-md px-2.5 py-2 my-px text-left text-sm transition-colors",
                      "hover:bg-foreground/6",
                      isSelected && "bg-foreground/8"
                    )}
                  >
                    <span
                      className={cn(
                        "border-border mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                        isSelected && "bg-ring border-ring"
                      )}
                    >
                      {isSelected && (
                        <svg className="size-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 6l3 3 5-6" />
                        </svg>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground">{course.title}</div>
                      <div className="text-muted-foreground line-clamp-1 text-xs">
                        {course.subtitle}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {required && (
        <input
          tabIndex={-1}
          required={value.length === 0}
          className="absolute opacity-0 pointer-events-none h-0 w-0"
          readOnly
          value={value.length === 0 ? "" : "set"}
        />
      )}
    </div>
  )
}
