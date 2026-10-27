"use client"

import { FormEvent, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/lib/ui/useable-components/button"
import { Input } from "@/lib/ui/useable-components/input"
import { cn, getApiDisplayMessage, saveSession } from "@/lib/helpers"
import { apiService } from "@/lib/services"

/** Mirrors the API rule: 8+ characters with at least one letter and one number. */
export function getPasswordProblem(password: string): string | null {
  if (password.length < 8) return "Use at least 8 characters"
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number"
  return null
}

type PasswordFormProps = {
  /** Ask for the current password (changing an existing password from settings). */
  requireCurrent?: boolean
  submitLabel?: string
  onSuccess?: () => void
  className?: string
}

/**
 * Sets or changes the signed-in user's password. The API logs out other devices and
 * returns a fresh access token, which is stored here.
 */
export function PasswordForm({ requireCurrent = false, submitLabel = "Save password", onSuccess, className }: PasswordFormProps) {
  const [current, setCurrent] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const problem = password ? getPasswordProblem(password) : null
  const mismatch = confirm.length > 0 && confirm !== password

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const p = getPasswordProblem(password)
    if (p) return setError(p)
    if (password !== confirm) return setError("Passwords don't match")
    setBusy(true)
    try {
      const res = await apiService.setPassword<{ accessToken?: string; user?: unknown }>(password, requireCurrent ? current : undefined)
      if (!res.success) {
        setError(getApiDisplayMessage(res, "Couldn't save your password"))
        return
      }
      saveSession(res.data?.accessToken, res.data?.user)
      toast.success("Password saved. Other devices have been signed out.")
      setCurrent("")
      setPassword("")
      setConfirm("")
      onSuccess?.()
    } catch {
      setError("Couldn't save your password. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  const type = show ? "text" : "password"
  return (
    <form className={cn("space-y-3", className)} onSubmit={handleSubmit}>
      {requireCurrent && (
        <Input
          type={type}
          placeholder="Current password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="h-11 rounded-full"
          required
        />
      )}
      <div className="relative">
        <Input
          type={type}
          placeholder="New password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-full pr-11"
          required
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-muted-foreground hover:text-primary absolute right-3 top-1/2 -translate-y-1/2 p-1"
          aria-label={show ? "Hide passwords" : "Show passwords"}
        >
          {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
      <Input
        type={type}
        placeholder="Confirm new password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="h-11 rounded-full"
        required
      />
      <p className={cn("text-xs", problem || mismatch ? "text-destructive" : "text-muted-foreground")}>
        {mismatch ? "Passwords don't match" : problem ?? "At least 8 characters, with a letter and a number."}
      </p>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" variant="brand-secondary" shape="pill" className="h-11 w-full" disabled={busy}>
        {busy ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
