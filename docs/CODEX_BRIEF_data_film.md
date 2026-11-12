# Codex brief — port the "data film" prototype to the live landing page

## GROUND TRUTH
- artifact: `docs/prototype/data-film.html` on branch `redesign/data-film` (untracked, copied 2026-11-11 from the founder-approved prototype, artifact version 7); repo base is `main` @ 08633d3, verified with `git status -sb` → `## main...origin/main` before branching.
- purpose: production — this replaces the home page of the public marketing site (Next 15 app router, deployed by Netlify from `main`).
- consumes: the prototype reads only its own inline markup, CSS and one IIFE script; images come in through the placeholders `/*PLATES*/` (object of plate id → URL) and `/*IMG:logo|aljabr|oq|onzc|alhilal|tadoom|utas*/` (grep -o of the file shows exactly these eight tokens). The contact form consumes `submitContact` from `app/actions/contact.ts`, which calls `saveEnquiry` from `lib/enquiries-store` (Netlify Blobs).
- callers: `app/page.tsx` is the only caller of the film components (imports Nav, Footer and ten `components/film/*`); `components/contact.tsx` is the only caller of `submitContact` (`grep -rn submitContact app components`); `info@enerlytics.om` appears in `app/layout.tsx:66`, `app/actions/contact.ts:79`, `components/contact.tsx:77,78,116,118`, `components/footer.tsx:20,26,51`.
- falsifier: `npx tsc --noEmit` or `npm run build` failing; a browser run of the built site showing a console/page error, horizontal scroll at 390 px, or any section of the prototype missing. These checks exist and are run after this proposal by the architect.

## Goal
Make the home page (`/`) look and behave like `docs/prototype/data-film.html`, with a working contact form, on desktop and phone. The prototype is the visual and behavioural spec. Port it faithfully; do not redesign it.

## Scope in
1. **New component** `components/data-film/data-film.tsx` (`"use client"`) plus `components/data-film/data-film.css` (plain CSS imported by the component, every selector scoped under a root class `.df` so nothing leaks into `/responses`).
   - Render the prototype's markup as JSX (canvas, photo layer, top bar, the six dot chapters, `#how`, `#who`, `#where`, `#services`, `#trust`, `#contact`).
   - Move the prototype's script into one `useEffect` (or a sibling `engine.ts` exporting `mount(root): () => void`). It must run only on the client and **clean up on unmount**: cancel the animation frame, clear intervals/timeouts, remove every `window`/`document` listener it added. Guard so React strict-mode double-mount does not create duplicate SVG children or duplicate buttons (clear containers before building, or build those parts in JSX).
   - Keep all behaviour: the dot field and its six stages, copy fade (one block at a time), split-flap OMR figure, the turning six-stage wheel with stage tabs, the sector reel with plate crossfade and index buttons, the map that draws itself with seven selectable sites, the four service drawings, nav highlighting, reduced-motion handling, and the phone layout (`max-width: 860px` rules).
   - Text content must match the prototype exactly, except: delete the `<p class="about">…</p>` prototype note.
2. **Images** (all already in `public/`):
   - plates: `/media/<id>-1920.webp` for ids `h01 h03 h04 h05 h06 h09 h10 h11`; on viewports ≤ 860 px wide use `/media/<id>-960.webp`. Do not load all eight eagerly: set a plate's background only when it is first needed (the active plate and, at most, the next one).
   - logo: `/brand/logos/horizontal_white.png`; client/partner marks: `/brand/logos/tadoom.svg`, `alhilal.svg`, `oq.svg`, `utas.png`, `aljabr-logo-transparent.png`, `onzc.svg`. Plain `<img>` with explicit `width`/`height` attributes and `loading="lazy"` for the marks.
