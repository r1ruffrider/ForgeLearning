/**
 * ─────────────────────────────────────────────────────────────────────────
 * Forge Learning — SINGLE SOURCE OF TRUTH for all marketing copy & config.
 *
 * Edit wording, tracks, and platform-availability flags HERE.
 * Components read from this file, so you never need to touch JSX to change
 * copy. Keep claims honest: only mark a platform `live: true` when it's real.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const site = {
  brand: {
    name: "Forge Learning",
    wordmark: "Forge Learning",
    // The cert that launches first — surfaced in hero + thank-you copy.
    firstTrack: "Forge CISSP",
    contactEmail: "hello@forgelearning.app",
    domain: "forgelearning.app",
  },

  seo: {
    title: "Forge Learning — Forge your certification",
    description:
      "The cross-platform study platform for IT, cybersecurity, and professional certifications — with AI coaching, audio study mode, and real exam simulation. Join the waitlist.",
    // Used for OpenGraph / canonical. Update when the domain is final.
    url: "https://forgelearning.app",
  },

  header: {
    cta: "Join the waitlist",
  },

  hero: {
    eyebrow: "FORGE LEARNING",
    tagline: "Forge your certification.",
    descriptor:
      "The cross-platform study platform for IT, cybersecurity, and professional certifications — with AI coaching, audio study mode, and real exam simulation.",
    cta: "Join the waitlist",
    waitlistLine:
      "Be first to know when Forge CISSP goes live. No spam — just launch news.",
  },

  features: {
    heading: "What you get",
    subheading:
      "Everything built around one goal: walking into the exam ready.",
    items: [
      {
        icon: "brain",
        title: "AI Coach",
        tagline: "Understand the why.",
        body: "Get plain-English breakdowns of every answer — right and wrong — plus the mindset the exam is really testing.",
      },
      {
        icon: "headphones",
        title: "Audio Study Mode",
        tagline: "Study hands-free.",
        body: "Listen to questions and options on your commute. Tap play, learn anywhere.",
      },
      {
        icon: "timer",
        title: "Exam Simulation",
        tagline: "Train like it's test day.",
        body: "Timed and adaptive practice exams that mirror real conditions, so nothing surprises you.",
      },
      {
        icon: "chart",
        title: "Readiness Analytics",
        tagline: "Know when you're ready.",
        body: "Track performance by domain and watch your predicted pass probability climb.",
      },
    ],
  },

  tracks: {
    heading: "The Forge Learning family",
    subheading:
      "One platform, every credential you're chasing. CISSP leads the way — more tracks roll out after launch.",
    // `status: "first"` renders the "Available first" badge; everything else
    // shows "Coming soon". Reorder or edit freely.
    items: [
      { name: "CISSP", status: "first" },
      { name: "Security+", status: "soon" },
      { name: "CASP+", status: "soon" },
      { name: "CCSP", status: "soon" },
      { name: "CySA+", status: "soon" },
      { name: "PenTest+", status: "soon" },
      { name: "AWS", status: "soon" },
      { name: "Azure", status: "soon" },
      { name: "PMP", status: "soon" },
      { name: "ITIL", status: "soon" },
      { name: "Linux+", status: "soon" },
      { name: "DoD 8140", status: "soon" },
      { name: "Army Boards", status: "soon" },
      { name: "Leadership", status: "soon" },
    ] as const,
    labels: {
      first: "Available first",
      soon: "Coming soon",
    },
  },

  /**
   * Cross-platform reassurance band.
   * IMPORTANT: only set `live: true` for platforms that are ACTUALLY live at
   * launch. The heading is generated from these flags, and copy adapts:
   * live platforms are stated as available; others are phrased as "coming to".
   */
  platforms: {
    heading: "Built for web, iOS, and Android",
    body: "Start on your laptop, keep going on your phone. Your progress follows you everywhere.",
    items: [
      { name: "Web", icon: "globe", live: true },
      { name: "iOS", icon: "apple", live: false },
      { name: "Android", icon: "android", live: false },
    ],
    // Shown when a platform isn't live yet.
    comingSoonLabel: "Coming soon",
    liveLabel: "Available",
  },

  finalCta: {
    heading: "Start forging your edge.",
    subtext:
      "Join the waitlist and get early access when the first track launches.",
    cta: "Join the waitlist",
    reassurance: "One email at launch. Unsubscribe anytime.",
  },

  waitlistForm: {
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    trackLabel: "Which cert are you studying for?",
    trackPlaceholder: "Optional — pick a track",
    trackOptional: "Optional",
    submit: "Join the waitlist",
    submitting: "Joining…",
    // Client + server share these messages.
    errors: {
      emailRequired: "Please enter your email address.",
      emailInvalid: "That doesn't look like a valid email address.",
      generic: "Something went wrong. Please try again in a moment.",
    },
    thankYou: {
      heading: "You're on the list.",
      body: "We'll email you the moment Forge CISSP goes live — and let you know as more tracks roll out.",
    },
  },

  footer: {
    tagline: "Forge your certification.",
    copyright: `© ${new Date().getFullYear()} Forge Learning. All rights reserved.`,
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    contactLabel: "Contact",
  },
} as const;

export type TrackItem = (typeof site.tracks.items)[number];
export type Track = TrackItem["name"];

/** All track names, for the optional interest dropdown in the form. */
export const trackNames: readonly string[] = site.tracks.items.map(
  (t) => t.name
);

export type Site = typeof site;
