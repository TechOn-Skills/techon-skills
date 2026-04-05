"use client"

import Link from "next/link"
import { CheckIcon, GlobeIcon, MoonIcon, PaletteIcon, SunIcon, UserIcon } from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { cn } from "@/lib/helpers"
import { useTheme } from "@/lib/providers/theme"
import { ThemeMode } from "@/utils/enums/theme"
import { CONFIG } from "@/utils/constants"

export const StudentSettingsScreen = () => {
  const { theme, changeTheme } = useTheme()

  const themeOptions = [
    { value: ThemeMode.LIGHT, label: "Light", icon: SunIcon },
    { value: ThemeMode.DARK, label: "Dark", icon: MoonIcon },
    { value: ThemeMode.SYSTEM, label: "System", icon: GlobeIcon },
  ]

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Settings</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Personalize your experience
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Customize your account and display preferences.
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PaletteIcon className="size-5 text-(--brand-accent)" />
                <div>
                  <CardTitle className="text-base">Appearance</CardTitle>
                  <CardDescription className="text-xs">Choose your theme</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeTheme(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-2xl border p-4 transition-all hover:bg-background/60",
                    theme === option.value ? "bg-background/80 border-(--brand-primary)" : "bg-background/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <option.icon className={cn("size-4", theme === option.value && "text-(--brand-primary)")} />
                    <span className="font-semibold text-sm">{option.label}</span>
                  </div>
                  {theme === option.value && (
                    <CheckIcon className="size-4 text-(--brand-primary)" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
          <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserIcon className="size-5 text-(--brand-accent)" />
                <div>
                  <CardTitle className="text-base">Account</CardTitle>
                  <CardDescription className="text-xs">Manage your profile</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" shape="pill" className="w-full sm:w-auto">
                <Link href={CONFIG.ROUTES.STUDENT.PROFILE} className="gap-2">
                  View profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
