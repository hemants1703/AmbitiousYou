"use client";

import { canUseWebPush, ensurePushServiceWorker } from "@/lib/(app)/push/web-push-client";
import { useEffect } from "react";

/** Registers the push service worker for authenticated app shells. */
export function RegisterPushSw() {
  useEffect(() => {
    if (!canUseWebPush()) return;
    void ensurePushServiceWorker().catch(() => {
      // Non-fatal: inbox still works without a SW until the user enables reminders.
    });
  }, []);

  return null;
}
