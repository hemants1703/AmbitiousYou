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
import { AlarmClockIcon, BellRingIcon, TargetIcon, SunriseIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const valuePoints = [
  {
    icon: SunriseIcon,
    title: "9 AM — start the day on purpose",
    body: "See what’s due today before the noise of the day takes over.",
  },
  {
    icon: AlarmClockIcon,
    title: "6 PM — only if it’s still open",
    body: "A second nudge if you haven’t finished — never spam after you’ve acted.",
  },
  {
    icon: TargetIcon,
    title: "Ambitions, not busywork",
    body: "Reminders tie back to the goals you chose — so progress doesn’t slip into “I’ll do it tomorrow.”",
  },
] as const;

export function EnableRemindersScreen() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const showIosInstallHint = isIosDevice() && !isStandaloneDisplayMode();

  function handleAllow() {
    setError(null);

    if (showIosInstallHint) {
      setError("On iPhone or iPad, add AmbitiousYou to your Home Screen first, open it from the icon, then allow notifications.");
      return;
    }

    if (!canUseWebPush()) {
      setError("This browser doesn’t support notifications. Try Chrome, Edge, Firefox, or Safari on an installed PWA.");
      return;
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      setError("Notifications aren’t configured on this environment yet.");
      return;
    }

    startTransition(async () => {
      try {
        const permission =
          typeof Notification !== "undefined" && Notification.permission === "granted"
            ? "granted"
            : await Notification.requestPermission();

        if (permission !== "granted") {
          setError(
            permission === "denied"
              ? "Notifications are blocked for this site. Allow them in your browser settings, then try again."
              : "You need to allow notifications for ambition reminders to reach you on this device.",
          );
          return;
        }

        const subscription = await subscribeToWebPush(vapidPublicKey);
        const saveResult = await savePushSubscriptionAction(subscriptionToJson(subscription));
        if (saveResult.error) {
          setError(saveResult.error);
          return;
        }

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const settingsResult = await togglePushAmbitionRemindersSetting(true, timeZone);
        if (settingsResult.error || !settingsResult.data) {
          setError(settingsResult.error ?? "Could not save your reminder preference.");
          return;
        }

        await syncDueTodayRemindersAction();
        toast.success("Ambition reminders are on. We’ll nudge you when something’s due today.");
        router.replace("/settings?tab=notifications");
        router.refresh();
      } catch (err) {
        console.error(err);
        setError("Something went wrong enabling reminders. Please try again.");
      }
    });
  }

  return (
    <section className="relative mx-auto flex w-full max-w-lg flex-col gap-8 pb-10 pt-2 md:max-w-xl md:gap-10 md:pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-6 h-48 bg-linear-to-b from-accent-brand/12 via-accent-brand/5 to-transparent md:-top-8 md:h-56"
      />

      <header className="relative space-y-4 text-center md:space-y-5">
        <span className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-accent-brand/15 text-accent-brand shadow-[inset_0_0_0_1px] shadow-accent-brand/20 md:size-16">
          <BellRingIcon className="size-7 md:size-8" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-[0.14em] text-accent-brand uppercase">One more step</p>
          <h1 className="font-brand text-3xl font-semibold tracking-[-0.03em] text-balance md:text-4xl">
            Don’t let due ambitions go quiet
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Your browser will ask permission next. Allow notifications so AmbitiousYou can remind you at{" "}
            <span className="text-foreground">9 AM</span> and again at <span className="text-foreground">6 PM</span>{" "}
            only if today’s moves are still open — on this device, even when the app is closed.
          </p>
        </div>
      </header>

      <ul className="relative space-y-3">
        {valuePoints.map((point) => (
          <li
            key={point.title}
            className="flex gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3.5 text-left shadow-sm md:gap-4 md:px-5 md:py-4"
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-brand/10 text-accent-brand">
              <point.icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium text-foreground">{point.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">{point.body}</p>
            </div>
          </li>
        ))}
      </ul>

      {showIosInstallHint ? (
        <p
          role="status"
          className="relative rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-left text-xs leading-relaxed text-muted-foreground md:text-sm"
        >
          On iOS: Share → <span className="text-foreground">Add to Home Screen</span>, open AmbitiousYou from the icon,
          then tap Allow below.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="relative rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="relative flex flex-col gap-2 sm:gap-3">
        <PendingButton
          type="button"
          size="lg"
          className="h-12 w-full touch-manipulation text-base"
          isPending={isPending}
          onClick={handleAllow}
        >
          Allow notifications
        </PendingButton>
        {isPending ? (
          <Button type="button" variant="ghost" size="lg" className="h-11 w-full touch-manipulation text-muted-foreground" disabled>
            Not now
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="lg" className="h-11 w-full touch-manipulation text-muted-foreground" asChild>
            <Link href="/settings?tab=notifications">Not now</Link>
          </Button>
        )}
        <p className="text-center text-xs text-muted-foreground">
          You can turn reminders off anytime in Settings → Notifications.
        </p>
      </div>
    </section>
  );
}
