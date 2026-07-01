"use client";

import * as React from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <a
          href="#top"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`${site.brand.name} — home`}
        >
          <Logo />
        </a>

        <Button asChild variant="gold" size="sm">
          <a href="#waitlist">{site.header.cta}</a>
        </Button>
      </div>
    </header>
  );
}
