"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateNotificationSettings } from "./actions";

interface NotificationSwitchesProps {
  emailAccountActivity: boolean;
  pushAmbitionReminders: boolean;
}

// Switch handler for updating notification settings
const handleCheckedChange = async (setting: keyof NotificationSwitchesProps, value: boolean) => {
  const toggleResponse = await updateNotificationSettings({
    [setting]: value,
  });

  if (toggleResponse.success) {
    toast.success("Notification settings updated", {
      description: `You will now ${value ? "receive" : "no longer receive"} notifications for your settings`,
    });
  } else {
    toast.error("Failed to update your notification settings", {
      description: toggleResponse.error ?? "Please try again later",
    });
  }
};

export function EmailAccountActivitySwitch(props: Pick<NotificationSwitchesProps, "emailAccountActivity">) {
  return (
    <Switch
      checked={props.emailAccountActivity}
      onCheckedChange={() => handleCheckedChange("emailAccountActivity", !props.emailAccountActivity)}
    />
  );
}

export function PushAmbitionRemindersSwitch(props: Pick<NotificationSwitchesProps, "pushAmbitionReminders">) {
  return (
    <Switch
      checked={props.pushAmbitionReminders}
      onCheckedChange={() => handleCheckedChange("pushAmbitionReminders", !props.pushAmbitionReminders)}
    />
  );
}