3. **Fonts**: load Source Serif 4 (weights 400, 600, 700) with `next/font/google` in `app/layout.tsx` and expose it as a CSS variable used by `.df`. JetBrains Mono is already linked in the layout; keep it. Do not remove Satoshi (the `/responses` page uses the global styles).
4. **Contact form** inside `#contact`, below the closing headline, replacing the prototype's mailto button:
   - Reuse the existing server action `submitContact` and its `ContactState` (do not change its validation schema). Fields: name, company, email, consumption (the five existing options), message, and the hidden honeypot `website`. Use `useActionState` + `useFormStatus` as `components/contact.tsx` does today.
   - Style with the film's tokens: labels in the mono label style, inputs transparent with a 1px bottom border, visible focus state, the submit button uses the `.cta` style and reads "Request a demo" / "Sending…". Show field errors and the success/error message returned by the action.
   - Keep the visible address + Copy button from the prototype next to the form, address `muath@enerlytics.om`.
   - Every "Book a demo" link on the page points to `#contact`.
5. **Email**: replace every `info@enerlytics.om` in `app/`, `components/` and `lib/` with `muath@enerlytics.om`.
6. **Enquiry notification** in `app/actions/contact.ts`: after `saveEnquiry` succeeds, if `process.env.RESEND_API_KEY` is set, POST to `https://api.resend.com/emails` with `fetch` (no new dependency): `from` = `process.env.ENQUIRY_FROM ?? "Enerlytics <onboarding@resend.dev>"`, `to` = `["muath@enerlytics.om"]`, `reply_to` = the enquirer's email, subject `New demo request — <company>`, a plain-text body listing name, company, email, consumption label and message. A failed or missing notification must never fail the submission: wrap in try/catch, log with `console.error`, still return the success state. Add `RESEND_API_KEY=` and `ENQUIRY_FROM=` (commented, with one line of explanation) to `.env.example`.
7. **Link preview**: in `app/layout.tsx` metadata add `openGraph.images: [{ url: "/og.png", width: 1200, height: 630, alt: "Enerlytics — energy waste, measured in money" }]` and `twitter.images: ["/og.png"]`. Update title/description strings in metadata to: title `Enerlytics — Energy waste, measured in money.`; description `Software that shows a facility where it is losing money on energy, and what to fix first.` Remove the `h01` image preload link in the layout if the hero no longer uses that image.
8. **Page**: `app/page.tsx` renders `<DataFilm />` then `<Footer />`. The old `<Nav />` is not rendered (the film has its own top bar). Keep `id="main"` on the film's `<main>` so the skip link still works.
9. **Footer** (`components/footer.tsx`): keep the component, fix its links to anchors that exist now (`#what`, `#how`, `#who`, `#where`, `#services`, `#contact`), and make sure its background is the film's black (`#050506`) so there is no colour seam.

## Scope out
- Do not delete the old `components/film/*`, `components/cinematic/*`, `nav.tsx`, `contact.tsx`, `services.tsx` etc. (they simply stop being imported). No refactor of unrelated code.
- No new npm dependencies. No changes to `lib/enquiries-store`, `app/responses`, `next.config.ts`, Tailwind config.
- No copy changes beyond what is listed. Never use the word "loop" in customer-facing copy (the site calls it the cycle).
- Do not add a test framework.

## Semantics that must hold
- Server render must contain all headline and body copy (it is in JSX, not injected by script), so the page is readable without JavaScript and for crawlers.
- No hydration warnings: anything random or time-based happens only inside the effect; the prototype's seeded generator must stay seeded.
- `prefers-reduced-motion: reduce`: no ambient animation, no draw-on, no split-flap; scroll still updates stages.
- No horizontal scroll at 390 px or 1360 px.
- The canvas is `aria-hidden`; tabs/index/site buttons are real `<button>`s with `aria-pressed`; the map sites stay keyboard reachable.

## Checks you must run and report (actual command + output tail)
1. `npx tsc --noEmit` → exit 0.
2. `npm run build` → exit 0.
3. `grep -rn "info@enerlytics.om" app components lib` → no matches.
4. `grep -n "og.png" app/layout.tsx` → at least two matches.
5. `grep -rn "RESEND_API_KEY" app .env.example` → present in both.
6. `grep -c "class=\"about\"\|className=\"about\"" components/data-film/data-film.tsx` → 0.

## Honesty contract
Report what you actually ran. If something in the prototype could not be ported exactly, list it under "Deviations" with the reason. If the build fails and you cannot fix it, say so and show the error; do not weaken a check to make it pass.
