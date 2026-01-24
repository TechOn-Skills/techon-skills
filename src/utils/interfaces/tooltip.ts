import type { ComponentProps } from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export interface ITooltipContentProps
  extends ComponentProps<typeof TooltipPrimitive.Content> {
  sideOffset?: number
}
