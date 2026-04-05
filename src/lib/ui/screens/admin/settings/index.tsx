"use client"

import { SettingsIcon } from "lucide-react"

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

      <Card className="bg-background/70 backdrop-blur rounded-3xl max-w-xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="bg-(--brand-primary)/10 text-(--brand-primary) size-12 rounded-2xl flex items-center justify-center">
            <SettingsIcon className="size-6" />
          </div>
          <div>
            <CardTitle>Platform settings</CardTitle>
            <CardDescription>Notification preferences, security, and branding</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Additional settings (notifications, roles, appearance) will be available here once implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
