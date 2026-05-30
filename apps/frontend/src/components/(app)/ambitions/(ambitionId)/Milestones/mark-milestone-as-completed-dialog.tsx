import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Milestone } from "@ambitiousyou/shared/types";
import Link from "next/link";

type MarkMilestoneAsCompletedDialogProps = {
  milestone: Milestone;
  ambitionId: string;
};

export default function MarkMilestoneAsCompletedDialog(props: MarkMilestoneAsCompletedDialogProps) {
  return (
    <Card className="border-dashed border-border/80 bg-background/90 lg:col-span-2">
      <CardHeader>
        <CardTitle>Mark milestone as completed</CardTitle>
        <CardDescription>{props.milestone.milestone}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Completion can be connected to the milestone update action next.</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/ambitions/${props.ambitionId}`}>Close</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
