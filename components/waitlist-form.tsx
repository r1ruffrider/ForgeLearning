"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

import { site } from "@/content/site";
import { isValidEmail } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const copy = site.waitlistForm;

type Status = "idle" | "submitting" | "success" | "error";

type WaitlistFormProps = {
  /** Distinguishes hero vs. final-CTA submissions in the DB `source` column. */
  source: string;
  className?: string;
  /** Unique id prefix so multiple forms on the page keep valid label/for pairs. */
  idPrefix: string;
};

export function WaitlistForm({ source, className, idPrefix }: WaitlistFormProps) {
  const reduce = useReducedMotion();
  const [email, setEmail] = React.useState("");
  const [track, setTrack] = React.useState<string>("");
  const [company, setCompany] = React.useState(""); // honeypot
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const emailId = `${idPrefix}-email`;
  const trackId = `${idPrefix}-track`;
  const errorId = `${idPrefix}-email-error`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return; // prevent double-submit

    // Client-side validation with friendly inline error.
    if (!email.trim()) {
      setError(copy.errors.emailRequired);
      return;
    }
    if (!isValidEmail(email)) {
      setError(copy.errors.emailInvalid);
      return;
    }

    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          track: track || null,
          source,
          company, // honeypot — should be empty
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }

      setStatus("error");
      setError(data.error ?? copy.errors.generic);
    } catch {
      setStatus("error");
      setError(copy.errors.generic);
    }
  }

  if (status === "success") {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center",
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forge-gold/15 ring-1 ring-forge-gold/40">
          <CheckCircle2 className="h-6 w-6 text-forge-gold" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">
          {copy.thankYou.heading}
        </h3>
        <p className="max-w-sm text-muted-foreground">{copy.thankYou.body}</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("w-full", className)}
      aria-describedby={error ? errorId : undefined}
    >
      <div className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5 text-left">
          <Label htmlFor={emailId}>{copy.emailLabel}</Label>
          <Input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
              if (status === "error") setStatus("idle");
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            disabled={status === "submitting"}
          />
        </div>

        {/* Optional track */}
        <div className="flex flex-col gap-1.5 text-left">
          <Label htmlFor={trackId} className="flex items-center gap-2">
            {copy.trackLabel}
            <span className="text-xs font-normal text-muted-foreground">
              ({copy.trackOptional})
            </span>
          </Label>
          <Select value={track} onValueChange={setTrack}>
            <SelectTrigger id={trackId} aria-label={copy.trackLabel}>
              <SelectValue placeholder={copy.trackPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {site.tracks.items.map((t) => (
                <SelectItem key={t.name} value={t.name}>
                  {t.name}
                  {t.status === "first" ? "  ·  Available first" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Honeypot — visually hidden, off-screen, not announced. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor={`${idPrefix}-company`}>Company</label>
          <input
            id={`${idPrefix}-company`}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        {/* Inline error */}
        {error && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              {copy.submitting}
            </>
          ) : (
            copy.submit
          )}
        </Button>
      </div>
    </form>
  );
}
