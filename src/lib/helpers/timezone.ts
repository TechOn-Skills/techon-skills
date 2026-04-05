/**
 * Browser timezone (IANA, e.g. "Asia/Karachi") for request headers.
 * Returns empty string when not in browser (SSR) so backend can fall back to UTC.
 */
export function getClientTimezone(): string {
  if (typeof window === "undefined") return "";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}
