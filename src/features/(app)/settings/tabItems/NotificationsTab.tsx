import * as Card from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserNotificationSettings } from "@/db/schema";
import {
  AccountActivitySwitch,
  AmbitionRemindersSwitch,
} from "./UpdateNotificationSettings/NotificationSwitches";

interface NotificationsTabProps {
  userId: string;
  userNotificationSettings: UserNotificationSettings;
}

export default function NotificationsTab(props: NotificationsTabProps) {
  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle>Notification Preferences</Card.CardTitle>
        <Card.CardDescription>Choose how and when you want to be notified</Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent className="space-y-5">
        <div>
          <h3 className="font-bold mb-4 uppercase tracking-widest text-xs">Email Notifications</h3>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="font-medium">Account activity</p>
              <p className="text-sm text-muted-foreground">
                Receive security alerts and account notifications
              </p>
            </div>
            <AccountActivitySwitch
              userId={props.userId}
              userNotificationSettings={props.userNotificationSettings}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-bold mb-4 uppercase tracking-widest text-xs">Push Notifications</h3>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="font-medium">Ambition Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get notified when your ambitions or its tasks/milestones are due
              </p>
            </div>
            <AmbitionRemindersSwitch
              userId={props.userId}
              userNotificationSettings={props.userNotificationSettings}
            />
          </div>
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}
