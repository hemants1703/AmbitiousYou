"use client";

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/lib/actions/(app)/notifications/notification-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Notification } from "@/types";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useCloseOnActivityHide } from "@/lib/(app)/use-close-on-activity-hide";

interface NotificationsInboxProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

export function NotificationsInbox(props: NotificationsInboxProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notifications, setNotifications] = useState(props.initialNotifications);
  const [unreadCount, setUnreadCount] = useState(props.initialUnreadCount);
  const [menuOpen, setMenuOpen] = useState(false);

  useCloseOnActivityHide(() => setMenuOpen(false));

  function handleOpenChange(open: boolean) {
    setMenuOpen(open);
    if (open) {
      setNotifications(props.initialNotifications);
      setUnreadCount(props.initialUnreadCount);
    }
  }

  function markOne(notification: Notification) {
    if (notification.readAt) {
      router.push(notification.href);
      return;
    }

    startTransition(async () => {
      setUnreadCount((count) => Math.max(0, count - 1));
      setNotifications((prev) =>
        prev.map((item) => (item.id === notification.id ? { ...item, readAt: new Date() } : item)),
      );
      const result = await markNotificationReadAction(notification.id);
      if (result.error) {
        toast.error(result.error);
        router.refresh();
        return;
      }
      router.push(notification.href);
      router.refresh();
    });
  }

  function markAll() {
    if (unreadCount === 0) return;
    startTransition(async () => {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((item) => ({ ...item, readAt: item.readAt ?? new Date() })));
      const result = await markAllNotificationsReadAction();
      if (result.error) {
        toast.error(result.error);
      }
      router.refresh();
    });
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          className="relative"
        >
          <BellIcon className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent-brand" aria-hidden="true" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Notifications</span>
          {unreadCount > 0 ? (
            <button
              type="button"
              className="text-xs font-normal text-muted-foreground hover:text-foreground disabled:opacity-50"
              onClick={markAll}
              disabled={isPending}
            >
              Mark all read
            </button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No reminders yet. When something is due or overdue, we&apos;ll nudge you here twice a day — enough to stay on track, not enough to nag.
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col items-start gap-0.5 py-2.5"
              onClick={() => markOne(notification)}
            >
              <span className={notification.readAt ? "text-sm" : "text-sm font-medium"}>{notification.title}</span>
              <span className="line-clamp-2 text-xs text-muted-foreground">{notification.body}</span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=notifications">Notification settings</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
