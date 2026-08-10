import { cn } from "@/lib/utils";

interface AmbitionStatusBadgeProps {
  ambitionStatus: string;
  /**
   * List cards: hide the `STATUS` prefix when the `@container/ambition-card`
   * is narrow so the value pill keeps room for the due date.
   * Detail / marketing: leave unset for the full `STATUS | VALUE` badge.
   */
  adaptive?: boolean;
  className?: string;
}

function statusValueClass(status: string) {
  if (status === "active") {
    return "bg-green-600 text-white";
  }
  if (status === "completed") {
    return "bg-blue-600 text-white";
  }
  if (status === "missed") {
    return "bg-amber-700 text-white";
  }
  return "bg-gray-200 text-black";
}

export function AmbitionStatusBadge(props: AmbitionStatusBadgeProps) {
  const label = props.ambitionStatus.toUpperCase();

  return (
    <div
      className={cn("flex shrink-0 items-center overflow-hidden rounded-full font-mono text-xs font-bold uppercase", props.className)}
      aria-label={`Status: ${props.ambitionStatus}`}>
      <span className={cn("bg-gray-200 px-2 pt-px text-black", props.adaptive && "hidden @[30rem]/ambition-card:inline")}>STATUS</span>
      <span className={cn("px-2 pt-px", statusValueClass(props.ambitionStatus))}>{label}</span>
    </div>
  );
}
