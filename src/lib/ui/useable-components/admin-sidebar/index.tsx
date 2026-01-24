"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield } from "lucide-react"

import { cn } from "@/lib/helpers"
import { SidebarCollapsible } from "@/utils/enums"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/lib/ui/useable-components/sidebar"
import type { IAdminSidebarProps } from "@/utils/interfaces"
import { ADMIN_SIDEBAR_ITEMS, COMPANY_NAME } from "@/utils/constants"

export const AdminSidebar = ({
  className,
  footer,
}: IAdminSidebarProps) => {
  const pathname = usePathname()
  const { isMobile, setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible={SidebarCollapsible.ICON}
      className={className}
      onMouseEnter={() => {
        if (!isMobile) setOpen(true)
      }}
      onMouseLeave={() => {
        if (!isMobile) setOpen(false)
      }}
    >
      <div className="flex h-full flex-col">
        <div className="p-2">
          <div className="bg-sidebar text-sidebar-foreground flex items-center gap-2 rounded-lg px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <span className="bg-brand-primary text-accent inline-flex size-8 items-center justify-center rounded-md">
              <Shield className="size-4" />
            </span>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="truncate text-sm font-semibold">{COMPANY_NAME}</div>
              <div className="text-sidebar-foreground/70 truncate text-xs">
                Control panel
              </div>
            </div>
          </div>
        </div>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {ADMIN_SIDEBAR_ITEMS.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href + "/"))

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          item.disabled && "pointer-events-none opacity-60"
                        )}
                        aria-disabled={item.disabled}
                      >
                        {item.icon && <item.icon className="size-4" />}
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          {footer ?? (
            <div className="text-sidebar-foreground/70 px-2 text-xs group-data-[collapsible=icon]:hidden">
              © {new Date().getFullYear()} {COMPANY_NAME}
            </div>
          )}
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}

