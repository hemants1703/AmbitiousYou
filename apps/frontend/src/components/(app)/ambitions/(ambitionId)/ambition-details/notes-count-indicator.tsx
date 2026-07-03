import { cn } from "@/lib/utils";

interface NotesCountIndicatorProps {
  count: number;
  className?: string;
}

function formatCount(count: number) {
  if (count > 99) return "99+";
  return String(count);
}

/**
 * Mini sticky-note stack — back sheets peek behind a single front card that carries the count.
 */
export function NotesCountIndicator(props: NotesCountIndicatorProps) {
  if (props.count === 0) {
    return null;
  }

  const label = formatCount(props.count);
  const isWide = label.length > 1;
  const backLayers = props.count === 1 ? 0 : props.count <= 4 ? 1 : 2;

  return (
    <span
      className={cn("relative inline-flex h-5 shrink-0 align-middle", isWide ? "min-w-[1.625rem]" : "w-5", props.className)}
      aria-label={`${props.count} ${props.count === 1 ? "note" : "notes"}`}>
      {backLayers >= 2 ? (
        <span
          className="pointer-events-none absolute inset-px rounded-[5px] border border-yellow-600/12 bg-yellow-200/45 dark:border-yellow-400/10 dark:bg-yellow-500/8"
          style={{ transform: "translate(3px, -2px) rotate(7deg)" }}
          aria-hidden="true"
        />
      ) : null}
      {backLayers >= 1 ? (
        <span
          className="pointer-events-none absolute inset-px rounded-[5px] border border-yellow-600/16 bg-yellow-100/65 dark:border-yellow-400/12 dark:bg-yellow-400/12"
          style={{ transform: "translate(1.5px, -1px) rotate(3.5deg)" }}
          aria-hidden="true"
        />
      ) : null}

      <span
        className={cn(
          "relative z-10 flex h-5 items-center justify-center rounded-[5px] border border-yellow-500/35 bg-gradient-to-b from-yellow-50 via-yellow-50 to-yellow-100/95 px-1 text-[10px] font-semibold leading-none tabular-nums tracking-tight text-yellow-950 shadow-[0_1px_1px_rgba(161,98,7,0.14)] ring-1 ring-inset ring-white/50 dark:border-yellow-400/30 dark:from-yellow-400/28 dark:via-yellow-400/22 dark:to-yellow-500/18 dark:text-yellow-50 dark:ring-white/10",
          isWide ? "min-w-[1.625rem]" : "w-5",
        )}>
        {label}
      </span>
    </span>
  );
}
