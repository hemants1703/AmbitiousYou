import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function ProBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
        <Badge variant="outline" className="border border-amber-500 bg-gradient-to-br from-amber-400 via-amber-100 to-amber-500 text-black font-bold px-2 shadow-sm hover:shadow-amber-500/50 transition-all duration-300 animate-gradient-x">
            PRO
        </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Unlock more features with PRO</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
