import * as React from "react"

import { cn } from "@/lib/utils"

export type SkeletonProps = React.ComponentProps<"div">

export function Skeleton({ className, ...props }: SkeletonProps): React.ReactElement {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-2xl bg-muted", className)}
      {...props}
    />
  )
}
