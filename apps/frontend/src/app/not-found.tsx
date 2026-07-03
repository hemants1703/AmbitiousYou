import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import { ArrowLeftIcon, CompassIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createPrivateMetadata(
  "404: Page Not Found",
  "We couldn't find the page you were looking for. Maybe you took a wrong turn, or the page moved.",
);

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md border-0 bg-background">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <CompassIcon className="size-24 text-muted-foreground" aria-hidden />
          <CardTitle className="text-3xl font-bold">Hmm, Lost Together?</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Let&apos;s get you back on track!</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pb-6">
          <Button asChild size="lg" className="group w-full sm:w-auto">
            <Link prefetch={true} href="/" className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4 translate-x-0.5 group-hover:translate-x-0 transition-transform duration-200" /> Return to homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
