"use client";

import { HTMLMotionProps, motion } from "framer-motion";

export function MotionWrapper({
  children,
  ...props
}: HTMLMotionProps<"div"> & { children: React.ReactNode }) {
  return <motion.div {...props}>{children}</motion.div>;
}
