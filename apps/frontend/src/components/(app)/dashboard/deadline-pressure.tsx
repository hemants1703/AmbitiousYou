"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { DeadlineBuckets } from "@/lib/dashboard/tracked-items";
import { GaugeIcon } from "lucide-react";
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";

interface DeadlinePressureProps {
  buckets: DeadlineBuckets;
}

const chartConfig = {
  count: { label: "Open items" },
} satisfies ChartConfig;

export function DeadlinePressure(props: DeadlinePressureProps) {
  const data = [
    { bucket: "Overdue", count: props.buckets.overdue, fill: "var(--destructive)" },
    { bucket: "Today", count: props.buckets.today, fill: "var(--chart-4)" },
    { bucket: "This week", count: props.buckets.thisWeek, fill: "var(--chart-2)" },
    { bucket: "Next week", count: props.buckets.nextWeek, fill: "var(--chart-1)" },
  ];

  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GaugeIcon className="size-4 text-foreground" />
          Deadline pressure
        </CardTitle>
        <CardDescription>Open items grouped by when they&apos;re due.</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="rounded-2xl border border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">No open items with upcoming deadlines.</p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-44 w-full">
            <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 4, right: 28, top: 2, bottom: 2 }}>
              <YAxis type="category" dataKey="bucket" tickLine={false} axisLine={false} width={78} tick={{ fontSize: 12 }} />
              <XAxis type="number" dataKey="count" hide allowDecimals={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" radius={6} barSize={20}>
                {data.map((entry) => (
                  <Cell key={entry.bucket} fill={entry.fill} />
                ))}
                <LabelList dataKey="count" position="right" className="fill-foreground tabular-nums" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
