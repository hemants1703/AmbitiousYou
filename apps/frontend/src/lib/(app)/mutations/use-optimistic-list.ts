"use client";

import { useCallback, useEffect, useOptimistic, useRef, useTransition } from "react";

export interface UseOptimisticListParams<T> {
  sourceItems: T[];
  getId: (item: T) => string;
}

export interface OptimisticListMutationOptions<T> {
  tempId?: string;
  optimistic: T | T[];
  apply: (items: T[]) => T[];
  rollback?: T[];
  onSuccess?: (items: T[]) => void;
  onError?: (error: string) => void;
}

export interface UseOptimisticListResult<T> {
  items: T[];
  isPending: boolean;
  mutate: (options: OptimisticListMutationOptions<T>, action: () => Promise<{ error: string | null }>) => void;
  replaceTempId: (tempId: string, item: T) => void;
  setItems: (items: T[]) => void;
}

/**
 * Unified optimistic list mutations: apply local changes immediately, run the
 * server action, roll back on failure, and re-sync when `sourceItems` changes.
 */
export function useOptimisticList<T>(params: UseOptimisticListParams<T>): UseOptimisticListResult<T> {
  const { sourceItems, getId } = params;
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, setOptimisticItems] = useOptimistic(sourceItems, (_current, next: T[]) => next);
  const syncedRef = useRef(sourceItems);

  useEffect(() => {
    if (syncedRef.current !== sourceItems) {
      syncedRef.current = sourceItems;
      setOptimisticItems(sourceItems);
    }
  }, [sourceItems, setOptimisticItems]);

  const mutate = useCallback(
    (options: OptimisticListMutationOptions<T>, action: () => Promise<{ error: string | null }>) => {
      const snapshot = options.rollback ?? sourceItems;
      const next = options.apply([...optimisticItems]);

      startTransition(async () => {
        setOptimisticItems(next);

        const result = await action();
        if (result.error) {
          setOptimisticItems(snapshot);
          options.onError?.(result.error);
        } else {
          options.onSuccess?.(next);
        }
      });
    },
    [optimisticItems, sourceItems, setOptimisticItems],
  );

  const replaceTempId = useCallback(
    (tempId: string, item: T) => {
      setOptimisticItems(optimisticItems.map((current) => (getId(current) === tempId ? item : current)));
    },
    [optimisticItems, getId, setOptimisticItems],
  );

  const setItems = useCallback(
    (items: T[]) => {
      setOptimisticItems(items);
    },
    [setOptimisticItems],
  );

  return { items: optimisticItems, isPending, mutate, replaceTempId, setItems };
}
