import { getConfig } from "@/lib/services/config";

function encodeS3Key(key: string): string {
  return key
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/** Extract an S3 object key from legacy `/assets/...` or backend asset URLs. */
function extractAssetsKey(url: string): string | null {
  const assetsIdx = url.indexOf("/assets/");
  if (assetsIdx >= 0) return url.slice(assetsIdx + "/assets/".length).replace(/^\/+/, "");
  if (url.startsWith("assets/")) return url.slice("assets/".length);
  return null;
}

function isAlreadyS3Url(url: string): boolean {
  return /amazonaws\.com\//i.test(url) || /cloudfront\.net\//i.test(url);
}

/**
 * Resolve image src for display.
 * - Absolute S3 / CDN URLs are returned as-is
 * - Legacy `/assets/...` or backend asset URLs are rewritten to the public S3 base
 * - Other relative paths are treated as S3 object keys
 */
export function getImageSrc(url: string | null | undefined): string {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  const s3Base = getConfig().S3_PUBLIC_BASE_URL.replace(/\/$/, "");

  if (isAlreadyS3Url(trimmed)) return trimmed;

  const assetsKey = extractAssetsKey(trimmed);
  if (assetsKey) return `${s3Base}/${encodeS3Key(assetsKey)}`;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Relative key like "profiles/uid/photo.jpg" or "enrollment-applications/x.png"
  return `${s3Base}/${encodeS3Key(trimmed)}`;
}

/**
 * True when Next.js should skip optimizing (S3 / backend / blob previews).
 */
export function isBackendImageUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  if (url.startsWith("blob:")) return true;
  const resolved = getImageSrc(url);
  if (isAlreadyS3Url(resolved)) return true;
  try {
    const u = new URL(resolved);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
