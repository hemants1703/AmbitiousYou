"use client";

import { useEffect, useRef } from "react";
import { useAiSidebarOptional } from "@/components/ui/ai-sidebar";
import { useSidebar } from "@/components/ui/sidebar";

/** Collapses the app nav once when the AI panel opens (desktop). Must sit under both providers. */
export function AiSidebarNavCollapse() {
  const ai = useAiSidebarOptional();
  const { setOpen: setAppSidebarOpen } = useSidebar();
  const wasOpenRef = useRef(false);

  const open = ai?.open ?? false;
  const isMobile = ai?.isMobile ?? true;

  useEffect(() => {
    if (!ai) return;
    const justOpened = open && !wasOpenRef.current;
    wasOpenRef.current = open;
    if (!isMobile && justOpened) {
      setAppSidebarOpen(false);
    }
  }, [ai, open, isMobile, setAppSidebarOpen]);

  return null;
}
