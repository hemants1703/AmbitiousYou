"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface OptimisticRowProps {
  children: ReactNode;
  isPending?: boolean;
  className?: string;
}

/**
 * In-place pending affordance for list rows. Uses opacity + pulse; disabled
 * when the user prefers reduced motion.
 */
export function OptimisticRow(props: OptimisticRowProps) {
  return (
    <div
      className={cn(
        props.className,
        props.isPending && "opacity-70 motion-safe:animate-pulse",
      )}
      aria-busy={props.isPending || undefined}>
      {props.children}
    </div>
  );
}
