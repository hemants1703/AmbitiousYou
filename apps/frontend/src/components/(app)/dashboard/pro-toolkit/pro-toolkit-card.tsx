"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SparklesIcon, TrophyIcon, DatabaseIcon, Plug2Icon } from "lucide-react";
import { FadeIn } from "@/components/motion-wrapper";

interface ProToolkitCardProps {
  proofLogsCount: number;
}

export function ProToolkitCard(props: ProToolkitCardProps) {
  const tools = [
    {
      title: "Wins",
      description: `${props.proofLogsCount} logged · Private highlight reel`,
      icon: <TrophyIcon className="size-5 text-accent-brand" />,
      href: "/wins",
    },
    {
      title: "Ask AI",
      description: "Grounded answers over your data",
      icon: <SparklesIcon className="size-5 text-accent-brand" />,
      href: "/ask-ai",
    },
    {
      title: "Export Data",
      description: "CSV of all ambitions & moves",
      icon: <DatabaseIcon className="size-5 text-accent-brand" />,
      href: "/settings?tab=data",
    },
    {
      title: "Integrations",
      description: "Google Calendar & more",
      icon: <Plug2Icon className="size-5 text-accent-brand" />,
      href: "/settings?tab=integrations",
    },
  ];

  return (
    <FadeIn delayMs={200}>
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="size-5 text-accent-brand" />
            <h3 className="font-semibold text-foreground">Pro Toolkit</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Power features for serious ambition tracking.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group flex flex-col gap-2 rounded-xl border border-border/60 bg-background/50 p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {tool.icon}
                  <span className="font-medium text-foreground">{tool.title}</span>
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}