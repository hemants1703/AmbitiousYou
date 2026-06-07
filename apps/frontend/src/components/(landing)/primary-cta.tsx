"use client";

import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/use-auth-status";
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
 * A public "Sign up"-style CTA that swaps to "Go to Dashboard" → /dashboard once
 * the user is logged in (detected client-side via the readable hint cookie). The
 * logged-out copy is what the static HTML / first paint render, so SEO and the
 * anonymous-visitor experience are unaffected.
 */
export default function PrimaryCta(props: PrimaryCtaProps) {
  const isLoggedIn = useAuthStatus();
  const href = isLoggedIn ? "/dashboard" : props.loggedOutHref;
  const label = isLoggedIn ? "Go to Dashboard" : props.loggedOutLabel;

  return (
    <Button asChild size={props.size} variant={props.variant} className={props.className}>
      {/* Only prefetch the public route; /dashboard renders only after the hint flips. */}
      <Link href={href} prefetch={isLoggedIn ? undefined : true} className="flex items-center gap-2">
        {label}
        {props.icon}
      </Link>
    </Button>
  );
}
