"use client";

import { useCallback, useMemo, useState } from "react";

export type PendingOp = "creating" | "updating" | "toggling" | "deleting";

export interface UsePendingMapResult {
  isPending: (id: string, op?: PendingOp) => boolean;
  isAnyPending: boolean;
  setPending: (id: string, op: PendingOp) => void;
  clearPending: (id: string) => void;
  clearAll: () => void;
}

/**
 * Per-item pending state for optimistic mutations. Replaces a single global
 * `isPending` flag so one row's save doesn't disable the entire list.
 */
export function usePendingMap(): UsePendingMapResult {
  const [pending, setPendingState] = useState<Map<string, PendingOp>>(() => new Map());

  const setPending = useCallback((id: string, op: PendingOp) => {
    setPendingState((prev) => {
      const next = new Map(prev);
      next.set(id, op);
      return next;
    });
  }, []);

  const clearPending = useCallback((id: string) => {
    setPendingState((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setPendingState(new Map());
  }, []);

  const isPending = useCallback(
    (id: string, op?: PendingOp) => {
      const current = pending.get(id);
      if (!current) return false;
      return op ? current === op : true;
    },
    [pending],
  );

  const isAnyPending = pending.size > 0;

  return useMemo(
    () => ({ isPending, isAnyPending, setPending, clearPending, clearAll }),
    [isPending, isAnyPending, setPending, clearPending, clearAll],
  );
}
