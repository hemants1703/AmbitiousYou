"use client";

import {
  removePushSubscriptionAction,
  togglePushAmbitionRemindersSetting,
} from "@/lib/actions/(app)/notifications/notification-actions";
import {
  canUseWebPush,
  isIosDevice,
  isStandaloneDisplayMode,
  unsubscribeFromWebPush,
} from "@/lib/(app)/push/web-push-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Settings } from "@ambitiousyou/shared";
import { BellIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface NotificationRowProps {
  id: string;
  icon: ReactNode;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function NotificationRow(props: NotificationRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 shrink-0 text-muted-foreground">{props.icon}</div>
        <div className="min-w-0 space-y-0.5">
          <Label htmlFor={props.id} className="cursor-pointer text-sm font-medium text-foreground">
            {props.label}
          </Label>
          <p className="text-xs text-muted-foreground">{props.description}</p>
        </div>
      </div>
      <Switch
        id={props.id}
        disabled={props.disabled || props.onCheckedChange === undefined}
        checked={props.checked}
        onCheckedChange={props.onCheckedChange ? (checked) => props.onCheckedChange!(checked) : undefined}
        aria-label={props.label}
        className="mt-0.5 shrink-0"
      />
    </div>
  );
}

interface NotificationsSettingsTabProps {
  userSettings: Settings;
}

export function NotificationsSettingsTab(props: NotificationsSettingsTabProps) {
  const router = useRouter();
  const [pushAmbitionReminders, setPushAmbitionReminders] = useState(props.userSettings.pushAmbitionReminders);
  const [isPending, startTransition] = useTransition();
  const showIosInstallHint = isIosDevice() && !isStandaloneDisplayMode();

  function handlePushToggle(checked: boolean) {
    if (checked) {
      if (showIosInstallHint) {
        toast.message("Install AmbitiousYou on your Home Screen first", {
          description: "On iPhone/iPad: Share → Add to Home Screen, open the app icon, then enable reminders.",
        });
        return;
      }

      if (!canUseWebPush()) {
        toast.error("This browser does not support push notifications.");
        return;
      }

      // Keep the switch off until permission + subscribe succeed on the enable screen.
      router.push("/settings/enable-reminders");
      return;
    }

    startTransition(async () => {
      try {
        const endpoint = await unsubscribeFromWebPush();
        if (endpoint) {
          await removePushSubscriptionAction(endpoint);
        }
        const settingsResult = await togglePushAmbitionRemindersSetting(false);
        if (settingsResult.error || !settingsResult.data) {
          toast.error(settingsResult.error ?? "Failed to update notification settings.");
          return;
        }
        setPushAmbitionReminders(settingsResult.data.pushAmbitionReminders);
        toast.success("Ambition reminders disabled.");
      } catch (error) {
        console.error(error);
        toast.error("Could not disable device notifications. Please try again.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellIcon className="size-4 text-accent-brand" />
          Notification preferences
        </CardTitle>
        <CardDescription>Control how and when AmbitiousYou reaches you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <NotificationRow
          id="email-activity"
          icon={<MailIcon className="size-4" />}
          label="Email account activity"
          description="Receive emails about sign-ins, profile changes, and security events."
          checked={props.userSettings.emailAccountActivity}
        />
        <NotificationRow
          id="ambition-reminders"
          icon={<BellIcon className="size-4" />}
          label="Ambition reminders"
          description="Get reminded at 9 AM and 6 PM (your time) for tasks, milestones, and ambitions that are due today or overdue. Evening only if they’re still open."
          checked={pushAmbitionReminders}
          disabled={isPending}
          onCheckedChange={handlePushToggle}
        />
        {showIosInstallHint ? (
          <p className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            On iOS, install the app first: open Safari → Share → Add to Home Screen, then launch AmbitiousYou from
            the icon before enabling reminders.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
