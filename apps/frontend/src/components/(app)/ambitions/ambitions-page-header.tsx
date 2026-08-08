import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";

/** Static chrome for /ambitions — safe to render before ambitions load. */
export function AmbitionsPageHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
        <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
      </div>
      <Button asChild size="sm" className="w-full md:w-auto">
        <Link href="/ambitions/create" className="flex items-center justify-center gap-1 md:ml-0">
          <PlusCircleIcon className="h-4 w-4" />
          Create New Ambition
        </Link>
      </Button>
    </div>
  );
}
