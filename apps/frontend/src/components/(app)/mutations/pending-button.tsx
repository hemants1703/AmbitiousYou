"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type ButtonComponentProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export interface PendingButtonProps extends ButtonComponentProps {
  isPending: boolean;
  children: ReactNode;
}

/**
 * Loading button per AGENTS.md: spinner + original label while pending.
 */
export function PendingButton(props: PendingButtonProps) {
  const { isPending, children, disabled, className, variant, size, ...rest } = props;

  return (
    <Button disabled={disabled || isPending} className={cn(className)} variant={variant} size={size} {...rest}>
      {isPending ? <Loader2Icon className="size-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </Button>
  );
}
