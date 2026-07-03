"use client";

import { Button } from "@/components/ui/button";
import type { ContributionCalendar } from "@/lib/dashboard/contribution";
import { downloadCanvas, renderContributionExport } from "@/lib/(app)/share-card";
import { DownloadIcon } from "lucide-react";

interface ContributionExportButtonProps {
  calendar: ContributionCalendar;
}

export function ContributionExportButton(props: ContributionExportButtonProps) {
  if (!props.calendar.stats.hasAnyCompletionEver) return null;

  const handleExport = () => {
    const weeks = props.calendar.weeks.map((week) =>
      week.map((day) => (day ? { count: day.count, level: day.level } : { count: 0, level: 0 as const })),
    );

    const canvas = renderContributionExport({
      weeks,
      stats: {
        totalCompleted: props.calendar.stats.totalCompleted,
        currentStreak: props.calendar.stats.currentStreak,
        longestStreak: props.calendar.stats.longestStreak,
        activeDays: props.calendar.stats.activeDays,
      },
    });

    downloadCanvas(canvas, "ambitiousyou-contribution-calendar.png");
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleExport}>
      <DownloadIcon className="size-4" aria-hidden="true" />
      Export calendar
    </Button>
  );
}
