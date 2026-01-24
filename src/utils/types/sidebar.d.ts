import type { VariantProps } from "class-variance-authority"
import type {
  ButtonComponentProps,
  ButtonProps,
  DivComponentProps,
  InputProps,
  MainComponentProps,
  SeparatorProps,
} from "@/utils/types"
import type { sidebarMenuButtonVariants } from "@/lib/ui/useable-components/sidebar/variants"
import type {
  IAsChildProps,
  ISidebarMenuButtonProps,
  ISidebarProps,
  ISidebarProviderProps,
} from "@/utils/interfaces"
import { SidebarSide, SidebarVariant, SidebarCollapsible } from "@/utils/enums"



export type SidebarProviderProps = DivComponentProps & ISidebarProviderProps

export type SidebarSideType = SidebarSide.LEFT | SidebarSide.RIGHT

export type SidebarVariantType = SidebarVariant.SIDEBAR | SidebarVariant.FLOATING | SidebarVariant.INSET

export type SidebarCollapsibleType = SidebarCollapsible.OFFCANVAS | SidebarCollapsible.ICON | SidebarCollapsible.NONE

export type SidebarProps = DivComponentProps & ISidebarProps

export type SidebarTriggerProps = ButtonProps

export type SidebarRailProps = ButtonComponentProps

export type SidebarInsetProps = MainComponentProps

export type SidebarInputProps = InputProps

export type SidebarSeparatorProps = SeparatorProps

export type SidebarMenuButtonProps = ButtonComponentProps &
  ISidebarMenuButtonProps &
  VariantProps<typeof sidebarMenuButtonVariants>

export type SidebarGroupActionProps = ButtonComponentProps & IAsChildProps