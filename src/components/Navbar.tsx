"use client";

import { useState, useRef, useEffect } from "react";
import { ThemeToggler } from "./ThemeToggler";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import AmbitiousYouLogo from "./AmbitiousYouLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
];

interface NavbarProps {
  userLoggedIn: boolean;
}

export default function Navbar(props: NavbarProps) {
  const [navbarToggled, setNavbarToggled] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarMenuRef = useRef<HTMLDivElement | null>(null);
  const pagePathname = usePathname();

  console.log("Logged In user: ", props.userLoggedIn);

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        navbarMenuRef.current &&
        !navbarMenuRef.current.contains(target) &&
        !target.closest("button")
      ) {
        setNavbarToggled(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navbarMenuRef]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (navbarToggled) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Restore the scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    return () => {
      // Cleanup
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [navbarToggled]);

  function toggleNavbar() {
    setNavbarToggled(!navbarToggled);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "p-4 bg-background/0 backdrop-blur-lg shadow-sm" : "py-4"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between max-sm:z-50">
        {/* Logo */}
        <Link
          prefetch={true}
          href="/"
          onClick={() => {
            if (navbarToggled) toggleNavbar();
          }}
          className="z-50"
        >
          <AmbitiousYouLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                pagePathname === link.href ||
                (link.href !== "/" && pagePathname?.startsWith(link.href));

              return (
                <Link
                  prefetch={true}
                  key={link.href}
                  href={link.href}
                  className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggler />
            {props.userLoggedIn ? (
              <Button variant="ay" asChild>
                <Link prefetch={true} href="/dashboard">
                  Dashboard
                </Link>
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

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden max-sm:z-50">
          <ThemeToggler />
          <button
            onClick={toggleNavbar}
            className="relative w-10 h-10 flex items-center justify-center rounded-md focus:outline-none z-50"
            aria-label="Toggle Menu"
          >
            <div className="absolute inset-0 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors"></div>
            <div className="flex flex-col justify-center items-center w-6 h-6">
              <span
                className={`bg-foreground block h-0.5 w-6 rounded-sm transition-all duration-300 absolute ${
                  navbarToggled ? "rotate-45" : "-translate-y-2"
                }`}
              />
              <span
                className={`bg-foreground block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                  navbarToggled ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`bg-foreground block h-0.5 w-6 rounded-sm transition-all duration-300 absolute ${
                  navbarToggled ? "-rotate-45" : "translate-y-2"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={navbarMenuRef}
        className={`fixed inset-0 top-0 left-0 w-full h-full bg-background/95 backdrop-blur-md md:hidden transition-all duration-300 ${
          navbarToggled
            ? "opacity-100 pointer-events-auto z-40"
            : "opacity-0 pointer-events-none z-0"
        }`}
      >
        <div className="flex flex-col h-full justify-between px-6 pt-24 pb-10 overflow-auto">
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">NAVIGATION</p>
            {navLinks.map((link, index) => {
              const isActive =
                pagePathname === link.href ||
                (link.href !== "/" && pagePathname?.startsWith(link.href));

              return (
                <div
                  key={link.href}
                  className={`transform transition-transform duration-300 delay-${index * 100} ${
                    navbarToggled ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <Link
                    prefetch={true}
                    href={link.href}
                    onClick={toggleNavbar}
                    className={`flex items-center justify-between py-3 border-b border-border ${
                      isActive ? "text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRightIcon className="h-5 w-5 opacity-70" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 mt-auto">
            <div
              className={`transition-all duration-300 delay-300 ${
                navbarToggled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Button variant="outline" className="w-full" asChild>
                <Link prefetch={true} href="/login" onClick={toggleNavbar}>
                  Log in
                </Link>
              </Button>
            </div>

            <div
              className={`transition-all duration-300 delay-400 ${
                navbarToggled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Button className="w-full" asChild>
                <Link prefetch={true} href="/signup" onClick={toggleNavbar}>
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
