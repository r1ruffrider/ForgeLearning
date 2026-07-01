/**
 * Subtle "forge ember" motif — a handful of slow-rising sparks. CSS-only
 * animation (see tailwind keyframe `ember-float`), auto-disabled by the global
 * prefers-reduced-motion rule. Purely decorative, hidden from assistive tech.
 */
const EMBERS = [
  { left: "12%", delay: "0s", duration: "9s", size: 3 },
  { left: "24%", delay: "3s", duration: "11s", size: 2 },
  { left: "38%", delay: "1.5s", duration: "8s", size: 4 },
  { left: "52%", delay: "5s", duration: "12s", size: 2 },
  { left: "66%", delay: "2.5s", duration: "10s", size: 3 },
  { left: "78%", delay: "6s", duration: "9s", size: 2 },
  { left: "88%", delay: "4s", duration: "11s", size: 3 },
];

export function Embers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-24 rounded-full bg-forge-gold/70 blur-[0.5px] [animation:ember-float_var(--dur)_ease-in_infinite]"
          style={
            {
              left: e.left,
              width: `${e.size}px`,
              height: `${e.size}px`,
              animationDelay: e.delay,
              ["--dur" as string]: e.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
