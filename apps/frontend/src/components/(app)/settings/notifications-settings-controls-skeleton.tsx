import { BellIcon, MailIcon } from "lucide-react";

import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS = [
  { icon: MailIcon, label: "Email account activity" },
  { icon: BellIcon, label: "Ambition reminders" },
] as const;

export function NotificationsSettingsControlsSkeleton() {
  return (
    <CardContent className="space-y-3" aria-busy="true" aria-label="Loading notification settings">
      {ROWS.map((row) => (
        <div
          key={row.label}
          className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4"
        >
          <row.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-medium text-foreground">{row.label}</p>
            <Skeleton className="h-3 w-full max-w-md" />
          </div>
          <Skeleton className="mt-0.5 h-5 w-9 shrink-0 rounded-full" />
        </div>
      ))}
    </CardContent>
  );
}
