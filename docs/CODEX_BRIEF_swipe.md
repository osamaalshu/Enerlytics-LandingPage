# Codex brief — horizontal swipe for "What we do", sectors and services

## GROUND TRUTH
- artifact: `components/data-film/{data-film.tsx,engine.ts,data-film.css}` on branch `feat/swipe`, cut from `main` @ 23d2f4c (live on enerlytics.om); verified with `git status -sb` → `## main...origin/main` before branching.
- purpose: production — the public home page. This changes how three sections are navigated.
- consumes: `engine.ts` exports one `mount(root)` that reads the DOM built by `data-film.tsx`: six `.ch` sections (the dot chapters, first is `#what`), `#how`, `#who`, `#where`, `#services`, `#trust`, `#contact`, the `#field` canvas and `#photo` layer. Heights come from `data-film.css` (`.df .ch { height: 150vh }`, `#what 130vh`, `#how 440vh`, `#services 420vh`, `#who 520vh`, `#where 200vh`). Stage of the dots, the sector index and the service index are all derived from `window.scrollY` today.
- callers: `components/data-film/data-film.tsx` is the only caller of `mount` (in a `useEffect`); `app/page.tsx` is the only caller of `<DataFilm />`.
- falsifier: `npx tsc --noEmit` or `npm run build` failing; or, in a browser, any of the three sections still needing vertical scroll to advance, horizontal page scroll (the document itself must not scroll sideways), a console error, or the dots not morphing while the "What we do" track is swiped. The architect runs these after the proposal.

## Goal
Three sections stop being long vertical scroll-through scenes and become horizontal swipe carousels: **What we do** (the dot story), **Who for** (sectors) and **Services**. Vertical scrolling moves between sections; horizontal swipe moves inside these three. The hero, the cycle (`#how`), the map (`#where`), clients/partners and contact stay exactly as they are.

