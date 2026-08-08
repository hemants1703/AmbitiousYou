import { NotificationsInbox } from "@/components/(app)/notifications/notifications-inbox";
import { Skeleton } from "@/components/ui/skeleton";
import { getNotifications } from "@/lib/api/notifications/get-notifications";
import { getSessionToken } from "@/lib/auth";

/**
 * Streams the notification bell independently of the rest of the app chrome.
 * Uses the raw session cookie (backend SessionGuard validates); do not wrap in
 * `use cache` keyed by the opaque token.
 */
export async function HeaderInbox() {
  const sessionToken = await getSessionToken();
  const inbox = await getNotifications(sessionToken, 20);

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
