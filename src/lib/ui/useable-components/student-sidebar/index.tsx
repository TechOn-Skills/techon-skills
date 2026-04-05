"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "@apollo/client/react"
import { GraduationCap } from "lucide-react"

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
import type { IStudentSidebarProps } from "@/utils/interfaces"
import { COMPANY_NAME, STUDENT_SIDEBAR_ITEMS, CONFIG } from "@/utils/constants"
import { useUser } from "@/lib/providers/user"
import { GET_PAYMENTS_BY_USER } from "@/lib/graphql"
import { isDueMonthReached } from "@/lib/helpers"

export const StudentSidebar = ({
  className,
  footer,
}: IStudentSidebarProps) => {
  const pathname = usePathname()
  const { isMobile, setOpen } = useSidebar()
  const { userProfileInfo } = useUser()
  const { data: paymentsData } = useQuery<{ getPaymentsByUser: Array<{ isPaid: boolean; paymentDate: string }> }>(GET_PAYMENTS_BY_USER, {
    variables: { userId: userProfileInfo?.id ?? "" },
    skip: !userProfileInfo?.id,
  })
  const pendingDuesCount = (paymentsData?.getPaymentsByUser ?? []).filter(
    (p) => !p.isPaid && isDueMonthReached(p.paymentDate)
  ).length

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
      <div className="flex h-full flex-col overflow-hidden">
        <div className="p-2">
          <div className="bg-sidebar text-sidebar-foreground flex items-center gap-2 rounded-lg px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <span className="bg-brand-secondary text-accent inline-flex size-8 items-center justify-center rounded-md">
              <GraduationCap className="size-4" />
            </span>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <div className="truncate text-sm font-semibold">{COMPANY_NAME}</div>
              <div className="text-sidebar-foreground/70 truncate text-xs">
                Learning hub
              </div>
            </div>
          </div>
        </div>

        <SidebarSeparator className="max-w-[95%]" />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explore</SidebarGroupLabel>
            <SidebarMenu>
              {STUDENT_SIDEBAR_ITEMS.map((item) => {
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
                          "flex items-center gap-2 w-full",
                          item.disabled && "pointer-events-none opacity-60"
                        )}
                        aria-disabled={item.disabled}
                      >
                        <span className="relative inline-flex">
                          <item.icon className="size-4" />
                          {item.href === CONFIG.ROUTES.STUDENT.FEES && pendingDuesCount > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                              {pendingDuesCount > 99 ? "99+" : pendingDuesCount}
                            </span>
                          )}
                        </span>
                        <span className="group-data-[collapsible=icon]:hidden flex-1">
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

