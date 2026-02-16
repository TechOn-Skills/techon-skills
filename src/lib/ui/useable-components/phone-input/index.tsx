"use client"

import { useCallback, useMemo, useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/helpers"
import { COUNTRY_CODES_LIST } from "@/utils/constants/country-codes"

export interface PhoneValue {
  countryCode: string
  number: string
}

const DEFAULT_COUNTRY = COUNTRY_CODES_LIST[0]

/** Minimum/maximum digits for the number part (without country code) */
const MIN_DIGITS = 7
const MAX_DIGITS = 15

export function getFullPhone(value: PhoneValue): string {
  const digits = value.number.replace(/\D/g, "")
  return `${value.countryCode}${digits}`
}

export function validatePhone(value: PhoneValue): boolean {
  const digits = value.number.replace(/\D/g, "")
  if (digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) return false
  return /^\d+$/.test(digits)
}

export interface PhoneInputProps {
  value: PhoneValue
  onChange: (value: PhoneValue) => void
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
  "aria-invalid"?: boolean
  /** When set (e.g. by Formik), error state is driven by this instead of internal touched. Enables clearing error after form reset. */
  touched?: boolean
  onBlur?: () => void
  /** When true, only border/aria-invalid reflect error; caller shows the message (e.g. Formik). */
  suppressErrorMessage?: boolean
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "Phone number",
  className,
  required,
  disabled,
  "aria-invalid": ariaInvalid,
  touched: touchedProp,
  onBlur,
  suppressErrorMessage,
}: PhoneInputProps) {
  const [internalTouched, setInternalTouched] = useState(false)
  const touched = touchedProp !== undefined ? touchedProp : internalTouched
  const isValid = useMemo(() => {
    if (!value.number.trim()) return !required
    return validatePhone(value)
  }, [value, required])

  const showError = touched && (required ? !isValid : value.number.trim() !== "" && !isValid)

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const digits = raw.replace(/\D/g, "").slice(0, MAX_DIGITS)
      onChange({ ...value, number: digits })
    },
    [value, onChange]
  )

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const code = e.target.value
      const entry = COUNTRY_CODES_LIST.find((c) => c.code === code) ?? DEFAULT_COUNTRY
      onChange({ ...value, countryCode: entry.code })
    },
    [value, onChange]
  )

  const selectedEntry = COUNTRY_CODES_LIST.find((c) => c.code === value.countryCode) ?? DEFAULT_COUNTRY

  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-0">
        <div className="relative flex shrink-0">
          <select
            value={value.countryCode}
            onChange={handleCountryChange}
            disabled={disabled}
            aria-label="Country code"
            aria-invalid={ariaInvalid ?? showError}
            className={cn(
              "border-border text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-11 cursor-pointer appearance-none items-center gap-1.5 rounded-l-xl border border-r-0 bg-transparent pl-3 pr-8 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&::-ms-expand]:hidden",
              showError && "border-destructive focus-visible:ring-destructive/20"
            )}
          >
            {COUNTRY_CODES_LIST.map((entry) => (
              <option key={entry.countryCode} value={entry.code}>
                {entry.flag} {entry.code}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={value.number}
          onChange={handleNumberChange}
          onBlur={() => {
            setInternalTouched(true)
            onBlur?.()
          }}
          disabled={disabled}
          required={required}
          aria-invalid={ariaInvalid ?? showError}
          className={cn(
            "text-primary placeholder:text-muted-foreground border-border h-11 min-w-0 flex-1 rounded-r-xl border border-l-0 bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow]",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showError && "border-destructive focus-visible:ring-destructive/20"
          )}
        />
      </div>
      {showError && !suppressErrorMessage && (
        <p className="text-destructive mt-1 text-xs">
          {value.number.trim() ? `Enter a valid phone number (${MIN_DIGITS}-${MAX_DIGITS} digits)` : "Phone number is required."}
        </p>
      )}
    </div>
  )
}
