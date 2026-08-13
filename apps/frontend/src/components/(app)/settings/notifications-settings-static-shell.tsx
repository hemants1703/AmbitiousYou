import { BellIcon } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationsSettingsStaticShellProps {
  children: React.ReactNode;
}

/** Static notification card chrome — dynamic toggles stream in via `{children}`. */
export function NotificationsSettingsStaticShell(props: NotificationsSettingsStaticShellProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellIcon className="size-4 text-accent-brand" />
          Notification preferences
        </CardTitle>
        <CardDescription>Control how and when AmbitiousYou reaches you.</CardDescription>
      </CardHeader>
      {props.children}
    </Card>
  );
}
