import type { Notification } from "@ambitiousyou/shared";
import { cache } from "react";

export interface NotificationsPayload {
  notifications: Notification[];
  unreadCount: number;
}

export const getNotifications = cache(async (sessionToken: string, limit = 30): Promise<NotificationsPayload | null> => {
  const response = await fetch(`${process.env.API_URL}/notifications?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as NotificationsPayload;
});
