import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type DeleteAmbitionDialogProps = {
  ambitionId: string;
};

export function DeleteAmbitionDialog(props: DeleteAmbitionDialogProps) {
  return (
    <Card className="border-dashed border-destructive/40 bg-background/90 lg:col-span-2">
      <CardHeader>
        <CardTitle>Delete ambition</CardTitle>
        <CardDescription>This dialog is wired to the route state and can host the destructive action next.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-end gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/ambitions/${props.ambitionId}`}>Cancel</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
