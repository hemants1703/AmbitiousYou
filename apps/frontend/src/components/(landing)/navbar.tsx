"use client";

import { ChevronRightIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ThemeToggle } from "../theme-toggle";
import AmbitiousYouLogo from "./ambitiousyou-logo";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/experience", label: "Experience" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pagePathname = usePathname();
  const isLoggedIn = useAuthStatus();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn("fixed left-0 right-0 top-0 z-50 w-full py-4 transition-colors duration-300", scrolled ? "border-b border-border/40 bg-background/50 backdrop-blur-sm" : "border-b border-transparent")}>
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link prefetch={true} href="/">
          <AmbitiousYouLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pagePathname === link.href || (link.href !== "/" && pagePathname?.startsWith(link.href));

              return (
                <Link prefetch={true} key={link.href} href={link.href} className={cn("relative px-1 py-2 text-sm font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {link.label}
                  {isActive && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary dark:bg-chart-1" />}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Reserve the logged-out width (justify-end) so the post-hydration swap to a single button doesn't shift the nav links (CLS). */}
            <div className="flex min-w-44 items-center justify-end gap-3">
              {isLoggedIn ? (
                <Button size="sm" className="h-9 px-4 shadow-sm" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="h-9 px-4" asChild>
                    <Link prefetch={true} href="/login">
                      Log in
                    </Link>
                  </Button>
                  <Button size="sm" className="h-9 px-4 shadow-sm" asChild>
                    <Link prefetch={true} href="/signup">
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu — Sheet handles focus trap, Escape, and scroll lock */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="size-11">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-5/6 flex-col">
              <SheetHeader>
                <SheetTitle className="font-brand">Menu</SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto overscroll-contain px-6">
                <ul>
                  {navLinks.map((link) => {
                    const isActive = pagePathname === link.href || (link.href !== "/" && pagePathname?.startsWith(link.href));

                    return (
                      <li key={link.href}>
                        <SheetClose asChild>
                          <Link prefetch={true} href={link.href} className={cn("flex items-center justify-between border-b border-border py-3 text-base", isActive ? "font-medium text-primary dark:text-chart-1" : "text-foreground")}>
                            <span>{link.label}</span>
                            <ChevronRightIcon aria-hidden="true" className="size-5 opacity-70" />
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <SheetFooter>
                <div className="flex items-center justify-between rounded-3xl border border-border/60 bg-background/70 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>

                {isLoggedIn ? (
                  <SheetClose asChild>
                    <Button className="w-full" asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full" asChild>
                        <Link prefetch={true} href="/login">
                          Log in
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="w-full" asChild>
                        <Link prefetch={true} href="/signup">
                          Sign up
                        </Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
