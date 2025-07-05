"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex justify-center"
      >
        <Card className="w-full max-w-md shadow-lg border-0 bg-card">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <Compass className="h-12 w-12 text-primary/80" />
            </div>
            <CardTitle className="text-3xl font-bold text-center">Hmm, Lost Together?</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              We couldn&apos;t find the page you were looking for.
              <br />
              Maybe you took a wrong turn, or the page moved.
            </p>
            <p className="text-sm text-muted-foreground">Let&apos;s get you back on track!</p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pb-6">
            <Button asChild size="lg" className="px-8 w-full sm:w-auto">
              <Link prefetch={true} href="/ambitions" className="flex items-center gap-2">
                <span>See all your ambitions</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <Link prefetch={true} href="/dashboard" className="flex items-center gap-2">
                <span>Dashboard</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
