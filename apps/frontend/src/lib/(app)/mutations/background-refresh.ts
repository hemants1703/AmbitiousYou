"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * Defer `router.refresh()` so optimistic UI stays instant. Use only when
 * server-derived aggregates (progress %, dashboard buckets) must reconcile.
 */
export function useBackgroundRefresh() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const refreshInBackground = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  return refreshInBackground;
}
