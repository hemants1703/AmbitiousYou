import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Ambition, Milestone } from "@/db/schema";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";

interface AmbitionMilestonesContainerProps {
  ambition: Ambition;
  milestones: Milestone[];
}

export default async function AmbitionMilestonesContainer(props: AmbitionMilestonesContainerProps) {
  return (
    <Card.Card>
      <Card.CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Card.CardTitle>Milestones Journey</Card.CardTitle>
            <Card.CardDescription>Progress through key checkpoints</Card.CardDescription>
          </div>
          <Button size="tiny" className="text-shadow-md" style={{
            backgroundColor: props.ambition.ambitionColor,
          }}>
            <IconPlus /> Add Milestone
          </Button>
        </div>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="relative mt-6">
          {/* Timeline line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

          {/* Milestones */}
          <div className="space-y-10">
            {props.milestones.map((milestone) => (
              <div key={milestone.id} className="relative pl-10">
                <div
                  className={`absolute left-0 h-5 w-5 rounded-full ${milestone.milestoneCompleted ? "bg-primary" : "bg-muted-foreground/25"} flex items-center justify-center`}
                >
                  {milestone.milestoneCompleted && (
                    <IconCheck className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <div className="flex flex-col">
                  <h4
                    className={`text-base font-medium ${milestone.milestoneCompleted ? "text-primary" : ""}`}
                  >
                    {milestone.milestone}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Target date: {format(new Date(milestone.milestoneTargetDate), "MMMM d, yyyy")}
                  </p>
                  {milestone.milestoneCompleted ? (
                    <Badge className="w-fit mt-2 bg-green-500/10 text-green-600 border-green-500/20">
                      Completed
                    </Badge>
                  ) : (
                    <Button variant="outline" size="tiny" className="w-fit mt-2 text-xs" asChild>
                      <Link href={`/ambitions/${props.ambition.id}?mark_milestone_as_completed=${milestone.id}`} prefetch={true}>
                        <IconCheck className="text-green-500" />
                        Mark as Complete
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}
