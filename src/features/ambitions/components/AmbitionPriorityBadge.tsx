import { Badge } from "@/components/ui/badge";

interface AmbitionPriorityBadgeProps {
  ambitionPriority: string;
}

export function AmbitionPriorityBadge(props: AmbitionPriorityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-mono uppercase font-bold ${props.ambitionPriority === "high" ? "border-red-500" : props.ambitionPriority === "medium" ? "border-yellow-500" : "border-green-500"}`}
    >
      {props.ambitionPriority}
    </Badge>
  );
}
