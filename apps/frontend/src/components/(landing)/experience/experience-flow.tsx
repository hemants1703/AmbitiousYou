"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon, BriefcaseIcon, ChartLineIcon, ChevronDownIcon, HeartIcon, PaletteIcon, RefreshCwIcon, RocketIcon, SchoolIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryCta from "@/components/(landing)/primary-cta";
import { brandCopy } from "@/lib/brand";
import { Eyebrow } from "@/components/(landing)/landing-section";
import DemoAmbitionShowcase from "./demo-ambition-showcase";
import { Persona, personas } from "./persona-data";
import PersonaSelector from "./persona-selector";
import { useDemoAmbition } from "./use-demo-ambition";

const iconComponents: Record<string, React.ElementType> = {
  briefcase: BriefcaseIcon,
  "graduation-cap": SchoolIcon,
  rocket: RocketIcon,
  heart: HeartIcon,
  refresh: RefreshCwIcon,
  palette: PaletteIcon,
  "chart-line": ChartLineIcon,
};

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export default function ExperienceFlow() {
  const { state, selectPersona, toggleItemComplete, calculateProgress } = useDemoAmbition();

  const [activeSection, setActiveSection] = useState<"hero" | "personas" | "showcase">("hero");
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Scroll to section when selected persona changes
  useEffect(() => {
    if (state.personaId && showcaseRef.current && activeSection === "personas") {
      setTimeout(() => {
        showcaseRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
        setActiveSection("showcase");
      }, 300);
    }
  }, [state.personaId, activeSection]);

  const handleSelectPersona = useCallback(
    (persona: Persona) => {
      const firstAmbition = persona.ambitions[0];
      if (firstAmbition) {
        selectPersona(persona.id, firstAmbition);
      }
    },
    [selectPersona],
  );

  const scrollToPersonas = useCallback(() => {
    const personaSection = document.getElementById("persona-section");
    personaSection?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    setActiveSection("personas");
  }, []);

  const selectedPersona = state.personaId ? personas.find((p) => p.id === state.personaId) : null;

  return (
    <div className="flex w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80svh] flex-col items-center justify-center px-4 pb-16 pt-8">
        {/* Local hero glow */}
        {/* <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80" style={{ background: "radial-gradient(32rem 14rem at 50% 0%, color-mix(in oklch, oklch(0.56 0.24 300) 9%, transparent) 0%, transparent 70%)" }} /> */}

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="lp-hero-enter flex justify-center">
            <Eyebrow>Interactive Experience</Eyebrow>
          </div>

          <h1 className="lp-hero-enter mt-5 bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text font-brand text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-balance text-transparent md:text-5xl lg:text-6xl">See Yourself in Action</h1>

          <p className="lp-hero-enter-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">Discover how AmbitiousYou transforms your goals into reality. Choose your journey, interact with real features, and create an ambition that&apos;s waiting for you.</p>

          {/* Persona spectrum — a preview of the choice below, not decoration */}
          <ul className="lp-hero-enter-3 mt-8 flex flex-wrap items-center justify-center gap-2">
            {personas.map((persona) => {
              const IconComponent = iconComponents[persona.icon] || RocketIcon;
              return (
                <li key={persona.id}>
                  <button type="button" onClick={scrollToPersonas} aria-label={`${persona.name} — jump to persona selection`} className="flex size-11 items-center justify-center rounded-xl border border-border/60 bg-card/50 transition-colors hover:border-primary/40 dark:hover:border-chart-1/40 hover:bg-card">
                    <IconComponent aria-hidden="true" className="size-5" style={{ color: persona.color }} />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="lp-hero-enter-3 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={scrollToPersonas} className="group h-12 px-8">
              Start Your Journey
              <ArrowRightIcon aria-hidden="true" className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <PrimaryCta loggedOutLabel={brandCopy.cta.join} loggedOutHref="/signup" size="lg" variant="outline" className="h-12 px-8" />
          </div>
        </div>

        {/* Scroll affordance */}
        <div className="lp-hero-enter-4 absolute bottom-8 left-1/2 -translate-x-1/2">
          <button type="button" onClick={scrollToPersonas} className="group flex flex-col items-center gap-2 p-2 text-muted-foreground transition-colors hover:text-foreground">
            <span className="text-xs font-medium">Explore below</span>
            <ChevronDownIcon aria-hidden="true" className="size-5 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </section>

      {/* Persona Selection Section */}
      <div id="persona-section" className="scroll-mt-24">
        <PersonaSelector selectedPersonaId={state.personaId} onSelectPersona={handleSelectPersona} />
      </div>

      {/* Showcase Section - Only visible when persona is selected */}
      {selectedPersona && state.ambition && (
        <div ref={showcaseRef} className="scroll-mt-24">
          <DemoAmbitionShowcase persona={selectedPersona} ambition={state.ambition} completedItems={state.completedItems} onToggleItem={toggleItemComplete} progress={calculateProgress()} />
        </div>
      )}

      {/* Final CTA Section */}
      <section className="w-full py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="lp-reveal relative overflow-hidden rounded-3xl border border-primary/20 dark:border-chart-1/20 bg-card/80 p-10 text-center shadow-xl backdrop-blur-sm">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 dark:via-chart-1/50 to-transparent" />

            <h2 className="font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">Ready to make it real?</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">Everything you just tried works exactly like this in the app — plus notes, insights, and a dashboard of your own. Your journey starts now.</p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PrimaryCta loggedOutLabel={brandCopy.cta.claimFirst} loggedOutHref="/signup" size="lg" className="h-12 px-10 shadow-lg shadow-primary/20" />
            </div>

            {/* Trust indicators */}
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {["No credit card required", "Free to use", "Set up in about a minute"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full bg-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
