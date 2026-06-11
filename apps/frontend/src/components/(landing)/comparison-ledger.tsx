import { CheckIcon, XIcon } from "lucide-react";

interface ComparisonPair {
  without: string;
  with: string;
}

interface ComparisonLedgerProps {
  pairs: ComparisonPair[];
}

/**
 * Center-spine before/after ledger. Pairs sit either side of a hairline on
 * md+; on mobile each pair stacks (✗ then ✓) with a divider between pairs.
 * The ✗/✓ glyphs keep the polarity readable without relying on colour alone;
 * screen readers get explicit per-row prefixes.
 */
export default function ComparisonLedger(props: ComparisonLedgerProps) {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Visible column headers; screen readers get per-row prefixes instead */}
      <div aria-hidden="true" className="hidden md:grid md:grid-cols-[1fr_1px_1fr] md:gap-x-10">
        <p className="pb-5 text-right font-brand text-base font-semibold text-muted-foreground">
          Without <span translate="no">AmbitiousYou</span>
        </p>
        <div className="bg-border/60" />
        <p className="pb-5 font-brand text-base font-semibold">
          With <span translate="no">AmbitiousYou</span>
        </p>
      </div>

      <ul>
        {props.pairs.map((pair) => (
          <li key={pair.with} className="lp-reveal grid grid-cols-1 border-b border-border/40 py-2 last:border-b-0 md:grid-cols-[1fr_1px_1fr] md:gap-x-10 md:border-b-0 md:py-0">
            <div className="flex items-start gap-3 py-2 md:flex-row-reverse md:py-4 md:text-right">
              <XIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
              <span className="text-sm text-muted-foreground md:text-base">
                <span className="sr-only">Without AmbitiousYou: </span>
                {pair.without}
              </span>
            </div>
            <div aria-hidden="true" className="hidden bg-border/60 md:block" />
            <div className="flex items-start gap-3 py-2 md:py-4">
              <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-green-500" />
              <span className="text-sm md:text-base">
                <span className="sr-only">With AmbitiousYou: </span>
                {pair.with}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
