"use client";

import {
  removePushSubscriptionAction,
  togglePushAmbitionRemindersSetting,
} from "@/lib/actions/(app)/notifications/notification-actions";
import {
  canUseWebPush,
  getLocalPushDeviceStatus,
  isIosDevice,
  isStandaloneDisplayMode,
  type LocalPushDeviceStatus,
  unsubscribeFromWebPush,
} from "@/lib/(app)/push/web-push-client";
import {
  EnableRemindersDialog,
  type EnableRemindersIntent,
} from "@/components/(app)/settings/enable-reminders-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Settings } from "@ambitiousyou/shared";
import { BellIcon, CheckIcon, MailIcon, SmartphoneIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
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
  const [pushAmbitionReminders, setPushAmbitionReminders] = useState(props.userSettings.pushAmbitionReminders);
  const [deviceStatus, setDeviceStatus] = useState<LocalPushDeviceStatus | null>(null);
  const [enableDialogOpen, setEnableDialogOpen] = useState(false);
  const [dialogIntent, setDialogIntent] = useState<EnableRemindersIntent>("enable");
  const [isPending, startTransition] = useTransition();
  const showIosInstallHint = isIosDevice() && !isStandaloneDisplayMode();

  // Re-sync when the server preference changes, adjusting during render rather than
  // in an effect so the switch never paints the stale value first.
  const [lastServerPreference, setLastServerPreference] = useState(props.userSettings.pushAmbitionReminders);
  if (props.userSettings.pushAmbitionReminders !== lastServerPreference) {
    setLastServerPreference(props.userSettings.pushAmbitionReminders);
    setPushAmbitionReminders(props.userSettings.pushAmbitionReminders);
  }

  // One-shot check when this tab mounts (and after preference flips). No background polling.
  useEffect(() => {
    let cancelled = false;
    void getLocalPushDeviceStatus().then((status) => {
      if (!cancelled) setDeviceStatus(status);
    });
    return () => {
      cancelled = true;
    };
  }, [pushAmbitionReminders]);

  function openEnableDialog(intent: EnableRemindersIntent) {
    if (showIosInstallHint || deviceStatus === "ios-install-required") {
      toast.message("Install AmbitiousYou on your Home Screen first", {
        description: "On iPhone/iPad: Share → Add to Home Screen, open the app icon, then enable reminders.",
      });
      return;
    }

    if (!canUseWebPush() || deviceStatus === "unsupported") {
      toast.error("This browser does not support push notifications.");
      return;
    }

    if (deviceStatus === "denied") {
      toast.error("Notifications are blocked for this site.", {
        description: "Allow notifications in your browser or system settings, then try again.",
      });
      return;
    }

    setDialogIntent(intent);
    setEnableDialogOpen(true);
  }

  function handlePushToggle(checked: boolean) {
    if (checked) {
      // Keep the account switch off until the modal flow succeeds on this device.
      openEnableDialog("enable");
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
        setDeviceStatus(await getLocalPushDeviceStatus());
        toast.success("Ambition reminders disabled.");
      } catch (error) {
        console.error(error);
        toast.error("Could not disable device notifications. Please try again.");
      }
    });
  }

  function handleDeviceConnected() {
    setPushAmbitionReminders(true);
    setDeviceStatus("subscribed");
  }

  return (
    <>
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
            description="Account preference: twice-a-day nudges for due or overdue work — enough to keep ambitions in check, not enough to nag. Each device still needs its own permission."
            checked={pushAmbitionReminders}
            disabled={isPending}
            onCheckedChange={handlePushToggle}
          />

          {pushAmbitionReminders ? <ThisDeviceStatus status={deviceStatus} onConnect={() => openEnableDialog("connect")} /> : null}

          {showIosInstallHint ? (
            <p className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
              On iOS, install the app first: open Safari → Share → Add to Home Screen, then launch AmbitiousYou from
              the icon before enabling reminders on this device.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <EnableRemindersDialog
        open={enableDialogOpen}
        onOpenChange={setEnableDialogOpen}
        onEnabled={handleDeviceConnected}
        intent={dialogIntent}
      />
    </>
  );
}

interface ThisDeviceStatusProps {
  status: LocalPushDeviceStatus | null;
  onConnect: () => void;
}

function ThisDeviceStatus(props: ThisDeviceStatusProps) {
  if (props.status === null) {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        Checking this device…
      </div>
    );
  }

  if (props.status === "subscribed") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
        <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent-brand" aria-hidden="true" />
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-foreground">Receiving on this device</p>
          <p className="text-xs text-muted-foreground">OS notifications are enabled for this browser or installed app.</p>
        </div>
      </div>
    );
  }

  if (props.status === "denied") {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
        <div className="flex items-start gap-3">
          <SmartphoneIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-foreground">Blocked on this device</p>
            <p className="text-xs text-muted-foreground">
              Notifications are blocked in browser or system settings. Allow AmbitiousYou, then refresh this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (props.status === "unsupported" || props.status === "ios-install-required") {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
        <div className="flex items-start gap-3">
          <SmartphoneIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-foreground">Can’t receive on this device yet</p>
            <p className="text-xs text-muted-foreground">
              {props.status === "ios-install-required"
                ? "Add AmbitiousYou to your Home Screen and open it from the icon to enable notifications."
                : "This browser doesn’t support web push notifications."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ready — account on, this device not subscribed; user-driven connect only (no auto-prompt).
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-accent-brand/25 bg-accent-brand/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <SmartphoneIcon className="mt-0.5 size-4 shrink-0 text-accent-brand" aria-hidden="true" />
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-foreground">This device isn’t connected</p>
          <p className="text-xs text-muted-foreground">
            Reminders are on for your account, but this browser hasn’t allowed notifications yet.
          </p>
        </div>
      </div>
      <Button type="button" size="sm" className="h-9 shrink-0 touch-manipulation self-stretch sm:self-auto" onClick={props.onConnect}>
        Enable on this device
      </Button>
    </div>
  );
}
