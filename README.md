# Forge Learning — Waitlist Landing Page

A lean, production-ready launch page for **Forge Learning**, the cross-platform
study platform for IT, cybersecurity, and professional certifications. Its only
jobs: explain the product, build trust, and capture waitlist emails.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui ·
Framer Motion · Supabase**. Deploys to **Vercel** with zero extra config.

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

The page works **out of the box with no environment variables** — waitlist
signups fall back to being logged by the `/api/waitlist` route (local-only
mode), so you can develop the full flow offline.

---

## Connecting Supabase (production capture)

Signups are stored in a Supabase table named `waitlist`:

| column       | type          | notes                          |
| ------------ | ------------- | ------------------------------ |
| `id`         | uuid          | auto (default)                 |
| `email`      | text          | unique, not-null               |
| `track`      | text          | nullable                       |
| `source`     | text          | default `'landing'`            |
| `created_at` | timestamptz   | default `now()`                |

Row Level Security is **on** with an **INSERT-only** policy for the `anon` role.

1. Copy the example env file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your project's values (Supabase dashboard → **Project Settings → API**):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-or-publishable-key>
   ```

   > Only the **anon / publishable** key is used. The `service_role` / secret
   > key is **never** referenced and must never be exposed to the browser.

3. Restart `npm run dev`. Inserts now go to the live table.

**Behavior notes**

- The insert happens **server-side** in `app/api/waitlist/route.ts`, so no
  Supabase logic ships to the browser beyond the public URL/anon key.
- A duplicate email (Postgres `23505` unique violation) is treated as
  **success** — the visitor sees the thank-you state, not an error.
- **Rate limiting** is best-effort, in-memory, per-IP (5 requests / minute) in
  the API route only. No Upstash, no extra env vars. It resets on redeploy and
  does not coordinate across serverless instances.
- A **honeypot** field (`company`) silently drops bot submissions.

---

## Editing copy, tracks & platform flags

**All marketing copy lives in one file:** [`content/site.ts`](content/site.ts).
You never need to touch component JSX to reword the page.

- **Copy** — hero, features, final CTA, thank-you state, footer: edit the
  strings under `site.hero`, `site.features`, `site.finalCta`, etc.
- **Tracks** — edit `site.tracks.items`. Set `status: "first"` for the launch
  track (renders the "Available first" badge); everything else shows
  "Coming soon". Add/remove/reorder freely.
- **Platform availability** — edit `site.platforms.items`. Each platform has a
  `live: boolean` flag. **Only set `live: true` for platforms that are actually
  live at launch.** Not-live platforms render a "Coming soon" label, and you can
  reword the band heading (e.g. "coming to iOS & Android") via
  `site.platforms.heading`.

---

## Project structure

```
app/
  layout.tsx           Root layout, fonts, metadata
  page.tsx             Page composition + skip link
  globals.css          Theme tokens & utilities
  api/waitlist/route.ts  Server-side capture, validation, rate limit, honeypot
components/
  header.tsx           Sticky header
  logo.tsx             Inline SVG wordmark
  embers.tsx           Decorative forge sparks (CSS)
  waitlist-form.tsx    Client form: validation, loading, thank-you state
  motion/reveal.tsx    Framer Motion scroll-reveal helpers
  sections/            hero, features, tracks, platforms, final-cta, footer
  ui/                  shadcn/ui primitives (button, input, label, select)
content/
  site.ts              ← SINGLE SOURCE OF TRUTH for all copy/config
lib/
  supabase.ts          Anon client factory + config detection
  validation.ts        Shared client/server email + track validation
  utils.ts             cn() helper
```

---

## Accessibility & performance

- Semantic HTML, labeled form fields, visible focus rings, skip link.
- Keyboard-navigable; honeypot hidden from assistive tech.
- WCAG 2.2 AA contrast (light text on dark navy; dark text on gold CTA).
- `prefers-reduced-motion` disables all animation.
- Optimized `next/font` (Inter, `display: swap`), inline SVG art (no image
  requests, no layout shift). Targets Lighthouse 95+.

---

## Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it in Vercel — the Next.js preset needs **no extra config**.
3. (Optional) Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   under **Project → Settings → Environment Variables** to enable live capture.
   Without them, the site still deploys and runs in local-only (logging) mode.
4. Deploy.

---

## Scripts

| command         | description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the dev server            |
| `npm run build` | Production build                |
| `npm run start` | Serve the production build      |
| `npm run lint`  | Run ESLint                      |
