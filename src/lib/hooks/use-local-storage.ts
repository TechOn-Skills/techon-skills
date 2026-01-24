import { useCallback, useRef, useSyncExternalStore } from "react"

const LOCAL_STORAGE_EVENT = "techon:local-storage"

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {}

  const onStorage = () => callback()
  window.addEventListener("storage", onStorage)
  window.addEventListener(LOCAL_STORAGE_EVENT, onStorage)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(LOCAL_STORAGE_EVENT, onStorage)
  }
}

function notifyLocalStorage() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT))
}

export function useLocalStorageItem(key: string) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return null
    return window.localStorage.getItem(key)
  }, [key])

  const value = useSyncExternalStore(subscribe, getSnapshot, () => null)

  const setValue = useCallback(
    (next: string) => {
      if (typeof window === "undefined") return
      window.localStorage.setItem(key, next)
      notifyLocalStorage()
    },
    [key]
  )

  return { value, setValue }
}

export function useLocalStorageRecord(keys: string[]) {
  // Cache the snapshot object so React doesn't see a "new object"
  // on every getSnapshot call (prevents infinite-loop warnings).
  const cacheRef = useRef<{
    keysSig: string
    lastValues: (string | null)[]
    lastSnapshot: Record<string, string | null>
  } | null>(null)

  const getSnapshot = useCallback(() => {
    const keysSig = keys.join("|")
    const values =
      typeof window === "undefined"
        ? keys.map(() => null)
        : keys.map((k) => window.localStorage.getItem(k))

    const cached = cacheRef.current
    if (
      cached &&
      cached.keysSig === keysSig &&
      cached.lastValues.length === values.length &&
      cached.lastValues.every((v, i) => v === values[i])
    ) {
      return cached.lastSnapshot
    }

    const nextSnapshot = Object.fromEntries(keys.map((k, i) => [k, values[i]] as const))
    cacheRef.current = {
      keysSig,
      lastValues: values,
      lastSnapshot: nextSnapshot,
    }
    return nextSnapshot
  }, [keys])

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => Object.fromEntries(keys.map((k) => [k, null] as const))
  )

  const setValue = useCallback((key: string, next: string) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(key, next)
    notifyLocalStorage()
  }, [])

  return { value, setValue }
}

