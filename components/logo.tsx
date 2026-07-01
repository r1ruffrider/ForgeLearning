import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/**
 * Forge wordmark with a minimal spark/anvil mark. Pure inline SVG — no image
 * request, no layout shift.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* anvil-inspired mark with an ember spark */}
        <path
          d="M4 15h12a4 4 0 0 0 4-4V8"
          stroke="hsl(var(--forge-blue))"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M6 15v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3"
          stroke="hsl(var(--forge-blue-soft))"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="20.5" cy="6" r="2.5" fill="hsl(var(--forge-gold))" />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight text-foreground">
        {site.brand.wordmark}
      </span>
    </span>
  );
}
