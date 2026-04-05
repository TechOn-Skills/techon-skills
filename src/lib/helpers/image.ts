import { getConfig } from "@/lib/services/config";

/**
 * Resolve image src for display: use full URLs as-is; for relative paths,
 * prepend current backend URL (so production uses production URL, local uses local e.g. http://localhost:8080).
 */
export function getImageSrc(url: string | null | undefined): string {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const base = getConfig().BACKEND_URL.replace(/\/$/, "");
  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`;
}

const BACKEND_URL_NORMALIZED = () => getConfig().BACKEND_URL.replace(/\/$/, "");

/**
 * True if this image URL is served from our backend (e.g. localhost:8080 or production API).
 * Use with Next.js Image unoptimized so the browser loads the image directly and it displays reliably.
 */
export function isBackendImageUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  const resolved = getImageSrc(url);
  const base = BACKEND_URL_NORMALIZED();
  if (base && (resolved === base || resolved.startsWith(base + "/"))) return true;
  // Fallback: treat localhost URLs as backend (avoids optimizer when BACKEND_URL not set at build time)
  try {
    const u = new URL(resolved);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
