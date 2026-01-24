import { cn } from "@/lib/helpers"
import { SkeletonProps } from "@/utils/types"

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

