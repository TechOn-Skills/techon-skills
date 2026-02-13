import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/helpers"
import { buttonVariants } from "./variants"
import { ButtonProps } from "@/utils/types"

export const Button = ({
  className,
  variant = "default",
  size = "default",
  shape = "md",
  asChild = false,
  loading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled ?? loading

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-loading={loading ? "true" : undefined}
      aria-busy={loading ? true : undefined}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

