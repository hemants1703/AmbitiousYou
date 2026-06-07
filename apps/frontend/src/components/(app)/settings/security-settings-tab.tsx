import { getSessions } from "@/lib/api/auth/get-sessions";
import type { Session } from "@ambitiousyou/shared";
import { KeyRoundIcon, LockKeyholeIcon, MonitorIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordCard } from "./reset-password-card";

interface SecuritySettingsTabProps {
  sessionToken: string;
}

function formatSessionDate(value: Date | string | null) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function parseUserAgent(ua: string | null) {
  if (!ua) return "Unknown device";

  if (/iPhone|iPad|iPod/i.test(ua)) return "iPhone / iPad";
  if (/Android/i.test(ua)) return "Android device";

  const browsers: Array<[RegExp, string]> = [
    [/Edg\//i, "Microsoft Edge"],
    [/OPR\//i, "Opera"],
    [/Chrome\//i, "Chrome"],
    [/Safari\//i, "Safari"],
    [/Firefox\//i, "Firefox"],
  ];

  const os: Array<[RegExp, string]> = [
    [/Windows NT/i, "Windows"],
    [/Macintosh/i, "macOS"],
    [/Linux/i, "Linux"],
  ];

  const browser = browsers.find(([re]) => re.test(ua));
  const platform = os.find(([re]) => re.test(ua));

  const parts = [browser?.[1], platform?.[1]].filter(Boolean);
  return parts.length ? parts.join(" on ") : "Unknown browser";
}

function SessionRow(props: { session: Session }) {
  const isExpired = new Date(props.session.expiresAt) < new Date();

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <MonitorIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-foreground">
            {parseUserAgent(props.session.userAgent)}
          </p>
          <p className="text-xs text-muted-foreground">
            {props.session.ipAddress ?? "IP not recorded"}&nbsp;·&nbsp;Signed in{" "}
            {formatSessionDate(props.session.createdAt)}
          </p>
          <p className="text-xs text-muted-foreground">
            Expires {formatSessionDate(props.session.expiresAt)}
          </p>
        </div>
      </div>
      <Badge variant={isExpired ? "outline" : "default"} className="mt-0.5 shrink-0">
        {isExpired ? "Expired" : "Active"}
      </Badge>
    </div>
  );
}

export async function SecuritySettingsTab(props: SecuritySettingsTabProps) {
  const sessions = await getSessions(props.sessionToken);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockKeyholeIcon className="size-4 text-primary" />
            Authentication
          </CardTitle>
          <CardDescription>Manage how you sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 p-4">
            <div className="flex items-center gap-3">
              <KeyRoundIcon className="size-4 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">Standard email&nbsp;+&nbsp;password login</p>
              </div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
        </CardContent>
      </Card>

      <ResetPasswordCard />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MonitorIcon className="size-4 text-primary" />
            Active sessions
          </CardTitle>
          <CardDescription>
            Devices and browsers currently signed in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions === null ? (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">
                Could not load sessions. Try refreshing the page.
              </p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">No active sessions found.</p>
            </div>
          ) : (
            sessions.map((session) => <SessionRow key={session.id} session={session} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
