import { Progress } from "@/components/ui/progress";
import { getDaysUntil } from "@/lib/dashboard/tracked-items";
import type { Ambition } from "@ambitiousyou/shared/types";
import { GaugeIcon, TargetIcon, TriangleAlertIcon, TrophyIcon } from "lucide-react";
import { StatCard } from "./stat-card";

interface DashboardStatsProps {
  ambitions: Ambition[];
}

export function DashboardStats(props: DashboardStatsProps) {
  const active = props.ambitions.filter((ambition) => ambition.ambitionStatus === "active");
  const completed = props.ambitions.filter((ambition) => ambition.ambitionStatus === "completed");

  const averageProgress = active.length > 0 ? Math.round(active.reduce((sum, ambition) => sum + (ambition.ambitionPercentageCompleted ?? 0), 0) / active.length) : 0;

  const overdueCount = active.filter((ambition) => getDaysUntil(ambition.ambitionEndDate) < 0).length;
  const needsAttentionCount = active.filter((ambition) => {
    const daysToDeadline = getDaysUntil(ambition.ambitionEndDate);
    const progress = ambition.ambitionPercentageCompleted ?? 0;
    return daysToDeadline < 0 || (daysToDeadline <= 7 && progress < 100);
  }).length;

  const totalLabel = `${props.ambitions.length} total ${props.ambitions.length === 1 ? "ambition" : "ambitions"}`;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard icon={<TargetIcon className="size-5" />} label="Active" value={`${active.length}`} helper={totalLabel} />

      <StatCard icon={<GaugeIcon className="size-5" />} label="Avg progress" value={`${averageProgress}%`} helper={active.length > 0 ? "across active ambitions" : "no active ambitions"}>
        <Progress value={averageProgress} className="h-1.5" aria-label={`Average progress ${averageProgress} percent`} />
      </StatCard>

      <StatCard
        icon={<TrophyIcon className="size-5" />}
        label="Completed"
        value={`${completed.length}`}
        helper={completed.length > 0 ? `${completed.length === 1 ? "ambition" : "ambitions"} achieved` : "your first win awaits"}
        tone={completed.length > 0 ? "positive" : "default"}
      />

      <StatCard
        icon={<TriangleAlertIcon className="size-5" />}
        label="Needs attention"
        value={`${needsAttentionCount}`}
        helper={overdueCount > 0 ? `${overdueCount} overdue` : needsAttentionCount > 0 ? "due within a week" : "all on track"}
        tone={needsAttentionCount > 0 ? (overdueCount > 0 ? "danger" : "warning") : "positive"}
      />
    </div>
  );
}
