import { Badge } from "@/components/ui/badge";

export function AmbitionCategoryBadge(props: { ambitionCategory: string }) {
  return (
    <Badge variant="outline" className="text-xs font-mono uppercase font-bold">
      {props.ambitionCategory}
    </Badge>
  );
}
