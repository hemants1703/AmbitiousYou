"use client";

import {
  savePushSubscriptionAction,
  syncDueTodayRemindersAction,
  togglePushAmbitionRemindersSetting,
} from "@/lib/actions/(app)/notifications/notification-actions";
import {
  canUseWebPush,
  isIosDevice,
  isStandaloneDisplayMode,
  subscribeToWebPush,
  subscriptionToJson,
} from "@/lib/(app)/push/web-push-client";
import { PendingButton } from "@/components/(app)/mutations/pending-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlarmClockIcon, BellRingIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useCloseOnActivityHide } from "@/lib/(app)/use-close-on-activity-hide";

export type EnableRemindersIntent = "enable" | "connect";

interface EnableRemindersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnabled: () => void;
  /** `enable` = first-time account preference; `connect` = account already on, wire this device. */
  intent?: EnableRemindersIntent;
}

export function EnableRemindersDialog(props: EnableRemindersDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const showIosInstallHint = isIosDevice() && !isStandaloneDisplayMode();
  const intent = props.intent ?? "enable";
  const isConnect = intent === "connect";

  useCloseOnActivityHide(() => {
    if (props.open && !isPending) props.onOpenChange(false);
  });

  function handleOpenChange(open: boolean) {
    if (isPending) return;
    if (!open) setError(null);
    props.onOpenChange(open);
  }

  function handleAllow() {
    setError(null);

    if (showIosInstallHint) {
      setError("Add AmbitiousYou to your Home Screen first, open it from the icon, then allow notifications.");
      return;
    }

    if (!canUseWebPush()) {
      setError("This browser doesn’t support notifications. Try Chrome, Edge, Firefox, or an installed PWA.");
      return;
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      setError("Notifications aren’t configured on this environment yet.");
      return;
    }

    startTransition(async () => {
      const toastId = toast.loading("Enabling reminders…");
      try {
        const permission =
          typeof Notification !== "undefined" && Notification.permission === "granted"
            ? "granted"
            : await Notification.requestPermission();

        if (permission !== "granted") {
          toast.dismiss(toastId);
          setError(
            permission === "denied"
              ? "Notifications are blocked for this site. Allow them in your browser settings, then try again."
              : "Allow notifications so reminders can reach you on this device.",
          );
          return;
        }

        const subscription = await subscribeToWebPush(vapidPublicKey);
        const saveResult = await savePushSubscriptionAction(subscriptionToJson(subscription));
        if (saveResult.error) {
          toast.dismiss(toastId);
          setError(saveResult.error);
          return;
        }

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const settingsResult = await togglePushAmbitionRemindersSetting(true, timeZone);
        if (settingsResult.error || !settingsResult.data) {
          toast.dismiss(toastId);
          setError(settingsResult.error ?? "Could not save your reminder preference.");
          return;
        }

        const syncResult = await syncDueTodayRemindersAction();
        if (syncResult.error) {
          toast.message(isConnect ? "This device is connected" : "Reminders saved", {
            id: toastId,
            description: "You’ll get the next scheduled nudge for due or overdue moves.",
          });
        } else {
          toast.success(
            isConnect
              ? "This device will receive ambition reminders."
              : "Ambition reminders are on. Check for a confirmation on this device.",
            { id: toastId },
          );
        }

        props.onEnabled();
        props.onOpenChange(false);
        router.refresh();
      } catch (err) {
        console.error(err);
        toast.dismiss(toastId);
        setError("Something went wrong enabling reminders. Please try again.");
      }
    });
  }

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 overflow-y-auto sm:max-w-md" showCloseButton={!isPending}>
        <DialogHeader className="items-center pr-0 text-center">
          <span className="mb-1 flex size-12 items-center justify-center rounded-2xl bg-accent-brand/12 text-accent-brand" aria-hidden="true">
            <BellRingIcon className="size-6" />
          </span>
          <DialogTitle className="font-brand text-xl tracking-[-0.02em] md:text-2xl">
            {isConnect ? "Enable reminders on this device" : "Stay on top of your ambitions"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {isConnect ? (
              <>
                Reminders are already on for your account. Allow notifications here so this Mac, phone, or browser can
                receive those twice-a-day nudges too.
              </>
            ) : (
              <>
                Your browser will ask next. Allow notifications so we can remind you{" "}
                <span className="text-foreground">twice a day</span> when something is due today or overdue — not too
                much, not too little — to keep your dreams and ambitions in check, even when AmbitiousYou is closed.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {!isConnect ? (
          <ul className="space-y-2 text-left">
            <li className="flex gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-3">
              <BellRingIcon className="mt-0.5 size-4 shrink-0 text-accent-brand" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-medium">Twice a day, on purpose</p>
                <p className="text-xs text-muted-foreground">
                  Two check-ins keep you honest about open moves without flooding your day.
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-3">
              <AlarmClockIcon className="mt-0.5 size-4 shrink-0 text-accent-brand" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-medium">Only when it matters</p>
                <p className="text-xs text-muted-foreground">We nudge for due or overdue work — finish early and we stay quiet.</p>
              </div>
            </li>
          </ul>
        ) : null}

        {showIosInstallHint ? (
          <p role="status" className="rounded-2xl border border-border/60 bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
            On iOS: Share → <span className="text-foreground">Add to Home Screen</span>, open from the icon, then tap
            Allow.
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <PendingButton
            type="button"
            className="h-11 w-full touch-manipulation"
            isPending={isPending}
            onClick={handleAllow}
          >
            Allow notifications
          </PendingButton>
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full touch-manipulation text-muted-foreground"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            Not now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
