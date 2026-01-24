import type { ComponentProps } from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { SheetContentSide } from "@/utils/enums"

export interface ISheetContentProps {
  side?: SheetContentSide
}

export interface ISheetContentComponentProps
  extends ComponentProps<typeof SheetPrimitive.Content>,
    ISheetContentProps {}
