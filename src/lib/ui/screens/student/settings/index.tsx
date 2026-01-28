"use client"

import { useState } from "react"
import { 
  BellIcon, 
  CheckIcon, 
  EyeIcon, 
  EyeOffIcon, 
  GlobeIcon, 
  LockIcon, 
  MoonIcon, 
  PaletteIcon, 
  ShieldIcon, 
  SunIcon, 
  UserIcon,
  ZapIcon
} from "lucide-react"

import { Button } from "@/lib/ui/useable-components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"
import { Input } from "@/lib/ui/useable-components/input"
import { Separator } from "@/lib/ui/useable-components/separator"
import { cn } from "@/lib/helpers"

export const StudentSettingsScreen = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [language, setLanguage] = useState("english")
  
  const [notifications, setNotifications] = useState({
    assignments: true,
    lectures: true,
    announcements: true,
    fees: false,
    achievements: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30min",
  })

  const notificationOptions = [
    { key: "assignments" as const, label: "Assignment Deadlines", description: "Get notified before assignments are due" },
    { key: "lectures" as const, label: "Lecture Reminders", description: "Reminders 30 minutes before class starts" },
    { key: "announcements" as const, label: "Important Announcements", description: "Stay updated with platform news" },
    { key: "fees" as const, label: "Fee Payment Reminders", description: "Monthly fee due date notifications" },
    { key: "achievements" as const, label: "Achievement Unlocks", description: "Celebrate your milestones with us" },
  ]

  const themeOptions = [
    { value: "light", label: "Light", icon: SunIcon },
    { value: "dark", label: "Dark", icon: MoonIcon },
    { value: "system", label: "System", icon: GlobeIcon },
  ]

  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Settings</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Personalize your experience
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Customize your account preferences, notifications, and security settings to match your learning style.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:shadow-xl">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-(--brand-primary) text-(--text-on-dark) size-10 rounded-2xl flex items-center justify-center">
                    <UserIcon className="size-5" />
                  </div>
                  <div>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Full Name</label>
                  <Input defaultValue="Alex Johnson" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Email Address</label>
                  <Input type="email" defaultValue="alex.johnson@example.com" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Student ID</label>
                  <Input value="TS-2026-0421" disabled className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Password & Security */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:shadow-xl">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-(--brand-primary) text-(--text-on-dark) size-10 rounded-2xl flex items-center justify-center">
                    <LockIcon className="size-5" />
                  </div>
                  <div>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>Keep your account secure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrentPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">New Password</label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border bg-background/40 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldIcon className="size-5 text-(--brand-accent) mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm">Two-Factor Authentication</div>
                        <div className="text-muted-foreground text-xs mt-0.5">Add an extra layer of security</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors",
                        security.twoFactor ? "bg-(--brand-primary)" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                          security.twoFactor && "translate-x-5"
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border bg-background/40 p-4">
                    <div className="flex items-start gap-3">
                      <BellIcon className="size-5 text-(--brand-accent) mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm">Login Alerts</div>
                        <div className="text-muted-foreground text-xs mt-0.5">Get notified of new logins</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors",
                        security.loginAlerts ? "bg-(--brand-primary)" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                          security.loginAlerts && "translate-x-5"
                        )}
                      />
                    </button>
                  </div>
                </div>

                <Button variant="brand-secondary" shape="pill" className="w-full">
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px transition-all hover:shadow-xl">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-(--brand-primary) text-(--text-on-dark) size-10 rounded-2xl flex items-center justify-center">
                    <BellIcon className="size-5" />
                  </div>
                  <div>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose what you want to be notified about</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notificationOptions.map((option) => (
                  <div
                    key={option.key}
                    className="flex items-center justify-between rounded-2xl border bg-background/40 p-4 transition-all hover:bg-background/60"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{option.label}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{option.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifications({ ...notifications, [option.key]: !notifications[option.key] })}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors ml-4",
                        notifications[option.key] ? "bg-(--brand-primary)" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
                          notifications[option.key] && "translate-x-5"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar - Appearance & Quick Actions */}
        <div className="space-y-6">
          {/* Theme Settings */}
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
                    onClick={() => setTheme(option.value as typeof theme)}
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

          {/* Language Settings */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(70,208,255,0.25),rgba(255,138,61,0.12),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GlobeIcon className="size-5 text-(--brand-accent)" />
                  <div>
                    <CardTitle className="text-base">Language</CardTitle>
                    <CardDescription className="text-xs">Select your language</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border-input bg-transparent dark:bg-input/30 h-11 w-full rounded-2xl border px-4 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2"
                >
                  <option value="english">English</option>
                  <option value="urdu">Urdu</option>
                  <option value="arabic">Arabic</option>
                </select>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tip */}
          <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(242,140,40,0.25),rgba(79,195,232,0.15),transparent_70%)] p-px">
            <Card className="bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 rounded-3xl">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-(--brand-accent)">
                  <ZapIcon className="size-5" />
                  <span className="font-semibold text-sm">Pro Tip</span>
                </div>
                <p className="text-muted-foreground text-sm leading-7">
                  Enable all notifications to never miss an assignment deadline or lecture. Stay on track and achieve your goals faster!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <Button variant="brand-secondary" shape="pill" className="w-full h-11" size="lg">
            <CheckIcon className="size-4" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
