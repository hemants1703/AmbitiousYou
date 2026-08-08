"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** Wait before the entrance fill — align with surrounding FadeIn delays. */
  delayMs?: number
}

/**
 * Fills 0 → `value` with one compositor animation (WAAPI).
 *
 * Replay on Soft Nav / Activity: Cache Components hides routes via Activity,
 * which tears down effects — cleanup cancels the anim, reveal runs it again.
 * No usePathname (that re-fired mid-flight under Soft Nav and felt stuttery).
 */
function Progress({
  className,
  value,
  delayMs = 0,
  ...props
}: ProgressProps) {
  const target = Math.min(Math.max(value ?? 0, 0), 100)
  const indicatorRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = indicatorRef.current
    if (!el) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      el.style.transform = `scaleX(${target / 100})`
      return
    }

    const animation = el.animate(
      [{ transform: "scaleX(0)" }, { transform: `scaleX(${target / 100})` }],
      {
        duration: 600,
        delay: delayMs,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    )

    return () => {
      animation.cancel()
    }
  }, [target, delayMs])

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={target}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        ref={indicatorRef}
        data-slot="progress-indicator"
        className="h-full w-full origin-left bg-primary will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
