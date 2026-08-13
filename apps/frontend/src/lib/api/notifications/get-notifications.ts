import type { Notification } from "@/types";

import { getCachedNotifications } from "@/lib/cache/session-data";

export interface NotificationsPayload {
  notifications: Notification[];
  unreadCount: number;
}

export async function getNotifications(_sessionToken: string, limit = 30): Promise<NotificationsPayload | null> {
  return getCachedNotifications(limit);
}
