"use client";

import { HTMLMotionProps, motion, MotionConfig } from "framer-motion";

export function MotionWrapper({ children, ...props }: HTMLMotionProps<"div"> & { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div {...props}>{children}</motion.div>
    </MotionConfig>
  );
}
