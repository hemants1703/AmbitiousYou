import { CheckIcon, CreditCardIcon, SparklesIcon, ZapIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { freePlan } from "@/lib/pricing/free-plan";

const PRO_PLAN_FEATURES = [
  "Advanced analytics & insights",
  "Priority reminders",
  "Export data (CSV / PDF)",
  "Early access to new features",
];

export function BillingSettingsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="size-4 text-primary dark:text-chart-1" />
            Current plan
          </CardTitle>
          <CardDescription>You are on the {freePlan.name} plan. Upgrade any time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4">
            <div className="space-y-0.5">
              <p className="font-brand text-2xl font-semibold tracking-[-0.03em] text-foreground">{freePlan.price}</p>
              <p className="text-sm text-muted-foreground">{freePlan.tagline}</p>
            </div>
            <Badge variant="outline">Current plan</Badge>
          </div>

          <ul className="space-y-2">
            {freePlan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CheckIcon className="size-4 shrink-0 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/20 dark:border-chart-1/20">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="size-4 text-primary dark:text-chart-1" />
              AmbitiousYou Pro
            </CardTitle>
            <Badge variant="outline" className="shrink-0 border-primary/30 dark:border-chart-1/30 text-primary dark:text-chart-1">
              Coming soon
            </Badge>
          </div>
          <CardDescription>
            Everything in Free, plus premium capabilities to push further.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ul className="space-y-2">
            {PRO_PLAN_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <ZapIcon className="size-4 shrink-0 text-primary/60 dark:text-chart-1/60" />
                {feature}
              </li>
            ))}
          </ul>
          <Button disabled size="sm" className="w-full sm:w-auto">
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
