import type { ComponentProps } from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import type { ITooltipContentProps } from "@/utils/interfaces"

export type TooltipProviderProps = ComponentProps<typeof TooltipPrimitive.Provider>

export type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root>

export type TooltipTriggerProps = ComponentProps<typeof TooltipPrimitive.Trigger>

export type TooltipContentProps = ITooltipContentProps
