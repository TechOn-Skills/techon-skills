/** Backend responses use `detail` for user-facing messages; fallback to `message`. */
export function getApiDisplayMessage(
  response: { detail?: string; message?: string },
  fallback: string
): string {
  return response.detail ?? response.message ?? fallback
}
