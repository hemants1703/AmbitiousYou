import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

/** Lightweight CSS entrance — avoids framer-motion on hot routes. */
export function FadeIn(props: FadeInProps) {
  const delayMs = props.delayMs ?? 0;

  return (
    <div
      className={cn(
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300",
        props.className,
      )}
      style={{
        animationDelay: `${delayMs}ms`,
        // Inline fill-mode beats tw-animate-css shorthand without !important (#34, #66).
        ...(delayMs > 0 ? { animationFillMode: "both" as const } : {}),
      }}>
      {props.children}
    </div>
  );
}
