# Enerlytics Landing Page

Marketing site for [Enerlytics](https://www.enerlytics.om) — the CRT-native energy intelligence platform for the GCC's institutional buildings.

Built with **Next.js 15 (App Router)**, **Tailwind CSS v4**, and **TypeScript**, locked to the Enerlytics brand system (Satoshi, navy `#0A1330`, accent blue `#2563EB`).

## Quick start

```bash
npm install
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the optimized production bundle |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run Next.js ESLint checks |

## Project structure

```
app/
  layout.tsx              # fonts, metadata, OG tags
  page.tsx                # composes all sections
  globals.css             # Tailwind v4 + brand tokens + Satoshi
  actions/contact.ts      # "use server" — validates + stores enquiries
  responses/page.tsx      # protected table view for enquiries

components/
  nav.tsx                 # sticky pill navigation
  hero.tsx                # dark navy hero with dashboard mock
  dashboard-mock.tsx      # SVG KPI tiles + line chart + peak warning
  trust-strip.tsx         # marquee of pilot/partner names
  problem.tsx             # three problem cards (Unexplained / Concentration / Fragmented)
  capabilities.tsx        # five capability cards using brand PNG icons
  preview.tsx             # standalone live dashboard preview
  how-it-works.tsx        # Monitor / Analyse / Govern
  pricing.tsx             # three OMR tiers
  team.tsx                # five team member cards
  contact.tsx             # form with server action + success state
  footer.tsx              # navy footer with site map
  ui/                     # Button, Card, Eyebrow primitives

public/brand/             # subset of Branding/ used at runtime
lib/cn.ts                 # tiny classnames helper
```

The original `Branding/` folder (logo source files, brand book PDF, swatches) stays untouched. Runtime images are duplicated into `public/brand/` so Next can serve and optimize them.

## Contact form + responses table

The "Book a Demo" form is wired to a Next.js Server Action that validates with `zod`, then stores enquiries as rows.

- On Netlify deploys, rows are persisted in Netlify Blobs.
- In local development, rows are saved to `data/enquiries.json`.

To protect the responses page, set this env var (copy `.env.example` to `.env.local`):

```bash
RESPONSES_PAGE_SECRET=change-this-secret
```

You can then access the table at:

```text
/responses?key=<RESPONSES_PAGE_SECRET>
```

The form includes a hidden `website` honeypot for basic spam protection.

## Deployment

Recommended target: **Netlify** (because submissions are stored in Netlify Blobs).

```bash
# Deploy from Netlify UI by connecting this GitHub repo,
# then set RESPONSES_PAGE_SECRET in Site settings -> Environment variables.
```

## Brand tokens

Defined in `app/globals.css` via Tailwind v4's `@theme`. Use them as native Tailwind utilities:

| Token | Value | Usage |
| --- | --- | --- |
| `bg-navy` / `text-navy` | `#0A1330` | Primary surfaces, headlines |
| `bg-blue` / `text-blue` | `#2563EB` | CTAs, links, accents |
| `bg-green` / `text-green` | `#16A34A` | Positive states, savings |
| `bg-mist` | `#F3F4F6` | Light backgrounds, cards |
| `text-gray` | `#6B7280` | Body text, dividers |
| `font-sans` | Satoshi | Headlines & body |

Type scale and shadows are also exposed as Tailwind utilities — see `app/globals.css`.

## Content sourcing

Copy is sourced from the Enerlytics pitch deck (`pitch.pdf`) and brand book (`Branding/Enerlytics_Brand.pdf`). To update copy, edit the constants at the top of each component file in `components/`.

## License

© 2026 Enerlytics. All rights reserved.
