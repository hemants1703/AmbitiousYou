"use client";

import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconBriefcase,
  IconChartLine,
  IconChevronRight,
  IconHeart,
  IconPalette,
  IconRefresh,
  IconRocket,
  IconSchool,
} from "@tabler/icons-react";
import { Persona, personas } from "./personaData";

interface PersonaSelectorProps {
  selectedPersonaId: string | null;
  onSelectPersona: (persona: Persona) => void;
}

const iconComponents: Record<string, React.ElementType> = {
  briefcase: IconBriefcase,
  "graduation-cap": IconSchool,
  rocket: IconRocket,
  heart: IconHeart,
  refresh: IconRefresh,
  palette: IconPalette,
  "chart-line": IconChartLine,
};

export default function PersonaSelector({
  selectedPersonaId,
  onSelectPersona,
}: PersonaSelectorProps) {
  return (
    <section className="w-full py-16 md:py-24">
      <div className=" px-4 md:px-6 max-w-6xl mx-auto">
        {/* Section Header */}
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Find Your Journey
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Which path resonates with you?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the journey that mirrors yours. See how AmbitiousYou transforms ambitions into
            achievements for people just like you.
          </p>
        </MotionWrapper>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona, index) => {
            const IconComponent = iconComponents[persona.icon] || IconRocket;
            const isSelected = selectedPersonaId === persona.id;

            return (
              <MotionWrapper
                key={persona.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <Card.Card
                  className={cn(
                    "group relative cursor-pointer transition-all duration-300 overflow-hidden h-full",
                    "hover:shadow-lg hover:-translate-y-1",
                    isSelected
                      ? "ring-2 ring-primary shadow-lg shadow-primary/20"
                      : "hover:ring-1 hover:ring-primary/30"
                  )}
                  onClick={() => onSelectPersona(persona)}
                  style={
                    {
                      "--persona-color": persona.color,
                    } as React.CSSProperties
                  }
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 transition-opacity duration-500",
                      "bg-linear-to-br from-transparent via-transparent to-(--persona-color)",
                      isSelected ? "opacity-15" : "group-hover:opacity-10"
                    )}
                  />

                  <Card.CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "p-3 rounded-xl transition-all duration-300",
                          isSelected
                            ? "bg-(--persona-color)/20"
                            : "bg-muted group-hover:bg-(--persona-color)/10"
                        )}
                      >
                        <IconComponent
                          className="h-6 w-6 transition-colors duration-300"
                          style={{
                            color: isSelected ? persona.color : undefined,
                          }}
                        />
                      </div>
                      {isSelected && (
                        <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <Card.CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                      {persona.name}
                    </Card.CardTitle>
                    <Card.CardDescription className="text-sm">
                      {persona.tagline}
                    </Card.CardDescription>
                  </Card.CardHeader>

                  <Card.CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {persona.story}
                    </p>
                  </Card.CardContent>

                  <Card.CardFooter className="pt-2">
                    <Button
                      variant={isSelected ? "outline" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full group/btn transition-all",
                        !isSelected && "hover:bg-primary/5"
                      )}
                    >
                      {isSelected ? "Scroll down to see how it works" : "This is me"}
                      <IconChevronRight
                        className={cn(
                          "ml-1 h-4 w-4 transition-transform",
                          "group-hover/btn:translate-x-1"
                        )}
                      />
                    </Button>
                  </Card.CardFooter>
                </Card.Card>
              </MotionWrapper>
            );
          })}
        </div>

        {/* Hint text */}
        {!selectedPersonaId && (
          <MotionWrapper
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">👆</span>
                Select a persona to see a real ambition in action
              </span>
            </p>
          </MotionWrapper>
        )}
      </div>
    </section>
  );
}
