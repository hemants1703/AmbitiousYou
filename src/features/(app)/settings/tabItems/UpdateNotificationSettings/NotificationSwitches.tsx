"use client";

import { Switch } from "@/components/ui/switch";
import { updateNotificationSettings } from "./actions";
import { UserNotificationSettings } from "@/db/schema";
import { toast } from "sonner";

interface NotificationSwitchesProps {
  userId: string;
  userNotificationSettings: UserNotificationSettings;
}

export function AccountActivitySwitch(props: NotificationSwitchesProps) {
  const handleCheckedChange = async () => {
    props.userNotificationSettings.emailNotifications.accountActivity =
      !props.userNotificationSettings.emailNotifications.accountActivity;
    const toggleResponse = await updateNotificationSettings(
      props.userId,
      props.userNotificationSettings
    );

    if (toggleResponse.success) {
      toast.success("Email Notification settings updated", {
        description: `You will now ${props.userNotificationSettings.emailNotifications.accountActivity ? "receive" : "no longer receive"} email notifications for Account activity`,
      });
    } else {
      toast.error("Failed to update email notification settings", {
        description: toggleResponse.error ?? "Please try again later",
      });
    }
  };

  return (
    <Switch
      checked={props.userNotificationSettings.emailNotifications.accountActivity}
      onCheckedChange={handleCheckedChange}
    />
  );
}

export function AmbitionRemindersSwitch(props: NotificationSwitchesProps) {
  const handleCheckedChange = async () => {
    props.userNotificationSettings.pushNotifications.ambitionReminders =
      !props.userNotificationSettings.pushNotifications.ambitionReminders;
    const toggleResponse = await updateNotificationSettings(
      props.userId,
      props.userNotificationSettings
    );

    if (toggleResponse.success) {
      toast.success("Push Notification settings updated", {
        description: `You will now ${props.userNotificationSettings.pushNotifications.ambitionReminders ? "receive" : "no longer receive"} push notifications for Ambition Reminders`,
      });
    } else {
      toast.error("Failed to update push notification settings", {
        description: toggleResponse.error ?? "Please try again later",
      });
    }
  };

  return (
    <Switch
      checked={props.userNotificationSettings.pushNotifications.ambitionReminders}
      onCheckedChange={handleCheckedChange}
    />
  );
}
