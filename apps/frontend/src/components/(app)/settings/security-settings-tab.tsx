"use client";

import type { Session } from "@/types";
import { ChevronDownIcon, KeyRoundIcon, LockKeyholeIcon, MonitorIcon } from "lucide-react";
import { useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ResetPasswordCard } from "./reset-password-card";

const EXPIRED_PAGE_SIZE = 5;

interface SecuritySettingsTabProps {
  sessions: Session[] | null;
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

function isSessionExpired(session: Session) {
  return new Date(session.expiresAt) < new Date();
}

function SessionRow(props: { session: Session; muted?: boolean }) {
  const expired = isSessionExpired(props.session);

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 p-4",
        props.muted && "border-border/40 bg-muted/15 opacity-80",
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <MonitorIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 space-y-1">
          <p
            className={cn(
              "truncate text-sm font-medium",
              props.muted ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {parseUserAgent(props.session.userAgent)}
          </p>
          <p className="text-xs text-muted-foreground">
            {props.session.ipAddress ?? "IP not recorded"}&nbsp;·&nbsp;Signed in{" "}
            {formatSessionDate(props.session.createdAt)}
          </p>
          <p className="text-xs text-muted-foreground">
            {expired ? "Expired" : "Expires"} {formatSessionDate(props.session.expiresAt)}
          </p>
        </div>
      </div>
      <Badge variant={expired ? "outline" : "default"} className="mt-0.5 shrink-0">
        {expired ? "Expired" : "Active"}
      </Badge>
    </div>
  );
}

function ExpiredSessionsSection(props: { sessions: Session[] }) {
  const [visibleCount, setVisibleCount] = useState(EXPIRED_PAGE_SIZE);
  const visible = props.sessions.slice(0, visibleCount);
  const remaining = props.sessions.length - visibleCount;
  const showMoreCount = Math.min(EXPIRED_PAGE_SIZE, Math.max(remaining, 0));

  return (
    <Accordion type="single" collapsible className="rounded-2xl border-border/60 bg-muted/10">
      <AccordionItem value="expired" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <span className="flex min-w-0 items-center gap-2">
            <span className="text-sm font-medium text-foreground">Expired sessions</span>
            <Badge variant="secondary" className="font-variant-numeric tabular-nums">
              {props.sessions.length}
            </Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          <div className="space-y-3 pt-1">
            {visible.map((session) => (
              <SessionRow key={session.id} session={session} muted />
            ))}
            {remaining > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => setVisibleCount((count) => count + EXPIRED_PAGE_SIZE)}
                aria-label={`Show ${showMoreCount} more expired sessions`}
              >
                Show {showMoreCount} more
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function SecuritySettingsTab(props: SecuritySettingsTabProps) {
  const activeSessions = props.sessions?.filter((session) => !isSessionExpired(session)) ?? [];
  const expiredSessions = props.sessions?.filter((session) => isSessionExpired(session)) ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockKeyholeIcon className="size-4 text-accent-brand" />
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
            <MonitorIcon className="size-4 text-accent-brand" />
            Active sessions
          </CardTitle>
          <CardDescription>
            Devices currently signed in. Expired sessions stay collapsed below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {props.sessions === null ? (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">
                Could not load sessions. Try refreshing the page.
              </p>
            </div>
          ) : props.sessions.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">No active sessions found.</p>
            </div>
          ) : (
            <>
              {activeSessions.length === 0 ? (
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs text-muted-foreground">No active sessions found.</p>
                </div>
              ) : (
                activeSessions.map((session) => <SessionRow key={session.id} session={session} />)
              )}
              {expiredSessions.length > 0 ? <ExpiredSessionsSection sessions={expiredSessions} /> : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
