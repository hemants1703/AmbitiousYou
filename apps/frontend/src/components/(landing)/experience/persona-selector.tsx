"use client";

import * as Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BriefcaseIcon, ChartLineIcon, ChevronRightIcon, HeartIcon, PaletteIcon, RefreshCwIcon, RocketIcon, SchoolIcon } from "lucide-react";
import { Eyebrow } from "@/components/(landing)/landing-section";
import { Persona, personas } from "./persona-data";

interface PersonaSelectorProps {
  selectedPersonaId: string | null;
  onSelectPersona: (persona: Persona) => void;
}

const iconComponents: Record<string, React.ElementType> = {
  briefcase: BriefcaseIcon,
  "graduation-cap": SchoolIcon,
  rocket: RocketIcon,
  heart: HeartIcon,
  refresh: RefreshCwIcon,
  palette: PaletteIcon,
  "chart-line": ChartLineIcon,
};

export default function PersonaSelector(props: PersonaSelectorProps) {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Section Header */}
        <div className="lp-reveal mx-auto mb-14 max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow>Find Your Journey</Eyebrow>
          </div>
          <h2 className="mt-4 font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">Which path resonates with you?</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">Select the journey that mirrors yours. See how AmbitiousYou transforms ambitions into achievements for people just like you.</p>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => {
            const IconComponent = iconComponents[persona.icon] || RocketIcon;
            const isSelected = props.selectedPersonaId === persona.id;

            return (
              <Card.Card
                key={persona.id}
                className={cn("lp-reveal group relative h-full overflow-hidden", "focus-within:ring-2 focus-within:ring-accent-brand/40", isSelected ? "shadow-elevated ring-2 ring-accent-brand shadow-accent-brand/20" : "hover:shadow-elevated hover:ring-1 hover:ring-accent-brand/30")}
                style={
                  {
                    "--persona-color": persona.color,
                  } as React.CSSProperties
                }>
                {/* Persona colour stripe */}
                <span aria-hidden="true" className="absolute bottom-5 left-0 top-5 w-0.5 rounded-full bg-(--persona-color)" />

                <Card.CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={cn("rounded-xl p-3 transition-colors duration-300", isSelected ? "bg-(--persona-color)/20" : "bg-muted group-hover:bg-(--persona-color)/10")}>
                      <IconComponent
                        aria-hidden="true"
                        className="size-6 transition-colors duration-300"
                        style={{
                          color: isSelected ? persona.color : undefined,
                        }}
                      />
                    </div>
                    {isSelected && <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">Selected</span>}
                  </div>
                  <Card.CardTitle className="mt-3 text-lg transition-colors group-hover:text-accent-brand">{persona.name}</Card.CardTitle>
                  <Card.CardDescription className="text-sm">{persona.tagline}</Card.CardDescription>
                </Card.CardHeader>

                <Card.CardContent className="pt-0">
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{persona.story}</p>
                </Card.CardContent>

                <Card.CardFooter className="pt-2">
                  {/* Stretched button — the whole card is one keyboard-reachable target */}
                  <button
                    type="button"
                    onClick={() => props.onSelectPersona(persona)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-center justify-center gap-1 rounded-md py-2 text-sm font-medium transition-colors",
                      "after:absolute after:inset-0 after:rounded-4xl",
                      isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                    )}>
                    {isSelected ? "Scroll down to see how it works" : "This is me"}
                    <ChevronRightIcon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Card.CardFooter>
              </Card.Card>
            );
          })}
        </div>

        {/* Hint text */}
        {!props.selectedPersonaId && <p className="mt-8 text-center text-sm text-muted-foreground">Select a path to load a real ambition.</p>}
      </div>
    </section>
  );
}
