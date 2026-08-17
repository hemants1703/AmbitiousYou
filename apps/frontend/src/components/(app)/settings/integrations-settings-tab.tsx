"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blockTodayContractOnCalendar, getCalendarConnectUrl } from "@/lib/actions/(app)/ai/ai-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { CalendarIcon, CheckCheckIcon, UnlinkIcon } from "lucide-react";
import { useState, useTransition } from "react";

export function IntegrationsSettingsTab() {
  const [connected, setConnected] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConnect() {
    startTransition(async () => {
      const result = await getCalendarConnectUrl();
      if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  function handleDisconnect() {
    startTransition(async () => {
      // TODO: Implement disconnect action
      setConnected(false);
    });
  }

  function handleBlockCalendar() {
    startTransition(async () => {
      await toastMutation(() => blockTodayContractOnCalendar(), {
        loading: "Blocking 45 minutes…",
        success: "Calendar block created.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Google Calendar</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your calendar to block time for your daily contract moves.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5" />
            Google Calendar
          </CardTitle>
          <CardDescription>Block 45-minute focus time for today&apos;s contract move.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className={`size-3 rounded-full border-2 ${connected ? "bg-emerald-500 border-emerald-500" : "bg-muted border-border"}`} />
              <div>
                <p className="font-medium">{connected ? "Connected" : "Not connected"}</p>
                <p className="text-sm text-muted-foreground">{connected ? "Primary calendar linked" : "Connect to enable calendar blocks"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {connected ? (
                <Button variant="outline" onClick={handleDisconnect} disabled={isPending}>
                  <UnlinkIcon className="size-4 mr-2" />
                  Disconnect
                </Button>
              ) : (
                <Button onClick={handleConnect} disabled={isPending}>
                  <CalendarIcon className="size-4 mr-2" />
                  Connect Google Calendar
                </Button>
              )}
              <Button variant="outline" onClick={handleBlockCalendar} disabled={isPending || !connected}>
                <CheckCheckIcon className="size-4 mr-2" />
                Block 45m for today&apos;s move
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>More integrations are in the works.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Notion sync</p>
          <p>• Slack notifications</p>
          <p>• Zapier / Make webhooks</p>
        </CardContent>
      </Card>
    </div>
  );
}