"use client";

import Link from "next/link";
import { brandCopy } from "@/lib/brand";
import { useAuthSession } from "@/hooks/use-auth-status";

/**
 * Footer "Explore" list items that depend on auth: logged-out shows Login +
 * Sign Up, logged-in collapses to a single Dashboard link. Rendered inside the
 * footer's <ul>, so it returns <li> elements styled like its siblings. The
 * logged-out branch is what prerenders statically (SEO-safe — see useAuthHint).
 */
export default function FooterAuthLinks() {
  const session = useAuthSession();

  if (session.isLoggedIn) {
    const href = session.hasAmbitions === false ? "/ambitions/create?initiation=1" : "/dashboard";
    const label = session.hasAmbitions === false ? brandCopy.cta.declareAmbition : "Dashboard";

    return (
      <li>
        <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
          {label}
        </Link>
      </li>
    );
  }

  return (
    <>
      <li>
        <Link prefetch={true} href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
          Login
        </Link>
      </li>
      <li>
        <Link prefetch={true} href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
          {brandCopy.cta.join}
        </Link>
      </li>
    </>
  );
}
