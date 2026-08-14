"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { scheduleRestartTomorrow } from "@/lib/actions/(app)/loop/review-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { MissedDayPayload } from "@/types";
import { Loader2Icon, RotateCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface MissedDayRecoveryProps {
  missedDay: MissedDayPayload;
}

export function MissedDayRecovery(props: MissedDayRecoveryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!props.missedDay.missedYesterday) {
    return null;
  }

  function handleRestart() {
    startTransition(async () => {
      const result = await toastMutation(() => scheduleRestartTomorrow(), {
        loading: "Scheduling restart…",
        success: "Tomorrow has a 10-minute restart.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (!result.error) {
        router.refresh();
      }
    });
  }

  return (
    <Card className="border-amber-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcwIcon className="size-4 text-amber-600 dark:text-amber-400" />
          Yesterday&apos;s move is still open
        </CardTitle>
        <CardDescription>Schedule a 10-minute restart for tomorrow instead of carrying the guilt forward.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleRestart} disabled={isPending}>
          {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
          10-minute restart tomorrow
        </Button>
      </CardContent>
    </Card>
  );
}
