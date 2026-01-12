import * as Card from "@/components/ui/card";
import {
  EmailAccountActivitySwitch
} from "./UpdateNotificationSettings/NotificationSwitches";

interface NotificationsTabProps {
  emailAccountActivity: boolean;
  pushAmbitionReminders: boolean;
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
              <p className="text-sm text-muted-foreground">Receive security alerts and account notifications</p>
            </div>
            <EmailAccountActivitySwitch emailAccountActivity={props.emailAccountActivity} />
          </div>
        </div>

        {/* <Separator /> */}

        {/* <div>
          <h3 className="font-bold mb-4 uppercase tracking-widest text-xs">Push Notifications</h3>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="font-medium">Ambition Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get notified when your ambitions or its tasks/milestones are due
              </p>
            </div>
            <PushAmbitionRemindersSwitch pushAmbitionReminders={props.pushAmbitionReminders} />
          </div>
        </div> */}
      </Card.CardContent>
    </Card.Card>
  );
}
