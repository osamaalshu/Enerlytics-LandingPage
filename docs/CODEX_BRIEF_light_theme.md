# Codex brief — add a light theme to the data film (preview toggle)

## GROUND TRUTH
- artifact: `components/data-film/{data-film.tsx,engine.ts,data-film.css}` on branch `feat/light-theme`, cut from `feat/swipe` @ HEAD (PR #9, the swipe carousels); verified with `git status -sb` → `## feat/swipe...origin/feat/swipe`, clean, before branching.
- purpose: production code, but this change is an evaluation build — the founder wants to see the page in a light theme next to the dark one before deciding. Dark stays the default.
- consumes: colours live in two places today: CSS custom properties on `.df` in `data-film.css` (`--bg --fg --soft --quiet --line --lav --layer --waste --money --paper --ink`) and hard-coded literals inside `engine.ts` (canvas clear colour `#050506`, label colours such as `#f5f3ee`, `#9a9aa3`, `#27c8d8`, `#ff8a1f`, the `LAYER` dot colour, the `RAMP`/`ramp()` colours, wheel track `#3a3a44`, map strokes, service-drawing strokes, `GLOW`).
- callers: `data-film.tsx` is the only caller of `mount`; `app/page.tsx` the only caller of `<DataFilm />`.
- falsifier: `npx tsc --noEmit` / `npm run build` failing; or in a browser with the light theme on: any text below 4.5:1 contrast against its background (3:1 for text ≥ 24px), any canvas/SVG element still drawn in a dark-theme literal that becomes invisible on the light ground, or the dark theme looking different from before this change. The architect runs these checks after the proposal.

## Goal
Add a second, light theme to the home page and a toggle to switch between dark and light, so both can be compared on the same build. The dark theme must render exactly as it does now.

## Mechanism
- Theme is an attribute on the film root: `<div class="df" data-theme="dark|light">`. Default `dark` in the server-rendered HTML.
- On mount: if the URL has `?theme=light` or `?theme=dark`, use it; else read `localStorage["df-theme"]` (try/catch); else `dark`. Apply before the first canvas frame.
- A toggle `<button>` in the top bar, right of the nav links (and visible on phones, where the nav links are hidden): text label `Light` when dark is active and `Dark` when light is active, mono label style, `aria-label="Switch to light theme"` / `"Switch to dark theme"`. Clicking flips the attribute, stores the choice, and redraws everything.
- All colours the engine draws with must come from one palette object per theme (`PALETTE.dark`, `PALETTE.light`) defined at the top of `engine.ts`; no colour literal may remain inside drawing code. The canvas reads the active palette every frame; the wheel, map and service drawings are rebuilt (or recoloured) on theme change by re-running their existing show/build functions.
- Do not animate the colour change of the canvas; a simple instant switch is fine. CSS tokens may transition `background-color`/`color` over 0.3s.

## Light theme values
CSS tokens under `.df[data-theme="light"]`:
- `--bg: #f3f1ec` · `--fg: #0b0b0e` · `--soft: #3d3d45` · `--quiet: #62626c` · `--line: #d9d6ce`
- `--lav: #5b3fe0` · `--layer: #0a7280` · `--waste: #b04a04` · `--money: #946000`
- `--paper: #ffffff` · `--ink: #0b0b0e` (the clients/partners band becomes white with a 1px `--line` border top and bottom so it still reads as its own band)
- `color-scheme: light` on the root in light theme.

Engine palette, light:
- canvas clear: `#f3f1ec`; primary label text `#0b0b0e`; quiet label text `#62626c`
- unified/benchmark dot colour (`LAYER`): `#0a7280`; "expected" line: `#0a7280`
- waste dots/labels: from `#c2410c` to `#e07a12` (keep the same per-dot variation logic), "Waste" label `#b04a04`
- the six source-system colours: `#6d3fe0`, `#1d5fd6`, `#c2257a`, `#a86a00`, `#0f8a5f`, `#62626c`
- hero heat-field ramp: `#b9a7f0` → `#d6336c` → `#e8590c` → `#b97800` (low heat must still be visible on the light ground: minimum dot alpha 0.45)
- priced bars: `#946000`, `#c2410c`, `#b81f70`
- `ramp()` (cycle stages, service drawings): `#5b3fe0` → `#b81f70` → `#c4560a` → `#946000`
- wheel: inactive track `#cfccc4`, inactive labels `#62626c`, active label `#0b0b0e`, pointer triangle `#0b0b0e`, centre output text `#946000`
- map: graticule `rgba(91,63,224,.28)`, outline stroke `#0b0b0e`, land fill `rgba(91,63,224,.06)`, link lines `#5b3fe0`, normal site dot `#0b0b0e` with a `#f3f1ec` ring, warning site dot `#b04a04`, graticule text `#62626c`
- service drawings: axes `#cfccc4`, baseline/"as designed" dashed line `#0b0b0e`, savings fill `rgba(148,96,0,.16)`, "Verified savings" text `#946000`
- chapter glow wash: same hues at alpha `.07` (dark keeps `.15`)

Photography in light theme:
- `#how` (cycle): no photo; plain `--bg`.
- sector slides: keep the photo and its dark gradient, keep white text on them (photo slides are the same in both themes).
- `#contact`: no photo; plain `--bg`.
- top bar gradient uses `--bg`.
- logo: `/brand/logos/horizontal.png` (dark ink version, already in `public/`) in light theme, `/brand/logos/horizontal_white.png` in dark. Render both `<img>`s and show one by CSS so there is no flash and no hydration difference.
- form inputs, buttons, tabs, arrows: all through tokens; the `.cta` is `--fg` background with `--bg` text in both themes.
- footer (`components/footer.tsx`) stays dark in both themes; do not edit it.

## Must not change
- Any copy, layout, type scale, behaviour of the carousels, the cycle, the map, the form.
- The dark theme's rendered colours (dark palette values = today's literals).
- No new dependencies; only files under `components/data-film/` may change.
- Cleanup of every listener added. No hydration warnings (server always renders `data-theme="dark"`; the effect may switch it).

## Checks you must run and report (actual command + output tail)
1. `npx tsc --noEmit` → exit 0 (if dependencies are missing in your sandbox, say so).
2. `npm run build` → exit 0 (same caveat).
3. `grep -c 'data-theme="light"' components/data-film/data-film.css` → ≥ 1.
4. `grep -n "PALETTE" components/data-film/engine.ts | head` → shows both `dark` and `light`.
5. `grep -n -E '"#[0-9a-fA-F]{3,6}"' components/data-film/engine.ts` → every match is inside the `PALETTE` definition (list any that are not, with why).
6. `git diff --stat` touches only files under `components/data-film/`.

## Honesty contract
Report what you ran. List anything not done exactly as specified under "Deviations". Do not weaken a check to make it pass.
