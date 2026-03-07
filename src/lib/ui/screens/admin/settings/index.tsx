"use client"

import { BellIcon, ShieldIcon, PaletteIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/useable-components/card"

export const AdminSettingsScreen = () => {
  return (
    <div className="w-full py-10 animate-in fade-in duration-700">
      <div className="mb-8">
        <div className="text-sm font-semibold text-secondary">Admin</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-pretty">
          Configure platform settings. More options will be available here as the product grows.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-background/70 backdrop-blur rounded-3xl">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="bg-(--brand-primary)/10 text-(--brand-primary) size-12 rounded-2xl flex items-center justify-center">
              <BellIcon className="size-6" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Email and in-app notification preferences</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Configure when to receive alerts for new registrations, contact form submissions, and tickets. Coming soon.</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur rounded-3xl">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="bg-(--brand-primary)/10 text-(--brand-primary) size-12 rounded-2xl flex items-center justify-center">
              <ShieldIcon className="size-6" />
            </div>
            <div>
              <CardTitle>Security & access</CardTitle>
              <CardDescription>Roles, permissions, and session settings</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Manage admin roles and access control. Coming soon.</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur rounded-3xl">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="bg-(--brand-primary)/10 text-(--brand-primary) size-12 rounded-2xl flex items-center justify-center">
              <PaletteIcon className="size-6" />
            </div>
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Branding and display options</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Logo, colors, and public-facing branding. Coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
