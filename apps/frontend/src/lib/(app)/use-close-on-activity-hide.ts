"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * When Cache Components hides a route via React Activity, effect cleanups run.
 * Transient UI (dialogs, menus) should close so users don't return to a page
 * with a modal still open.
 */
export function useCloseOnActivityHide(onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    return () => {
      onCloseRef.current();
    };
  }, []);
}
