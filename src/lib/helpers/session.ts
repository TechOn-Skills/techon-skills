import { CONFIG } from "@/utils/constants"

/** Stores the access token (and optionally the profile) after a successful sign-in. */
export function saveSession(accessToken?: string | null, profile?: unknown) {
  if (typeof window === "undefined") return
  if (accessToken) localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH.TOKEN, accessToken)
  if (profile) localStorage.setItem(CONFIG.STORAGE_KEYS.USER.PROFILE, JSON.stringify(profile))
}

export function clearSession() {
  if (typeof window === "undefined") return
  Object.values(CONFIG.STORAGE_KEYS.AUTH).forEach((key) => localStorage.removeItem(key))
  localStorage.removeItem(CONFIG.STORAGE_KEYS.USER.PROFILE)
}

/**
 * The API renews an expired access token from the refresh cookie and sends the new one
 * back in the Authorization response header; keep it so later requests use it directly.
 */
export function captureRefreshedToken(response: Response | null | undefined) {
  if (!response || typeof window === "undefined") return
  const header = response.headers.get("Authorization")
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : ""
  if (token) localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH.TOKEN, token)
}
