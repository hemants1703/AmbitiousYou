import { CheckIcon, CreditCardIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { freePlan } from "@/lib/pricing/free-plan";

export function BillingSettingsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="size-4 text-accent-brand" />
            Current plan
          </CardTitle>
          <CardDescription>
            AmbitiousYou is free for a limited time. {freePlan.lede}
          </CardDescription>
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
    </div>
  );
}
