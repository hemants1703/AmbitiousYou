import { Badge } from "@/components/ui/badge";

export function AmbitionStatusBadge(props: { ambitionStatus: string | null }) {
  const status = props.ambitionStatus || "active";
  return (
    <div className="flex justify-between items-center rounded-full overflow-hidden text-xs text-black dark:text-white font-mono uppercase font-bold">
      <span className="bg-gray-200 dark:bg-gray-700 px-2">STATUS</span>
      <span
        className={`px-2 ${
          status === "active"
            ? "bg-green-400 dark:bg-green-600"
            : status === "completed"
              ? "bg-blue-500 dark:bg-blue-700"
              : status === "archived"
                ? "bg-amber-500 dark:bg-amber-700"
                : "bg-gray-500 dark:bg-gray-600"
        }`}
      >
        {status.toUpperCase()}
      </span>
    </div>
  );
}

export function AmbitionPriorityBadge(props: { ambitionPriority: string }) {
  return (
    <Badge
      variant="outline"
      className={`text-xs font-mono uppercase font-bold ${props.ambitionPriority === "high" ? "border-red-500 text-red-500" : props.ambitionPriority === "medium" ? "border-yellow-500 text-yellow-500" : "border-green-500 text-green-500"}`}
    >
      {props.ambitionPriority}
    </Badge>
  );
}

export function AmbitionCategoryBadge(props: { ambitionCategory: string }) {
  return (
    <Badge variant="outline" className="text-xs font-mono uppercase font-bold">
      {props.ambitionCategory}
    </Badge>
  );
}
