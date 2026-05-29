import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ambition } from "@ambitiousyou/shared/types";
import Link from "next/link";

type EditAmbitionDialogProps = {
  ambition: Ambition;
};

export default function EditAmbitionDialog(props: EditAmbitionDialogProps) {
  return (
    <Card className="border-dashed border-border/80 bg-background/90 lg:col-span-2">
      <CardHeader>
        <CardTitle>Edit ambition</CardTitle>
        <CardDescription>{props.ambition.ambitionName}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">The edit flow can be wired to the ambition update action next.</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/ambitions/${props.ambition.id}`}>Close</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
