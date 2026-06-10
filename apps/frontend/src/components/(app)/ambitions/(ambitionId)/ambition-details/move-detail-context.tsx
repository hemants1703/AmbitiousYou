"use client";

import type { TrackedItem } from "@/lib/(app)/tracked-item";
import { createContext, useContext, useState, type ReactNode } from "react";
import { MoveDetailDialog } from "./move-detail-dialog";

interface MoveDetailContextValue {
  selectedMove: TrackedItem | null;
  open: (item: TrackedItem) => void;
  close: () => void;
}

const MoveDetailContext = createContext<MoveDetailContextValue | null>(null);

interface MoveDetailProviderProps {
  children: ReactNode;
}

/**
 * Holds the single "which move is being read" state for an ambition's details
 * section and renders the one read-only detail dialog. Wrap the surfaces that
 * list moves (focus card + execution board) in this provider; any descendant
 * opens the dialog via {@link useMoveDetail} — no prop-drilling through the
 * list/board layers. Each surface opens with the `TrackedItem` it already holds
 * (the focus card uses server data, the board its optimistic copy).
 */
export function MoveDetailProvider(props: MoveDetailProviderProps) {
  const [selectedMove, setSelectedMove] = useState<TrackedItem | null>(null);

  const value: MoveDetailContextValue = {
    selectedMove,
    open: (item) => setSelectedMove(item),
    close: () => setSelectedMove(null),
  };

  return (
    <MoveDetailContext.Provider value={value}>
      {props.children}
      <MoveDetailDialog
        item={selectedMove}
        onOpenChange={(open) => {
          if (!open) setSelectedMove(null);
        }}
      />
    </MoveDetailContext.Provider>
  );
}

export function useMoveDetail(): MoveDetailContextValue {
  const context = useContext(MoveDetailContext);
  if (!context) {
    throw new Error("useMoveDetail must be used within a MoveDetailProvider");
  }
  return context;
}
