import { getClientTimezone } from "./timezone"

const FALLBACK = "—"

function displayTimeZone(): string | undefined {
  const tz = getClientTimezone()
  return tz || undefined
}

/**
 * Parse a value into a Date. Handles ISO strings, milliseconds, seconds, and Date objects.
 * Returns null if the value is invalid or would produce "Invalid Date".
 */
export function parseDate(
  value: string | number | Date | null | undefined
): Date | null {
  if (value == null) return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (typeof value === "number") {
    // If number is in seconds (e.g. Unix timestamp < 1e12), convert to ms
    const ms = value < 1e12 ? value * 1000 : value
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  // Numeric string (ms or seconds)
  const num = Number(trimmed)
  if (!Number.isNaN(num)) {
    const ms = num < 1e12 ? num * 1000 : num
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const d = new Date(trimmed)
  return Number.isNaN(d.getTime()) ? null : d
}

type FormatOptions = {
  dateStyle?: "full" | "long" | "medium" | "short"
  timeStyle?: "full" | "long" | "medium" | "short"
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow"
  year?: "numeric" | "2-digit"
  day?: "numeric" | "2-digit"
  locale?: string | string[]
  fallback?: string
  /** Override; defaults to the browser's personal IANA timezone. */
  timeZone?: string
}

/**
 * Format a date for display. Returns fallback (default "—") for invalid or missing values.
 * Never returns "Invalid Date" or raw milliseconds.
 * Uses the client's personal timezone (from browser Intl) unless `timeZone` is passed.
 */
export function formatDate(
  value: string | number | Date | null | undefined,
  options: FormatOptions & Intl.DateTimeFormatOptions = {}
): string {
  const { fallback = FALLBACK, locale, timeZone, ...rest } = options
  const d = parseDate(value)
  if (!d) return fallback
  try {
    return d.toLocaleDateString(locale ?? undefined, {
      ...rest,
      timeZone: timeZone ?? displayTimeZone(),
    } as Intl.DateTimeFormatOptions)
  } catch {
    return fallback
  }
}

/**
 * Format date and time for display (e.g. "16 Mar 2025, 2:30 pm").
 * Converts UTC instants into the client's personal timezone.
 */
export function formatDateTime(
  value: string | number | Date | null | undefined,
  options: { locale?: string; fallback?: string; timeZone?: string } = {}
): string {
  const { fallback = FALLBACK, locale, timeZone } = options
  const d = parseDate(value)
  if (!d) return fallback
  try {
    return d.toLocaleString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeZone ?? displayTimeZone(),
    })
  } catch {
    return fallback
  }
}

/**
 * Format date only, long style (e.g. "16 March 2025").
 */
export function formatDateLong(
  value: string | number | Date | null | undefined,
  options: { locale?: string; fallback?: string; timeZone?: string } = {}
): string {
  const { fallback = FALLBACK, locale, timeZone } = options
  const d = parseDate(value)
  if (!d) return fallback
  try {
    return d.toLocaleDateString(locale, {
      dateStyle: "long",
      timeZone: timeZone ?? displayTimeZone(),
    })
  } catch {
    return fallback
  }
}

/**
 * Format time only (e.g. "2:30:45 pm") in the client's personal timezone.
 */
export function formatTime(
  value: string | number | Date | null | undefined,
  options: { locale?: string; fallback?: string; timeZone?: string } = {}
): string {
  const { fallback = FALLBACK, locale, timeZone } = options
  const d = parseDate(value)
  if (!d) return fallback
  try {
    return d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: timeZone ?? displayTimeZone(),
    })
  } catch {
    return fallback
  }
}

/**
 * Format as YYYY-MM-DD for display (e.g. "2025-03-16") in the client's personal timezone.
 */
export function formatDateISO(
  value: string | number | Date | null | undefined,
  options: { fallback?: string; timeZone?: string } = {}
): string {
  const { fallback = FALLBACK, timeZone } = options
  const d = parseDate(value)
  if (!d) return fallback
  try {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZone ?? displayTimeZone(),
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .formatToParts(d)
        .filter((p) => p.type !== "literal")
        .map((p) => [p.type, p.value])
    ) as Record<string, string>
    return `${parts.year}-${parts.month}-${parts.day}`
  } catch {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }
}

/**
 * True when the due date's (year, month) is <= current (year, month).
 * Used for fees due on the 12th: fee is "due" when we're in that month or later.
 */
export function isDueMonthReached(
  dueDateValue: string | number | Date | null | undefined
): boolean {
  const d = parseDate(dueDateValue)
  if (!d) return false
  const now = new Date()
  const dueYear = d.getFullYear()
  const dueMonth = d.getMonth()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  return dueYear < currentYear || (dueYear === currentYear && dueMonth <= currentMonth)
}
