import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import "@/styles/liquidGlassButton.css";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.99] active:translate-y-px active:brightness-70 hover:shadow-sm active:shadow-sm transition-all duration-75 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        ay: "ay-button-light relative text-foreground backdrop-blur-xl border border-foreground/[0.18] dark:border-foreground/[0.25] shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.08),0_12px_24px_-4px_rgba(0,0,0,0.06),inset_0_2px_4px_0_rgba(255,255,255,0.6),inset_0_-2px_4px_0_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.3)] dark:shadow-[0_1px_2px_0_rgba(0,0,0,0.3),0_4px_12px_-2px_rgba(0,0,0,0.4),0_12px_24px_-4px_rgba(0,0,0,0.3),inset_0_2px_4px_0_rgba(255,255,255,0.15),inset_0_-2px_4px_0_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:border-foreground/[0.28] dark:hover:border-foreground/[0.35] hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_6px_16px_-2px_rgba(0,0,0,0.12),0_16px_32px_-4px_rgba(0,0,0,0.1),inset_0_2px_4px_0_rgba(255,255,255,0.7),inset_0_-2px_4px_0_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.4)] dark:hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.4),0_6px_16px_-2px_rgba(0,0,0,0.5),0_16px_32px_-4px_rgba(0,0,0,0.4),inset_0_3px_6px_0_rgba(255,255,255,0.2),inset_0_-2px_4px_0_rgba(0,0,0,0.25),inset_0_0_0_1px_rgba(255,255,255,0.15)] active:scale-[0.98] active:shadow-[0_1px_2px_0_rgba(0,0,0,0.1),0_2px_8px_-1px_rgba(0,0,0,0.15),inset_0_2px_8px_0_rgba(0,0,0,0.2),inset_0_-1px_2px_0_rgba(255,255,255,0.4),inset_0_0_0_1px_rgba(255,255,255,0.2)] dark:active:shadow-[0_1px_2px_0_rgba(0,0,0,0.5),0_2px_8px_-1px_rgba(0,0,0,0.6),inset_0_2px_8px_0_rgba(0,0,0,0.4),inset_0_-1px_2px_0_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-200 ease-out",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        tiny: "py-0 px-2 h-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
