"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export function MotionWrapper({ children, ...props }: HTMLMotionProps<"div"> & { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div {...props}>{children}</motion.div>
    </MotionConfig>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

/** Lightweight CSS entrance — avoids framer-motion on hot routes. */
export function FadeIn(props: FadeInProps) {
  return (
    <div
      className={cn(
        "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300",
        // Hold the "from" keyframe during animation-delay (tw-animate-css #66). Important when
        // delay is set because animate-in's shorthand can override fill-mode (#34).
        props.delayMs ? "motion-safe:!fill-mode-both" : "motion-safe:fill-mode-both",
        props.className,
      )}
      style={props.delayMs ? { animationDelay: `${props.delayMs}ms` } : undefined}>
      {props.children}
    </div>
  );
}
