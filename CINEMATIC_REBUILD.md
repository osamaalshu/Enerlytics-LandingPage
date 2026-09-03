# Cinematic rebuild — how the site is put together

> **v2 (the film) supersedes the chapter table below.** Read `docs/TREATMENT_v2.md` first.
> Page order lives in `app/page.tsx`; chapters in `components/film/`; the plate + statement
> layout is `PlateStory`, chapter cards are `TitleCard`, and every plate renders through
> `DepthPlate` (WebGL depth parallax, poster fallback). Depth maps: `assets-src/depth.py`.
> The primitives section, media pipeline and truth boundaries below still apply.

Branch `redesign/cinematic`, 2026-09-04. Brief: `~/Desktop/Enerlytics_Cinematic_Web_Rebuild_Fable_5_1.pdf`
(guiding lamp, not gospel). Founder's standing site laws still apply on top of it:
"How we do it" / "cycle" (never "loop") · amber = money only · no pilot names, numbers or
tier pricing · "facility" wording · content never gated behind JavaScript · teal accent,
info@enerlytics.om everywhere.

## Creative direction (the treatment, in one screen)

**Metaphor:** physical infrastructure becoming legible. One Omani industrial site — hall with
rooftop PV, ground-mount field, two BESS containers, 11 kV substation, jebel behind — shot at
blue hour, reused in every plate so the visitor stays in one place while the digital layer
attaches itself to the equipment.

**Signature element:** *anchored instrumentation* (`Callout`). A readout pinned to a point on
the plate by a thin leader line, drawn with CSS. Load on the hall, PV on the field, SoC on the
battery yard, the approach temperature on the sensor cable. Everything else is quiet.

**Palette:** ink `#06090f` (page ground) · navy `#0a1330` (brand, instrument chapters) ·
teal `#168aad/#34a0a4` (the legibility layer: data ink, PV) · blue `#3b82f6` (load) · green
`#22c55e` (battery, NORMAL) · red `#ef4444` (FAULT/WARNING) · amber `#f59e0b` (**money only**)
· paper/mist for the calm commercial chapters after the cinema.

**Type:** Satoshi display, JetBrains Mono for every unit, timestamp, state and label (`.instrument`).

**Pacing:** three cinematic sequences (hero, PV + BESS pinned scene, anomaly on the chiller),
one pullback (portfolio), then stillness on white (services, engagement, team), then a quiet
return to the facility with the form. Nothing else pins or scroll-jacks.

## Scene architecture (`app/page.tsx`)

| # | Chapter | Component | Plate | Motion |
|---|---------|-----------|-------|--------|
| 00 | Cold open | `cinematic/hero-scene` | h01 (H01_v3) | CSS drift + scroll dim/lift, CSS leader traces, live OMR ticker |
| 01 | Economic problem | `cinematic/peak-cost` | — | scroll-drawn load curve, without→with action, one amber window |
| 02 | How we do it | `the-loop` (kept) | — | existing ring; path coords rounded (hydration fix) |
| 03 | What we see | `cinematic/asset-graph` | — | SVG topology, paths draw on view, dashes march with power |
| 04 | PV + BESS | `cinematic/pv-bess-scene` + `energy-flow` | h04 / h05 crossfade | `PinnedChapter`, 5 beats; stepper on mobile |
| 05 | Anomaly → OMR | `cinematic/anomaly-scene` | h03 | callout on the sensor, five-step finding, `InView` reveals |
| 06 | Platform × engineer | `cinematic/platform-engineer` | — | static split, handoff rail |
| 07 | Portfolio | `cinematic/portfolio-scene` | h06 | pullback plate + horizontal sector rail |
| 08 | Services / engagement | `services`, `engagement` (kept, light) | — | none |
| 09 | Proof | `trust-strip`, `team` (kept) | — | none |
| 10 | Closing | `cinematic/closing-scene` + `contact` | h01b (H01_v2) | still only |

## Reusable primitives (`components/cinematic/`)

