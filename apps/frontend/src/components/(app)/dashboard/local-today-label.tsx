"use client";

import { useSyncExternalStore } from "react";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

/**
 * Local calendar date for loading shells. Computed on the client so Cache
 * Components can prerender the dashboard loading route without a blocking
 * `new Date()` on the server.
 */
export function LocalTodayLabel() {
  const label = useSyncExternalStore(
    () => () => {},
    () => DATE_FORMATTER.format(new Date()),
    () => "\u00A0",
  );

  return <>{label}</>;
}
