"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { DialogStateProps } from "./ambition-options-dropdown";

type EditAmbitionDialogProps = {
  ambitionId: string;
  toggleEditDialog: (state: DialogStateProps | undefined) => void;
};

export default function EditAmbitionDialog(props: EditAmbitionDialogProps) {
  return (
    <Card className="border-dashed border-border/80 bg-background/90 lg:col-span-2">
      <CardHeader>
        <CardTitle>Edit ambition</CardTitle>
        <CardDescription>You will be redirected to the edit page for this ambition.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">The edit flow can be wired to the ambition update action next.</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/ambitions/${props.ambitionId}/edit`}>Close</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
