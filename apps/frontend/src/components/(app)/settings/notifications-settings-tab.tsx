"use client";

import { BellIcon, MailIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "@ambitiousyou/shared";

interface NotificationRowProps {
  id: string;
  icon: ReactNode;
  label: string;
  description: string;
  checked: boolean;
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
        disabled={props.onCheckedChange === undefined}
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
        {/* <NotificationRow
          id="ambition-reminders"
          icon={<BellIcon className="size-4" />}
          label="Ambition reminders"
          description="Push notifications when deadlines are approaching or milestones are due."
          checked={pushAmbitionReminders}
          onCheckedChange={async (checked) => {
            try {
              const updatedSettings = await togglePushAmbitionRemindersSetting(checked);
              setPushAmbitionReminders(updatedSettings.pushAmbitionReminders);
            } catch (error) {
              console.error("Failed to update settings:", error);
              toast.error("Failed to update notification settings. Please try again.");
            }
          }}
        /> */}
      </CardContent>
    </Card>
  );
}
