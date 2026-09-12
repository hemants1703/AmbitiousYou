import type { Ambition } from "@/types";

interface DoneMeansBannerProps {
  ambition: Ambition;
}

function formatEndDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function DoneMeansBanner(props: DoneMeansBannerProps) {
  const definition = props.ambition.ambitionDefinition?.trim();
  const endDate = formatEndDate(props.ambition.ambitionEndDate);

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Done means</p>
      <p className="mt-1 text-sm text-foreground">
        {definition ? (
          <>
            <span className="font-medium">{definition}</span>
            <span className="text-muted-foreground"> by {endDate}.</span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Define what success looks like for <span className="font-medium text-foreground">{props.ambition.ambitionName}</span> by {endDate}.
          </span>
        )}
      </p>
    </div>
  );
}
