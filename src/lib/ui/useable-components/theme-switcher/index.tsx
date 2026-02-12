"use client"

import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { cn } from "@/lib/helpers"
import { useTheme } from "@/lib/providers/theme"
import { Button } from "@/lib/ui/useable-components/button"
import { ThemeMode } from "@/utils/enums/theme"

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { theme, changeTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = theme === ThemeMode.DARK

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      shape="pill"
      className={cn(className)}
      aria-label="Toggle theme"
      onClick={() => changeTheme(isDark ? ThemeMode.LIGHT : ThemeMode.DARK)}
    >
      {!mounted ? (
        <span className="size-4" aria-hidden />
      ) : isDark ? (
        <SunIcon className="size-4" />
      ) : (
        <MoonIcon className="size-4" />
      )}
    </Button>
  )
}

