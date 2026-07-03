"use client";

import { StatCard } from "@/components/(app)/dashboard/stat-card";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { useDashboardMoves } from "@/lib/(app)/mutations/dashboard-moves-context";
import type { AttentionFlag, AttentionSummary } from "@/lib/dashboard/tracked-items";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, ChevronRightIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";

interface NeedsAttentionStatProps {
  initialSummary: AttentionSummary;
  loadFailed: boolean;
}

function attentionHelper(summary: Pick<AttentionSummary, "totalCount" | "overdueCount" | "dueTodayCount" | "otherFlags">): string {
  if (summary.totalCount === 0) return "all on track";

  const parts: string[] = [];
  if (summary.overdueCount > 0) parts.push(`${summary.overdueCount} overdue`);
  if (summary.dueTodayCount > 0) parts.push(`${summary.dueTodayCount} due today`);
  if (summary.otherFlags.length > 0) parts.push(`${summary.otherFlags.length} ambition${summary.otherFlags.length === 1 ? "" : "s"} flagged`);

  return parts.join(" · ");
}

function attentionTone(summary: Pick<AttentionSummary, "totalCount" | "overdueCount">) {
  if (summary.totalCount === 0) return "positive" as const;
  if (summary.overdueCount > 0) return "danger" as const;
  return "warning" as const;
}

function formatUrgentLabel(daysUntil: number): string {
  if (daysUntil < 0) return `${Math.abs(daysUntil)}d overdue`;
  if (daysUntil === 0) return "Due today";
  return "Due now";
}

function scrollToToday() {
  document.getElementById("today-focus")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function AttentionFlagRow(props: { flag: AttentionFlag }) {
  return (
    <Link
      href={`/ambitions/${props.flag.ambitionId}`}
      className="flex items-start gap-2 rounded-2xl border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
    >
      <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-foreground">{props.flag.ambitionName}</span>
        <span className="block text-xs text-muted-foreground">{props.flag.reason}</span>
      </span>
      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </Link>
  );
}

export function NeedsAttentionStat(props: NeedsAttentionStatProps) {
  const { openItems } = useDashboardMoves();
  const urgentItems = openItems.filter((item) => item.daysUntil <= 0);
  const overdueCount = urgentItems.filter((item) => item.daysUntil < 0).length;
  const dueTodayCount = urgentItems.filter((item) => item.daysUntil === 0).length;
  const summary = {
    totalCount: urgentItems.length + props.initialSummary.otherFlags.length,
    overdueCount,
    dueTodayCount,
    otherFlags: props.initialSummary.otherFlags,
    urgentItems,
  };
  const helper = props.loadFailed ? "couldn't load moves" : attentionHelper(summary);
  const tone = props.loadFailed ? "warning" : attentionTone(summary);
  const isInteractive = !props.loadFailed && summary.totalCount > 0;

  const card = (
    <StatCard
      icon={<TriangleAlertIcon className="size-5" />}
      label="Needs attention"
      value={`${summary.totalCount}`}
      helper={helper}
      tone={tone}
      className={cn("h-full w-full min-h-0", isInteractive && "transition-shadow hover:shadow-lg")}>
      {/* Matches Avg progress stat row height so all four cards align. */}
      <div className="invisible h-1.5" aria-hidden="true" />
    </StatCard>
  );

  if (!isInteractive) {
    return card;
  }

  return (
    <div className="contents">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-full min-h-0 w-full flex-col items-stretch rounded-4xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`${summary.totalCount} items need attention. Open details.`}>
            {card}
          </button>
        </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
        <PopoverHeader>
          <PopoverTitle>Needs attention</PopoverTitle>
          <PopoverDescription>{helper}</PopoverDescription>
        </PopoverHeader>

        <div className="flex flex-col gap-2">
          {summary.urgentItems.map((item) => (
            <Link
              key={`${item.kind}-${item.id}`}
              href={`/ambitions/${item.ambitionId}`}
              className="flex items-start gap-2 rounded-2xl border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
            >
              <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">{item.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {item.ambitionName} · {formatUrgentLabel(item.daysUntil)}
                </span>
              </span>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}

          {summary.otherFlags.map((flag) => (
            <AttentionFlagRow key={flag.ambitionId} flag={flag} />
          ))}
        </div>

        {summary.urgentItems.length > 0 ? (
          <button type="button" onClick={scrollToToday} className="text-left text-xs font-medium text-primary hover:underline">
            Jump to Today section
          </button>
        ) : null}
      </PopoverContent>
      </Popover>
    </div>
  );
}
