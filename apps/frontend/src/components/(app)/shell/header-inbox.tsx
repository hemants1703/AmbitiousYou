import { NotificationsInbox } from "@/components/(app)/notifications/notifications-inbox";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedNotifications } from "@/lib/cache/session-data";

/**
 * Streams the notification bell independently of the rest of the app chrome.
 * Inbox payload is cached per user via `'use cache: private'`.
 */
export async function HeaderInbox() {
  const inbox = await getCachedNotifications(20);

  return (
    <NotificationsInbox
      initialNotifications={inbox?.notifications ?? []}
      initialUnreadCount={inbox?.unreadCount ?? 0}
    />
  );
}

export function HeaderInboxSkeleton() {
  return <Skeleton className="size-8 shrink-0 rounded-md" aria-hidden="true" />;
}
