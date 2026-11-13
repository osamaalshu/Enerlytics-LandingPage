# Codex brief — make the "What we do" story smooth on desktop, add a step rail

## GROUND TRUTH
- artifact: `components/data-film/{data-film.tsx,engine.ts,data-film.css}` on branch `feat/story-scroll`, cut from `feat/light-theme` @ HEAD (draft PR #10: swipe carousels + light/dark palettes); verified with `git status -sb` → clean and tracking `origin/feat/light-theme` before branching.
- purpose: production — the home page's "What we do" section (`#story`). The founder reviewed the swipe build and said the horizontal experience of this section is weak; the cycle wheel below it must stay as it is.
- consumes: `#story` holds a scroll-snap track of five slides (`[tabindex="0"]` inside `#story`), an index row of five buttons, previous/next arrows and a counter. The dot stage is `heroPart + track.scrollLeft / track.clientWidth` in `engine.ts`; the split-flap fires when slide 5 is active. Colours come from `PALETTE[theme]` and CSS tokens on `.df` / `.df[data-theme="light"]`.
- callers: `data-film.tsx` is the only caller of `mount`; `app/page.tsx` the only caller of `<DataFilm />`.
- falsifier: `npx tsc --noEmit` / `npm run build` failing; or, in a desktop browser with a mouse wheel, the five steps not advancing from ordinary vertical wheel scrolling; or on a phone the native swipe no longer working; or the document scrolling sideways; or a console error. The architect runs these after the proposal.

## Problem
On desktop a mouse wheel cannot scroll sideways, so the visitor has to find two small arrow buttons to move through the five steps; only the narrow text column responds to a swipe; and nothing shows progress through the steps.

## Change 1 — desktop: vertical scroll drives the steps
Applies when `window.matchMedia("(min-width: 861px) and (hover: hover) and (pointer: fine)").matches` (re-evaluate on change). Call this "wheel mode". Everything else is "touch mode" and keeps today's native swipe track unchanged.

In wheel mode:
- `#story` becomes tall: `height: calc(100svh + 4 * 85vh)`. Its content sits in an inner element that is `position: sticky; top: 0; height: 100svh`.
- `trackPart` (0…4, continuous) = pin progress × 4, where pin progress = `clamp((scrollY - story.offsetTop) / (story.offsetHeight - innerHeight), 0, 1)`. The dot stage stays `heroPart + trackPart`. Do not read `track.scrollLeft` in wheel mode.
- The five slides are stacked in the same place (not side by side, no horizontal overflow). Slide `i` gets `opacity = clamp(1 - |trackPart - i| * 1.7, 0, 1)` and `transform: translateX((i - trackPart) * 56px)`; `visibility: hidden` and `pointer-events: none` when its opacity is 0. So copy crossfades with a short sideways drift while the dots morph. Under `prefers-reduced-motion: reduce`: no translate, opacity switches at the half-way point.
- Settle: when vertical scrolling has been idle for 160 ms and `trackPart` is within 0.02–0.98 of a fractional step (i.e. not already resting on a step), smooth-scroll the window to the nearest step's position (`story.offsetTop + (story.offsetHeight - innerHeight) * step / 4`). Only do this while the story is pinned, never fight an in-progress user scroll (cancel on the next wheel/touch/key event), and skip it entirely under reduced motion.
- Arrow buttons, rail buttons and Left/Right keys scroll the window to the previous/next/chosen step's position (smooth; `auto` under reduced motion).
- The active step index = `Math.round(trackPart)`; the split-flap fires when it becomes 4 and re-arms when it drops below 4.

## Change 2 — the step rail (both modes)
Replace the small index row in `#story` with a rail:
- A horizontal line across the full width of the story's control area with five nodes, labelled in the mono label style: `Problem`, `1 Unify`, `2 Benchmark`, `3 Detect`, `4 Quantify`.
- The line fills from the left to `trackPart / 4` continuously (a second line on top, `transform: scaleX(...)`, `transform-origin: left`, colour `var(--fg)`; the base line `var(--line)`). Nodes at or before the current position are filled `var(--fg)`; later nodes are hollow with a `var(--line)` border; the active node's label is `var(--fg)`, others `var(--quiet)`.
- Each node is a `<button>` with `aria-pressed`, at least 44 px tall hit area. Clicking goes to that step (window scroll in wheel mode, track scroll in touch mode).
- Keep the previous/next arrows (make them 44 px square) and the `n / 5` counter at the right end of the rail row.
- At ≤ 860 px: show the nodes and the fill, but only the active node's label (the others would not fit).
- In touch mode the fill is driven by `track.scrollLeft / track.clientWidth / 4`.
- Colours only through tokens, so both themes work.

## Change 3 — touch mode: swipe anywhere in the story
In touch mode, make the swipe area the whole story section, not only the copy: the track covers the section (above the canvas, transparent), each slide positions its copy where it is today (bottom part on phones). The canvas keeps `pointer-events: none`. Keep the `Swipe →` hint and make sure it is actually visible on first view at ≤ 860 px (it is missing today): mono label, right-aligned above the rail, hidden after the first horizontal scroll.

## Must not change
- `#who` and `#services` carousels, the cycle (`#how`), the map, clients/partners, contact, footer, copy text, type scale, both palettes.
- Server-rendered HTML still contains all five slides' copy.
- No new dependencies; only files under `components/data-film/`.
- Every listener, timer and media-query listener added is removed in the cleanup `mount` returns.
- Declare variables before any function that can run during `mount` uses them (the last patch crashed on load with "Cannot access before initialization").
- The document never scrolls sideways at 390 px or 1360 px.

## Checks you must run and report (actual command + output tail)
1. `npx tsc --noEmit` → exit 0 (if dependencies are missing in your sandbox, say so).
2. `npm run build` → exit 0 (same caveat).
3. `grep -n "pointer: fine" components/data-film/engine.ts components/data-film/data-film.css` → at least one match.
4. `grep -c "story-rail\|storyRail" components/data-film/data-film.tsx` → ≥ 1.
5. `git diff --stat` touches only files under `components/data-film/`.

## Honesty contract
Report what you ran. List anything not done exactly as specified under "Deviations". Do not weaken a check to make it pass.
