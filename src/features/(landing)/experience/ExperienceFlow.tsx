"use client";

import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconBriefcase,
  IconChartLine,
  IconChevronDown,
  IconHeart,
  IconPalette,
  IconRefresh,
  IconRocket,
  IconSchool,
  IconSparkles,
} from "@tabler/icons-react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import DemoAmbitionShowcase from "./DemoAmbitionShowcase";
import { Persona, personas } from "./personaData";
import PersonaSelector from "./PersonaSelector";
import { useDemoAmbition } from "./useDemoAmbition";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const iconComponents: Record<string, React.ElementType> = {
  briefcase: IconBriefcase,
  "graduation-cap": IconSchool,
  rocket: IconRocket,
  heart: IconHeart,
  refresh: IconRefresh,
  palette: IconPalette,
  "chart-line": IconChartLine,
};

export default function ExperienceFlow() {
  const { state, isLoaded, selectPersona, toggleItemComplete, calculateProgress } =
    useDemoAmbition();

  const [activeSection, setActiveSection] = useState<"hero" | "personas" | "showcase">("hero");
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Scroll to section when selected persona changes
  useEffect(() => {
    if (state.personaId && showcaseRef.current && activeSection === "personas") {
      setTimeout(() => {
        showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    [selectPersona]
  );

  const scrollToPersonas = useCallback(() => {
    const personaSection = document.getElementById("persona-section");
    personaSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection("personas");
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20" />
          <p className="text-sm text-muted-foreground">Loading experience...</p>
        </div>
      </div>
    );
  }

  const selectedPersona = state.personaId ? personas.find((p) => p.id === state.personaId) : null;

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 pt-8 pb-16">
        {/* Animated persona icons floating in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {personas.slice(0, 5).map((persona, index) => {
            const IconComponent = iconComponents[persona.icon] || IconRocket;
            return (
              <MotionWrapper
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  delay: index * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute"
                style={{
                  left: `${15 + index * 18}%`,
                  top: `${20 + (index % 3) * 25}%`,
                }}
              >
                <IconComponent
                  className="h-8 w-8 md:h-12 md:w-12"
                  style={{ color: persona.color }}
                />
              </MotionWrapper>
            );
          })}
        </div>

        <MotionWrapper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-primary/5 border border-primary/10 rounded-full">
            <IconSparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Interactive Experience</span>
          </div>

          <h1
            className={cn(
              bricolage.className,
              "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6",
              "bg-clip-text text-transparent bg-linear-to-r from-foreground via-foreground to-foreground/70"
            )}
          >
            See Yourself in Action
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover how AmbitiousYou transforms your goals into reality. Choose your journey,
            interact with real features, and create an ambition that's waiting for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="ay"
              size="lg"
              onClick={scrollToPersonas}
              className="text-lg h-12 px-8 group"
            >
              Start Your Journey
              <IconArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ay-secondary" size="lg" asChild className="text-lg h-12 px-8">
              <Link href="/signup">Skip to Sign Up</Link>
            </Button>
          </div>
        </MotionWrapper>

        {/* Scroll indicator */}
        <MotionWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            onClick={scrollToPersonas}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-xs font-medium">Explore below</span>
            <MotionWrapper
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <IconChevronDown className="h-5 w-5" />
            </MotionWrapper>
          </button>
        </MotionWrapper>
      </section>

      {/* Persona Selection Section */}
      <div id="persona-section">
        <PersonaSelector
          selectedPersonaId={state.personaId}
          onSelectPersona={handleSelectPersona}
        />
      </div>

      {/* Showcase Section - Only visible when persona is selected */}
      {selectedPersona && state.ambition && (
        <div ref={showcaseRef}>
          <DemoAmbitionShowcase
            persona={selectedPersona}
            ambition={state.ambition}
            completedItems={state.completedItems}
            onToggleItem={toggleItemComplete}
            progress={calculateProgress()}
          />
        </div>
      )}

      {/* Final CTA Section */}
      <section className="w-full py-16 md:py-24 bg-linear-to-t from-muted/50 to-transparent">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={cn(
                bricolage.className,
                "text-3xl md:text-4xl font-bold tracking-tight mb-4"
              )}
            >
              Ready to make it real?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of ambitious people who are already achieving their goals with
              AmbitiousYou. Your journey starts now.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="ay"
                size="lg"
                asChild
                className="text-lg h-12 px-10 shadow-lg shadow-primary/20"
              >
                <Link href="/signup">
                  <IconRocket className="mr-2 h-5 w-5" />
                  Get Started Free
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>
    </div>
  );
}
