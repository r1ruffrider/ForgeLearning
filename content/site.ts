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
    contactEmail: "info@inspirebusinesstechnology.com",
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

  /**
   * Legal pages (/privacy, /terms). Plain-English placeholder copy — edit here,
   * no need to touch the page components. `{contactEmail}` and `{updated}`
   * tokens are substituted at render time from brand.contactEmail and the
   * `updated` date below. Keep it honest: if you add analytics, payments, or
   * accounts later, update the privacy copy to match.
   */
  legal: {
    // Bump when you change the wording. Rendered as the "Last updated" date.
    updated: "July 2, 2026",

    privacy: {
      title: "Privacy Policy",
      intro:
        "Forge Learning is not live yet. Right now this site does one thing: it lets you join a waitlist so we can tell you when we launch. This notice explains what we collect and why, in plain English.",
      sections: [
        {
          heading: "What we collect",
          body: [
            "When you join the waitlist we store only: your email address, the certification track you optionally select, a short source tag noting where the signup came from, and the timestamp of your signup.",
            "That's it. There are no accounts, no passwords, no payments, and no analytics or advertising cookies. We don't track your browsing.",
          ],
        },
        {
          heading: "Why we collect it",
          body: [
            "We use your email for one purpose: to notify you when Forge Learning launches — starting with Forge CISSP — and, if you opted into a track, to tell you when that track is available. Expect roughly one email at launch. You can unsubscribe at any time.",
          ],
        },
        {
          heading: "Where it's stored",
          body: [
            "Your signup is stored in a database hosted by Supabase, and this site is hosted by Vercel. Both act as processors on our behalf. We don't send your information anywhere else.",
          ],
        },
        {
          heading: "We don't sell or share your data",
          body: [
            "We do not sell, rent, or share your email or any other information for marketing. Ever.",
          ],
        },
        {
          heading: "Removing your data",
          body: [
            "Want off the list? Email us at {contactEmail} and we'll delete your entry from the waitlist. No hoops.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "Questions about this notice? Reach us at {contactEmail}.",
          ],
        },
      ],
    },

    terms: {
      title: "Terms of Use",
      intro:
        "These are interim terms for the Forge Learning waitlist landing page. They'll be expanded into full terms of service when the product launches.",
      sections: [
        {
          heading: "As-is",
          body: [
            "This site is provided on an \"as-is\" and \"as-available\" basis, without warranties of any kind. We may change, pause, or take it down at any time.",
          ],
        },
        {
          heading: "The waitlist isn't a purchase",
          body: [
            "Joining the waitlist is free and does not create an account, a contract, or a purchase. It is not a guarantee of access, pricing, availability, or a launch date. It simply means we'll email you news about Forge Learning.",
          ],
        },
        {
          heading: "Changes to these terms",
          body: [
            "We'll publish complete terms of service when Forge Learning becomes available. Until then, these interim terms apply to your use of this site.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "Questions? Email us at {contactEmail}.",
          ],
        },
      ],
    },
  },
} as const;

export type TrackItem = (typeof site.tracks.items)[number];
export type Track = TrackItem["name"];

/** All track names, for the optional interest dropdown in the form. */
export const trackNames: readonly string[] = site.tracks.items.map(
  (t) => t.name
);

export type Site = typeof site;
