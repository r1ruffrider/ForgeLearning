import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Gold primary CTA — dark navy text for AA contrast on gold.
        gold: "bg-forge-gold text-forge-navy shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_hsl(var(--forge-gold)/0.55)] hover:bg-forge-gold-soft hover:-translate-y-0.5 active:translate-y-0",
        blue: "bg-forge-blue text-white hover:bg-forge-blue-soft hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-white/15 bg-white/5 text-foreground backdrop-blur hover:bg-white/10 hover:border-white/25",
        ghost: "text-foreground hover:bg-white/5",
        link: "text-forge-blue-soft underline-offset-4 hover:underline",
      },
      size: {
        // Min 44px height for touch targets.
        default: "h-11 px-6 py-2",
        lg: "h-12 px-8 text-base",
        sm: "h-11 px-4",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
