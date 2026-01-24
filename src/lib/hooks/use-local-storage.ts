import { useCallback, useSyncExternalStore } from "react"

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
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return Object.fromEntries(keys.map((k) => [k, null] as const))
    }
    return Object.fromEntries(keys.map((k) => [k, window.localStorage.getItem(k)] as const))
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

