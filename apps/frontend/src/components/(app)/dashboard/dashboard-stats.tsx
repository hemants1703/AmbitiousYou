import { NeedsAttentionStat } from "@/components/(app)/dashboard/needs-attention-stat";
import { Progress } from "@/components/ui/progress";
import type { AttentionSummary } from "@/lib/dashboard/tracked-items";
import type { Ambition } from "@ambitiousyou/shared/types";
import { GaugeIcon, TargetIcon, TrophyIcon } from "lucide-react";
import { StatCard } from "./stat-card";

interface DashboardStatsProps {
  ambitions: Ambition[];
  attentionSummary: AttentionSummary;
  loadFailed: boolean;
}

export function DashboardStats(props: DashboardStatsProps) {
  const active = props.ambitions.filter((ambition) => ambition.ambitionStatus === "active");
  const completed = props.ambitions.filter((ambition) => ambition.ambitionStatus === "completed");

  const averageProgress = active.length > 0 ? Math.round(active.reduce((sum, ambition) => sum + (ambition.ambitionPercentageCompleted ?? 0), 0) / active.length) : 0;

  const totalLabel = `${props.ambitions.length} total ${props.ambitions.length === 1 ? "ambition" : "ambitions"}`;

  return (
    <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-4">
      <StatCard icon={<TargetIcon className="size-5" />} label="Active" value={`${active.length}`} helper={totalLabel} tone="default" className="h-full" />

      <StatCard icon={<GaugeIcon className="size-5" />} label="Avg progress" value={`${averageProgress}%`} helper={active.length > 0 ? "across active ambitions" : "no active ambitions"} tone={averageProgress === 100 ? "positive" : "default"} className="h-full">
        <Progress value={averageProgress} className="h-1.5" aria-label={`Average progress ${averageProgress} percent`} />
      </StatCard>

      <StatCard
        icon={<TrophyIcon className="size-5" />}
        label="Completed"
        value={`${completed.length}`}
        helper={completed.length > 0 ? `${completed.length === 1 ? "ambition" : "ambitions"} achieved` : "your first win awaits"}
        tone={completed.length > 0 ? "positive" : "default"}
        className="h-full"
      />

      <NeedsAttentionStat initialSummary={props.attentionSummary} loadFailed={props.loadFailed} />
    </div>
  );
}
