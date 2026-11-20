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
      "Study platform for IT, cybersecurity and professional certifications: AI coaching, audio study mode and real exam simulation. CISSP first.",
    // Used for OpenGraph / canonical. Update when the domain is final.
    url: "https://forgelearning.app",
  },

  header: {
    cta: "Join the waitlist",
  },

  /** Sign-in entry point for the Forge web app (secondary to the waitlist). */
  app: {
    url: "https://app.forgelearning.app",
    loginLabel: "Log in",
    footerPrompt: "Already have access?",
    footerLoginLabel: "Log in to the app",
  },

  hero: {
    eyebrow: "Forge CISSP · Available first",
    tagline: "Forge your certification.",
    descriptor:
      "The cross-platform study platform for IT, cybersecurity, and professional certifications — with AI coaching, audio study mode, and real exam simulation.",
    cta: "Join the waitlist",
    waitlistLine:
      "Join the waitlist for Forge Learning product news. No spam.",
    // "At a glance" spec panel — every value here is restated from this file.
    panel: {
      label: "Forge CISSP at a glance",
      status: "Available first",
      modesLabel: "Study modes",
      platformsLabel: "Platforms",
      nextLabel: "Next tracks",
    },
  },

  features: {
    heading: "What you get",
    // Short verbs for the drawn study flow (one per feature, same order).
    flowLabel: "How a study session flows",
    subheading:
      "Everything built around one goal: walking into the exam ready.",
    items: [
      {
        icon: "brain",
        title: "AI Coach",
        step: "Understand",
        tagline: "Understand the why.",
        body: "Get plain-English breakdowns of every answer — right and wrong — plus the mindset the exam is really testing.",
      },
      {
        icon: "headphones",
        title: "Audio Study Mode",
        step: "Listen",
        tagline: "Study hands-free.",
        body: "Listen to questions and options on your commute. Tap play, learn anywhere.",
      },
      {
        icon: "timer",
        title: "Exam Simulation",
        step: "Practice",
        tagline: "Train like it's test day.",
        body: "Timed and adaptive practice exams that mirror real conditions, so nothing surprises you.",
      },
      {
        icon: "chart",
        title: "Readiness Analytics",
        step: "Track",
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

  midCta: {
    // Echoes features.subheading ("walking into the exam ready").
    line: "Walk into the exam ready.",
    cta: "Join the waitlist",
  },

  /**
   * FAQ — assembled ONLY from statements already published on this site
   * (hero, tracks, platforms, final CTA, /privacy, /terms). Don't add claims here
   * that aren't on the page or in the legal copy. Also feeds FAQPage JSON-LD.
   */
  faq: {
    heading: "Questions",
    items: [
      {
        q: "Which certification launches first?",
        a: "Forge CISSP. More tracks roll out after launch: Security+, CASP+, CCSP, CySA+, PenTest+, AWS, Azure, PMP, ITIL and Linux+.",
      },
      {
        q: "Where can I study?",
        a: "Start on your laptop, keep going on your phone. Web is available; iOS and Android are coming soon.",
      },
      {
        q: "Is joining the waitlist a purchase?",
        a: "No. Joining the waitlist is free and does not create an account, a contract, or a purchase. It is not a guarantee of access, pricing, availability, or a launch date.",
      },
      {
        q: "How do I get off the list?",
        a: "Email us at {contactEmail} and we'll delete your entry from the waitlist within 10 business days of your request.",
      },
    ],
  },

  finalCta: {
    heading: "Start forging your edge.",
    subtext:
      "Join the waitlist for news on Forge CISSP and the tracks that follow.",
    cta: "Join the waitlist",
    reassurance: "Occasional product news. Email us anytime to be removed.",
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
      body: "We'll send you Forge Learning product news. To be removed, just email us.",
    },
  },

  footer: {
    tagline: "Forge your certification.",
    copyright: `© ${new Date().getFullYear()} Forge Learning · Inspire\u00A0Business\u00A0Group\u00A0LLC. All rights reserved.`,
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
    updated: "[DATE OF PUBLICATION]",

    privacy: {
      title: "Privacy Policy",
      intro:
        "This notice covers this website, forgelearning.app, where you can join a waitlist for product news about Forge Learning. It explains what we collect when you join and why, in plain English. The Forge Learning web app at https://app.forgelearning.app uses accounts and has its own Privacy Policy; see \"Forge Learning app accounts\" below.",
      sections: [
        {
          heading: "What we collect",
          body: [
            "When you join the waitlist we store: your email address, the certification track you optionally select, a short source tag noting where the signup came from, and the timestamp of your signup.",
            "To apply a rate limit, the waitlist server receives your IP address as Vercel reports it, and the database function uses it to update a rate-limit counter under a hashed visitor key. The waitlist row itself does not store your IP. A hashed visitor key (not your raw IP on the waitlist row) is stored in a counter table and opportunistically deleted after two days. The limits are five attempts per minute per visitor and a global backstop of 1,000 per hour. Vercel, which hosts the sites, may process IP addresses at the infrastructure level. This policy does not claim that production infrastructure logs never record a raw IP.",
            "This website has no accounts, no passwords, and no payments, and it uses no analytics or advertising cookies. We don't track your browsing on this website. Joining the waitlist does not create a Forge Learning app account.",
          ],
        },
        {
          heading: "Why we collect it",
          body: [
            "We use your waitlist email to send you product news about Forge Learning — including Forge CISSP and, if you selected a track, news about that track. Joining is not a promise of a launch date, of access, or of a set number of emails. To come off the list, email us at {contactEmail}. This is removal on request by email; it is not a one-click unsubscribe. We will remove you within 10 business days of the email request.",
          ],
        },
        {
          heading: "Where it's stored",
          body: [
            "Your waitlist signup is stored in a database hosted by Supabase, and this site is hosted by Vercel. Both act as processors on our behalf. We don't send your waitlist information anywhere else.",
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
            "Want off the list? Email us at {contactEmail} and we'll delete your entry from the waitlist within 10 business days of your request.",
            "Your waitlist entry and a Forge Learning app account are separate. Removing your waitlist entry does not delete an app account, and deleting an app account does not remove you from the waitlist.",
          ],
        },
        {
          heading: "Forge Learning app accounts",
          body: [
            "The Forge Learning web app at https://app.forgelearning.app uses accounts. You sign in to the app with an email address and password, or with \"Continue with Google\". This website does not create or manage app accounts.",
            "Your app account and the data in it are covered by the app's own Privacy Policy at https://app.forgelearning.app/privacy, not by this notice. That policy explains what the app collects, the cookies it uses to keep you signed in, the service providers it uses, and your choices.",
            "To delete an app account, see https://app.forgelearning.app/account-deletion.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "Questions about this notice? Reach us at {contactEmail}.",
            "Forge Learning is operated by Inspire Business Group LLC.",
          ],
        },
      ],
    },

    terms: {
      title: "Terms of Use",
      intro:
        "These terms cover this website, forgelearning.app, and its waitlist. The Forge Learning web app at https://app.forgelearning.app has its own terms, which apply to app accounts.",
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
            "We will update the \"Last updated\" date on this page whenever these terms change. For material changes, we will make a reasonable effort to notify you before the change takes effect, with a notice in the app or on the site.",
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
