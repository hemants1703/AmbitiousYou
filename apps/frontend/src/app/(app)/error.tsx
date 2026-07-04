"use client";

import { ErrorFallback } from "@/components/error-fallback";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error(props: ErrorProps) {
  return <ErrorFallback error={props.error} reset={props.reset} layout="inset" />;
}
