import { ComponentProps } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { SheetContentSide } from "../enums";
import type { ISheetContentProps } from "@/utils/interfaces";

export type SheetOverlayProps = ComponentProps<typeof SheetPrimitive.Overlay>

export type SheetContentSideType = SheetContentSide.TOP | SheetContentSide.RIGHT | SheetContentSide.BOTTOM | SheetContentSide.LEFT

export type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> & ISheetContentProps

export type SheetTitleProps = ComponentProps<typeof SheetPrimitive.Title>

export type SheetDescriptionProps = ComponentProps<typeof SheetPrimitive.Description>
