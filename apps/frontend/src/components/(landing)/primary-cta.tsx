"use client";

import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth-status";
import { brandCopy } from "@/lib/brand";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

interface PrimaryCtaProps {
  loggedOutLabel: string;
  loggedOutHref: string;
  icon?: ReactNode;
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
}

/**
 * A public signup-style CTA that swaps once the user is logged in:
 * - zero ambitions → initiation create
 * - has ambitions → dashboard
 * Logged-out copy is what static HTML / first paint render (SEO-safe).
 */
export default function PrimaryCta(props: PrimaryCtaProps) {
  const session = useAuthSession();

  let href = props.loggedOutHref;
  let label = props.loggedOutLabel;

  if (session.isLoggedIn) {
    if (session.hasAmbitions === false) {
      href = "/ambitions/create?initiation=1";
      label = brandCopy.cta.declareAmbition;
    } else {
      href = "/dashboard";
      label = brandCopy.cta.goDashboard;
    }
  }

  return (
    <Button asChild size={props.size} variant={props.variant} className={props.className}>
      {/* Only prefetch the public route; app routes render after the hint flips. */}
      <Link href={href} prefetch={session.isLoggedIn ? undefined : true} className="flex items-center gap-2">
        {label}
        {props.icon}
      </Link>
    </Button>
  );
}