- `MediaSource` — poster `<picture>` (AVIF/WebP/JPG, 960w + 960w/1920w srcset) with optional lazy
  muted-loop video; video only for ids listed in `lib/media.ts`, only ≥1024px unless
  `videoOnMobile`, never on reduced motion or Save-Data.
- `PinnedChapter` (`scroll-scene.tsx`) — the one pinned-scene wrapper. Desktop: `steps × 100vh`
  outer, sticky stage, progress rail. Mobile / reduced motion / no JS: no pinning, a tap stepper.
- `Callout`, `CountUp`, `StateChip` (`metric-overlay.tsx`) — anchored readouts, one-shot number
  interpolation, text-labelled states (NORMAL WARNING FAULT OFFLINE CHARGING DISCHARGING GENERATING CURTAILED).
- `EnergyFlow` — PV / grid / loads / battery around a site bus; stroke width ∝ kW, direction explicit.
- `SectionFrame`, `ChapterHead` — spacing, tone, text width.
- `InView` — viewport reveal that renders fully visible on the server (never hides content).
- `lib/scroll.ts` — `useCinematicOk()` (reduced-motion ∧ coarse-pointer ∧ ≥1024px gate), scene progress helpers.

One motion engine: framer-motion (`useScroll`, `useTransform`, `animate`). CSS keyframes for
entrances (`.rise`, `.trace`, `.media-drift`, `.flow`) so first paint needs no JS. No GSAP, no WebGL.

## Media pipeline (`assets-src/`)

```
shots.json              visual bible + shot list (H01–H07, S01–S06) with motion prompts
codex_stills.py         stills via Codex CLI image tool (ChatGPT login)   → gen/<ID>_v<n>.png
generate.py stills      stills via OpenAI Images API (needs credits)      → gen/
generate.py motion      sora-2 image-to-video from a chosen still         → gen/<ID>.mp4
encode_images.mjs       sharp → public/media/<slug>-{1920,960}.{avif,webp,jpg}
generate.py encode      ffmpeg → public/media/<slug>-{desktop,mobile}.{webm,mp4}
manifest.json           provenance of every generated master
PROMPTS_FOR_CHATGPT.md  the same prompts for manual generation
```

**To replace footage:** drop a master in `assets-src/gen/`, run
`node assets-src/encode_images.mjs <slug> <file>` (posters) and/or `python3 assets-src/generate.py
encode --only <ID>` (clips), then add the slug to `VIDEO_IDS` in `lib/media.ts`. No component changes.
Hero callout anchors are the `ANCHORS` constant at the top of `hero-scene.tsx` (% of the plate).

Masters in `assets-src/gen/` are gitignored-sized PNGs (~2 MB each) — keep them out of the
served bundle; only `public/media/` ships.

## Truth boundaries kept

- Every number on the page is labelled *illustrative simulation*; no client result, count, award
  or deployment is claimed. Partner marks are the ones already live.
- PV + storage is described as *designed for / in development*; no string-, panel- or cell-level
  resolution is implied; no SoH, degradation or dispatch-optimisation claim.
- Audits "engineer-reviewed, data-assisted"; M&V "IPMVP-aligned"; no "certified/compliant" software;
  "never writes a setpoint"; certification "stays with accredited bodies" (docs/business_model/02_CLAIMS_REGISTER.md).
- Removed the "Pilot deployment underway · OQ Accelerator" line from the contact block (pilot
  status wording must come from the source of truth; left conservative).

## Not done / left conservative

- **No motion clips yet.** OpenAI API has no credits (sora-2 refused: `credit_balance_exhausted`);
  Codex CLI can generate images but not video. Every plate ships as a still with CSS drift; the
  video path is wired and gated off. Add credits (or Higgsfield clips), run `generate.py motion`
  → `encode`, list ids in `lib/media.ts`.
- Sector stills S01–S06 not generated (rail is text-only by design for now).
- H07 (engineer) not generated; platform × engineer chapter has no plate.
- Lighthouse numbers: see STATE.md "Last run".
