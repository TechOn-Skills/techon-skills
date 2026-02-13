import { ComponentProps } from "react"
import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/lib/ui/useable-components/button/variants"
import { IAsChildProps } from "@/utils/interfaces"

export type ButtonProps = Omit<ComponentProps<"button">, "disabled"> &
    VariantProps<typeof buttonVariants> &
    IAsChildProps & {
        loading?: boolean
        disabled?: boolean
    }