import { cn } from "@/lib/utils";

interface MockFrameProps {
  url: string;
  children: React.ReactNode;
  className?: string;
}

/** Browser-style chrome shared by every product mock on the landing surface. */
export default function MockFrame(props: MockFrameProps) {
  return (
    <div className={cn("overflow-hidden rounded-[calc(var(--radius-lg)-2px)] border border-accent-brand/10 bg-card/90 shadow-elevated backdrop-blur-sm", props.className)}>
      <div className="flex items-center border-b border-border bg-muted/60 p-3">
        <div aria-hidden="true" className="mr-4 flex gap-1.5">
          <div className="size-3 rounded-full bg-red-400" />
          <div className="size-3 rounded-full bg-yellow-400" />
          <div className="size-3 rounded-full bg-green-400" />
        </div>
        <div className="flex h-6 flex-1 items-center justify-center rounded-full bg-background/70 px-3 text-xs text-muted-foreground">{props.url}</div>
      </div>
      {props.children}
    </div>
  );
}
