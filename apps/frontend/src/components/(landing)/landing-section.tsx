import { cn } from "@/lib/utils";

/**
 * The one card recipe for the landing surface. Hover elevation crossfades an
 * ::after shadow layer (compositor-safe) instead of transitioning box-shadow.
 */
export const LANDING_CARD = cn(
  "relative rounded-2xl border border-border/60 bg-card/60 shadow-sm",
  "transition-colors duration-300 hover:border-primary/40",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:shadow-lg after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100",
);

interface EyebrowProps {
  children: React.ReactNode;
  index?: string;
  className?: string;
}

export function Eyebrow(props: EyebrowProps) {
  return (
    <p className={cn("lp-eyebrow flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em]", props.className)}>
      {props.index ? (
        <span aria-hidden="true" className="tabular-nums opacity-70">
          {props.index}
        </span>
      ) : null}
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
      <span>{props.children}</span>
    </p>
  );
}

interface LandingSectionProps {
  id?: string;
  eyebrow?: string;
  index?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}

export default function LandingSection(props: LandingSectionProps) {
  const align = props.align ?? "left";

  return (
    <section id={props.id} className={cn("w-full scroll-mt-24 py-20 md:py-28", props.className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className={cn("lp-reveal max-w-2xl", align === "center" && "mx-auto text-center")}>
          {props.eyebrow ? (
            <Eyebrow index={props.index} className={align === "center" ? "justify-center" : undefined}>
              {props.eyebrow}
            </Eyebrow>
          ) : null}
          <h2 className="mt-4 font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">{props.title}</h2>
          {props.lede ? <p className={cn("mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg", align === "center" && "mx-auto")}>{props.lede}</p> : null}
        </div>
        {props.children ? <div className="mt-12 md:mt-16">{props.children}</div> : null}
      </div>
    </section>
  );
}
