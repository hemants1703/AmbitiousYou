"use client";

import { ErrorFallback } from "@/components/error-fallback";

interface ErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function Error(props: ErrorProps) {
  return <ErrorFallback error={props.error} retry={props.retry} layout="inset" />;
}
