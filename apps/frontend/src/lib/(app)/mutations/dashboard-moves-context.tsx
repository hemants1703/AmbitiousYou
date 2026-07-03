"use client";

import type { Milestone, Task } from "@ambitiousyou/shared/types";
import type { QueueItem } from "@/lib/dashboard/tracked-items";
import { getDaysUntil, getItemDate, getItemDescription, getItemKind, getItemTitle, sortByUrgency } from "@/lib/dashboard/tracked-items";
import type { QuickAddAmbition } from "@/components/(app)/dashboard/quick-add";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

function queueItemsKey(items: QueueItem[]): string {
  return items.map((item) => `${item.id}:${item.kind}`).join(",");
}

interface DashboardMovesContextValue {
  openItems: QueueItem[];
  removeOpenItem: (id: string, kind: QueueItem["kind"]) => void;
  addOpenItem: (item: Task | Milestone, ambition: QuickAddAmbition) => void;
}

const DashboardMovesContext = createContext<DashboardMovesContextValue | null>(null);

interface DashboardMovesProviderProps {
  initialOpenItems: QueueItem[];
  children: ReactNode;
}

function toQueueItem(item: Task | Milestone, ambition: QuickAddAmbition): QueueItem {
  const date = new Date(getItemDate(item));
  return {
    id: item.id,
    kind: getItemKind(item),
    title: getItemTitle(item),
    description: getItemDescription(item),
    date,
    daysUntil: getDaysUntil(date),
    ambitionId: ambition.id,
    ambitionName: ambition.name,
    ambitionPriority: "medium",
    ambitionMotivation: null,
  };
}

export function DashboardMovesProvider(props: DashboardMovesProviderProps) {
  const initialOpenItemsKey = queueItemsKey(props.initialOpenItems);
  const [openItems, setOpenItems] = useState<QueueItem[]>(props.initialOpenItems);
  const [prevInitialOpenItemsKey, setPrevInitialOpenItemsKey] = useState(initialOpenItemsKey);

  if (initialOpenItemsKey !== prevInitialOpenItemsKey) {
    setPrevInitialOpenItemsKey(initialOpenItemsKey);
    setOpenItems(props.initialOpenItems);
  }

  const removeOpenItem = useCallback((id: string, kind: QueueItem["kind"]) => {
    setOpenItems((prev) => prev.filter((item) => !(item.id === id && item.kind === kind)));
  }, []);

  const addOpenItem = useCallback((item: Task | Milestone, ambition: QuickAddAmbition) => {
    const queueItem = toQueueItem(item, ambition);
    setOpenItems((prev) => [...prev, queueItem].sort(sortByUrgency));
  }, []);

  const value = useMemo(() => ({ openItems, removeOpenItem, addOpenItem }), [openItems, removeOpenItem, addOpenItem]);

  return <DashboardMovesContext.Provider value={value}>{props.children}</DashboardMovesContext.Provider>;
}

export function useDashboardMoves() {
  const context = useContext(DashboardMovesContext);
  if (!context) {
    throw new Error("useDashboardMoves must be used within DashboardMovesProvider");
  }
  return context;
}

export function useOptionalDashboardMoves() {
  return useContext(DashboardMovesContext);
}
