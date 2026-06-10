"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

interface HoverExpandButtonProps {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  disabled?: boolean;
}

/**
 * A compact icon button that smoothly expands to reveal its label on hover/focus,
 * then shrinks back. Used for the board's "Add move" and the notes "Add note" so
 * the headers stay uncluttered until intent. The label animates its own
 * max-width/opacity (a single, contained element) and the button is meant to sit
 * right-aligned in a justify-between header, so it grows into empty space without
 * reflowing the heading. Honors prefers-reduced-motion. The icon-only resting state
 * relies on `aria-label` (= label) for its accessible name.
 */
export function HoverExpandButton(props: HoverExpandButtonProps) {
  return (
    <Button type="button" variant={props.variant ?? "default"} disabled={props.disabled} onClick={props.onClick} aria-label={props.label} className={cn("w-fit gap-0", props.className)}>
      {props.icon ?? <PlusIcon className="size-4" />}
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 ease-out group-hover/button:ml-1.5 group-hover/button:max-w-32 group-hover/button:opacity-100 group-focus-visible/button:ml-1.5 group-focus-visible/button:max-w-32 group-focus-visible/button:opacity-100 motion-reduce:transition-none">
        {props.label}
      </span>
    </Button>
  );
}