## The carousel pattern (same for all three)
- A track element: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none` (also hide the WebKit scrollbar), `overscroll-behavior-x: contain`, `-webkit-overflow-scrolling: touch`. Each slide: `flex: 0 0 100%; scroll-snap-align: start; scroll-snap-stop: always`.
- Native touch swipe on phones. No JavaScript scroll-jacking of vertical wheel/touch: vertical scroll must pass through the section normally.
- Controls, all real `<button>`s:
  - the existing index/tab row (one button per slide, `aria-pressed` on the active one) scrolls the track to that slide (`scrollTo({ left, behavior: "smooth" })`, `"auto"` under reduced motion);
  - previous / next arrow buttons (labels "Previous" / "Next" via `aria-label`, visible glyphs `←` `→`), disabled at the ends;
  - Left/Right arrow keys when focus is inside the section.
- Desktop pointer drag: on `pointerdown` with a mouse on the track, dragging horizontally scrolls the track (set `scroll-snap-type: none` while dragging, restore on release and snap to the nearest slide). Do not start a drag from a button.
- A slide counter in the mono label style, e.g. `2 / 5`, and on viewports ≤ 860 px a small mono hint `Swipe →` that disappears after the first horizontal scroll of that track.
- The active index is derived from `track.scrollLeft / track.clientWidth` (rounded) on the track's `scroll` event (rAF-throttled). The track itself is `tabindex="0"` with an `aria-label`, each slide `role="group"` with `aria-label="<n> of <total>: <name>"`.

## 1. What we do (the dots)
- Keep `#what` (the hero) as a normal vertical section; its copy and buttons are unchanged.
- Replace the five `.ch` sections after it (The problem, 1 Unify, 2 Benchmark, 3 Detect, 4 Quantify) with ONE section `id="story"` that is `100svh` tall (min 620px) and holds a carousel with those five slides. Slide copy is exactly today's copy for each chapter (eyebrow, heading, paragraph; slide 5 keeps the split-flap OMR board and its caption).
- The dot canvas: stop using a fixed full-page canvas that fades out. Wrap `#what` and `#story` in one container; make the canvas `position: sticky; top: 0; height: 100svh` inside that container (pulled behind the content with a negative bottom margin, `pointer-events: none`), so it stays in the viewport through both and leaves with the container. Remove the old fade-out logic and the per-chapter copy opacity logic.
- Dot stage (0 = heat field … 5 = bars) is now: `stage = heroPart + trackPart`, where `heroPart` goes 0→1 with vertical scroll from the top of `#what` to the top of `#story` (same easing window as today's 0→1 hand-over), and `trackPart = track.scrollLeft / track.clientWidth` (0…4, continuous). So the dots morph continuously **while the finger drags**: half-way between slide 2 and 3 the dots are half-way between "unify" and "benchmark". The per-dot stagger used today must still apply to the fractional part.
- The furniture drawn on the canvas (source names, expected line, Actual/Waste labels, bar labels and OMR figures) keys off the same continuous stage value as today.
- The split-flap animation fires when slide 5 becomes active (and re-arms when leaving it).
- Layout: desktop (> 860 px) the carousel occupies the left copy column only (same column the copy uses today), dots stay on the right; the index row, arrows and counter sit under the copy. Phone: dots on top (same rect as today), the carousel takes the bottom part full-width.
- Nav highlighting: `#what` and `#story` both highlight "What we do".

## 2. Who for (sectors)
- `#who` becomes `100svh` tall (min 620px), not pinned, no long scroll. It holds a carousel of eight full-bleed slides, one per sector, in today's order.
- Each slide has its own background: the sector's plate (`/media/<id>-1920.webp`, `-960.webp` at ≤ 860 px, same id mapping as today) as a `background-image` on the slide with the same bottom-up dark gradient used by `#photo.reel` today, so the photo itself moves with the swipe. Set a slide's background only when it is the active slide or a neighbour (lazy).
- Slide content, bottom-left as today: `Sector n of 8` label, the big sector name (`--t-reel`), the one-line description. The section heading "Every facility. One model." with its "Who we build for" eyebrow stays fixed at the top of the section (not inside the slides).
- The existing sector index row becomes the carousel's index; add arrows and counter. Remove the `#photo` crossfade use for `who` and the `reel` class logic.

## 3. Services
- `#services` becomes `100svh` tall (min 640px), not pinned. Eyebrow "Services" and the heading "The platform finds it. Our engineers help you fix it and prove it." stay fixed at the top of the section (heading hidden ≤ 860 px as today).
- Carousel of four slides in today's order. Each slide: service name, body, the `In the cycle · Stage …` line, and that service's own drawing in its own `<svg>` (same four drawings as today, same viewBox). Desktop: copy left, drawing right inside the slide. Phone: drawing on top, copy below.
- The draw-on animation of a slide's drawing replays each time that slide becomes active (re-apply the animated classes or rebuild that slide's SVG); under reduced motion the drawing is static and complete.
- The existing service tabs become the carousel's index; add arrows and counter.

## Must not change
- Copy text, colours, type scale, the cycle section, the map section, clients/partners, contact form, footer, metadata.
- No new dependencies. No changes outside `components/data-film/` except, if needed, nothing.
- Cleanup: every listener/observer/timer added must be removed in the function `mount` returns.
- Server-rendered HTML must still contain all slide copy for all three carousels (slides are JSX, not built by script; the SVG drawings may be built by script).
- The document must never scroll horizontally (`document.documentElement.scrollWidth === innerWidth` at 390 px and 1360 px).
- `prefers-reduced-motion: reduce`: no smooth scrolling, no draw-on, no split-flap, no ambient dot motion; swiping still works.

## Checks you must run and report (actual command + output tail)
1. `npx tsc --noEmit` → exit 0.
2. `npm run build` → exit 0 (if Google Fonts is unreachable in your sandbox, say so and report the mocked-font build as you did before).
3. `grep -c "scroll-snap-type" components/data-film/data-film.css` → ≥ 1.
4. `grep -n "id=\"story\"" components/data-film/data-film.tsx` → one match.
5. `git diff --stat` touches only files under `components/data-film/`.

## Honesty contract
Report what you ran. List anything you could not do exactly as specified under "Deviations" with the reason. Do not weaken a check to make it pass.
