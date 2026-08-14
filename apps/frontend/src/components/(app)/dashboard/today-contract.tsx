"use client";

import { MoveDetailProvider } from "@/components/(app)/ambitions/move-detail-context";
import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { DoneMeansBanner } from "@/components/(app)/dashboard/done-means-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { completeLoopContract, snoozeLoopContract, upsertLoopContract } from "@/lib/actions/(app)/loop/contract-actions";
import { MOVE_KIND_STYLE } from "@/lib/(app)/tracked-item";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { ContractPayload } from "@/types";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, SunriseIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface TodayContractProps {
  initialPayload: ContractPayload;
}

export function TodayContract(props: TodayContractProps) {
  const router = useRouter();
  const [payload, setPayload] = useState(props.initialPayload);
  const [isPending, startTransition] = useTransition();

  const todayLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  const { contract, primaryAmbition, move, suggestedMove } = payload;
  const activeMove = move ?? suggestedMove;
  const isCompleted = contract?.status === "completed";

  function pinSuggestedMove() {
    if (!suggestedMove || !primaryAmbition) return;

    startTransition(async () => {
      const result = await toastMutation(
        () =>
          upsertLoopContract({
            moveKind: suggestedMove.kind,
            moveId: suggestedMove.id,
          }),
        {
          loading: "Setting today's move…",
          success: "Today's move is set.",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      if (result.data) {
        setPayload(result.data);
        router.refresh();
      }
    });
  }

  function handleComplete() {
    if (!contract || isPending) return;

    startTransition(async () => {
      const result = await toastMutation(() => completeLoopContract(contract.id), {
        loading: "Completing…",
        success: "Move completed for today.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (result.data) {
        setPayload(result.data);
        router.refresh();
      }
    });
  }

  function handleSnooze() {
    if (!contract || isPending) return;

    startTransition(async () => {
      const result = await toastMutation(() => snoozeLoopContract(contract.id), {
        loading: "Snoozing to tomorrow…",
        success: "Moved to tomorrow.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (result.data) {
        setPayload(result.data);
        router.refresh();
      }
    });
  }

  return (
    <Card id="today-contract">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SunriseIcon className="size-4 text-foreground" />
          Today
        </CardTitle>
        <CardDescription>
          <span className="font-semibold text-foreground">{todayLabel}</span> · one move on your primary ambition.
        </CardDescription>
        {contract?.status === "active" ? (
          <CardAction>
            <Badge variant="secondary">Today&apos;s move</Badge>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-3">
        {primaryAmbition ? <DoneMeansBanner ambition={primaryAmbition} /> : null}

        {!primaryAmbition ? (
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
            Favourite one active ambition to set it as your primary and pin today&apos;s move.
          </div>
        ) : !contract && activeMove ? (
          <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <MoveKindBadge kind={activeMove.kind} className={MOVE_KIND_STYLE[activeMove.kind]} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{activeMove.title}</p>
                {activeMove.description ? <p className="mt-1 text-sm text-muted-foreground">{activeMove.description}</p> : null}
              </div>
            </div>
            <Button onClick={pinSuggestedMove} disabled={isPending} className="w-full sm:w-auto">
              {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
              Set as today&apos;s move
            </Button>
          </div>
        ) : contract && activeMove ? (
          <MoveDetailProvider>
            <div className="space-y-3 rounded-2xl border border-border/60 p-4">
              <div className="flex items-start gap-3">
                <MoveKindBadge kind={activeMove.kind} className={MOVE_KIND_STYLE[activeMove.kind]} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{activeMove.title}</p>
                  {activeMove.description ? <p className="mt-1 text-sm text-muted-foreground">{activeMove.description}</p> : null}
                  {contract.ifTrigger ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      When <span className="text-foreground">{contract.ifTrigger}</span>
                      {contract.thenAction ? (
                        <>
                          , then <span className="text-foreground">{contract.thenAction}</span>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              </div>

              {isCompleted ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2Icon className="size-4 shrink-0" />
                  Completed for today
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleComplete} disabled={isPending}>
                    {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <CheckCircle2Icon className="size-4" />}
                    Complete
                  </Button>
                  <Button variant="outline" onClick={handleSnooze} disabled={isPending}>
                    <ClockIcon className="size-4" />
                    Snooze to tomorrow
                  </Button>
                </div>
              )}
            </div>
          </MoveDetailProvider>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2Icon className="size-8 text-emerald-600 dark:text-emerald-400" />
            <p className="font-medium text-foreground">No open moves on your primary ambition</p>
            <p className="text-sm text-muted-foreground">Add a task or milestone, or pick a different primary.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
