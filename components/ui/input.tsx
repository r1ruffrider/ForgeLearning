import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-base text-foreground shadow-sm transition-colors",
          "placeholder:text-muted-foreground/70",
          "focus-visible:outline-none focus-visible:border-forge-blue focus-visible:ring-2 focus-visible:ring-forge-blue/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/60",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
