import Link from "next/link";
import { LANDING_CARD } from "@/components/(landing)/landing-section";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";

interface MarketingHubCardProps {
  href: string;
  title: string;
  description: string;
  className?: string;
}

export default function MarketingHubCard(props: MarketingHubCardProps) {
  return (
    <Link
      prefetch={true}
      href={props.href}
      className={cn(LANDING_CARD, "group flex flex-col gap-3 p-6 transition-transform hover:-translate-y-0.5", props.className)}>
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-brand text-xl font-semibold tracking-[-0.02em]">{props.title}</h2>
        <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{props.description}</p>
    </Link>
  );
}
