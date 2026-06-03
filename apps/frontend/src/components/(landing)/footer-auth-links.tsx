"use client";

import Link from "next/link";
import { useAuthHint } from "@/hooks/use-auth-hint";

/**
 * Footer "Explore" list items that depend on auth: logged-out shows Login +
 * Sign Up, logged-in collapses to a single Dashboard link. Rendered inside the
 * footer's <ul>, so it returns <li> elements styled like its siblings. The
 * logged-out branch is what prerenders statically (SEO-safe — see useAuthHint).
 */
export default function FooterAuthLinks() {
  const isLoggedIn = useAuthHint();

  if (isLoggedIn) {
    return (
      <li>
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
          Dashboard
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
          Sign Up
        </Link>
      </li>
    </>
  );
}
