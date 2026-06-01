"use client";

import { useSyncExternalStore } from "react";

/**
 * Time-of-day greeting word ("Good morning"/"afternoon"/"evening").
 *
 * Read from the user's local clock so it's correct in their timezone. We use
 * useSyncExternalStore with a server snapshot of "Hello": the server (and the
 * hydration pass) render "Hello", then React re-renders with the client-local
 * greeting — no hydration mismatch and no setState-in-effect.
 */

function subscribe(): () => void {
  // Time of day doesn't push updates; a no-op unsubscribe is sufficient.
  return () => {};
}

function getClientGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getServerGreeting(): string {
  return "Hello";
}

export function TimeOfDayGreeting() {
  const greeting = useSyncExternalStore(subscribe, getClientGreeting, getServerGreeting);
  return <>{greeting}</>;
}
