"use client";

import type { MoveDetail } from "@/lib/(app)/tracked-item";
import { createContext, useContext, useState, type ReactNode } from "react";
import { MoveDetailDialog } from "./move-detail-dialog";

interface MoveDetailContextValue {
  selectedDetail: MoveDetail | null;
  open: (detail: MoveDetail) => void;
  close: () => void;
  /** Replace the open snapshot after a successful mutation (same id only). */
  syncDetail: (detail: MoveDetail) => void;
}

const MoveDetailContext = createContext<MoveDetailContextValue | null>(null);

interface MoveDetailProviderProps {
  children: ReactNode;
  ambitionStartDate?: Date | string;
  ambitionEndDate?: Date | string;
}

/**
 * Holds the single "which move is being read" state for a surface that lists moves
 * (ambition detail page or dashboard "next moves" card) and renders the one read-only
 * detail dialog. Any descendant opens it via {@link useMoveDetail} with a normalized
 * `MoveDetail` — no prop-drilling through the list/board layers.
 */
export function MoveDetailProvider(props: MoveDetailProviderProps) {
  const [selectedDetail, setSelectedDetail] = useState<MoveDetail | null>(null);

  const value: MoveDetailContextValue = {
    selectedDetail,
    open: (detail) => setSelectedDetail(detail),
    close: () => setSelectedDetail(null),
    syncDetail: (detail) => {
      setSelectedDetail((current) => (current?.id === detail.id ? detail : current));
    },
  };

  return (
    <MoveDetailContext.Provider value={value}>
      {props.children}
      <MoveDetailDialog
        detail={selectedDetail}
        ambitionStartDate={props.ambitionStartDate}
        ambitionEndDate={props.ambitionEndDate}
        onOpenChange={(open) => {
          if (!open) setSelectedDetail(null);
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
