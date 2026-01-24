import type { ITooltipContentProps } from "./tooltip"
import { SidebarCollapsible, SidebarSide, SidebarState, SidebarVariant } from "@/utils/enums"

export interface ISidebarContextProps {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export interface ISidebarProviderProps {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface ISidebarProps {
  side?: SidebarSide
  variant?: SidebarVariant
  collapsible?: SidebarCollapsible
}

export interface ISidebarMenuButtonProps {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | ITooltipContentProps
}