// @ts-nocheck

export const PALETTE = {
  dark: {
    clear: "#050506", primary: "#f5f3ee", quiet: "#9a9aa3", layer: "#27c8d8", expected: "#27c8d8",
    wasteStart: "#ff8a1f", wasteEnd: "#ffc850", wasteLabel: "#ff8a1f",
    sources: ["#8b5cf6", "#3b82f6", "#ec4899", "#f5b300", "#34d399", "#9ca3af"],
    ramp: ["#7c5cff", "#e23e96", "#ff8a1f", "#ffcd50"], heat: ["#46186e", "#d62846", "#ff841e", "#ffde60"],
    bars: ["#ffc233", "#f0553a", "#d63f8c"], glow: ["#ff8a1f", "#7c5cff", "#27c8d8", "#27c8d8", "#ff8a1f", "#ffc233"],
    wheelTrack: "#3a3a44", wheelInactive: "#777783", wheelOutput: "#ffc233", wheelCircle: "rgba(245,243,238,.12)",
    mapGrid: "rgba(124,92,255,.32)", mapFill: "rgba(124,92,255,.07)", mapOutline: "#f5f3ee", mapLink: "#7c5cff", mapRing: "#050506", mapWarning: "#ff8a1f", mapNormal: "#f5f3ee", mapText: "#6f6f7b",
    axes: "#3a3a44", baseline: "#f5f3ee", savings: "rgba(255,194,51,.2)", verified: "#ffc233", glowAlpha: .15, minHeatAlpha: .25,
    sectorOverlay: ["rgba(5,5,6,.94)", "rgba(5,5,6,.5)", "rgba(5,5,6,.18)", "rgba(5,5,6,.55)"],
  },
  light: {
    clear: "#f3f1ec", primary: "#0b0b0e", quiet: "#62626c", layer: "#0a7280", expected: "#0a7280",
    wasteStart: "#c2410c", wasteEnd: "#e07a12", wasteLabel: "#b04a04",
    sources: ["#6d3fe0", "#1d5fd6", "#c2257a", "#a86a00", "#0f8a5f", "#62626c"],
    ramp: ["#5b3fe0", "#b81f70", "#c4560a", "#946000"], heat: ["#b9a7f0", "#d6336c", "#e8590c", "#b97800"],
    bars: ["#946000", "#c2410c", "#b81f70"], glow: ["#b04a04", "#5b3fe0", "#0a7280", "#0a7280", "#b04a04", "#946000"],
    wheelTrack: "#cfccc4", wheelInactive: "#62626c", wheelOutput: "#946000", wheelCircle: "rgba(11,11,14,.12)",
    mapGrid: "rgba(91,63,224,.28)", mapFill: "rgba(91,63,224,.06)", mapOutline: "#0b0b0e", mapLink: "#5b3fe0", mapRing: "#f3f1ec", mapWarning: "#b04a04", mapNormal: "#0b0b0e", mapText: "#62626c",
    axes: "#cfccc4", baseline: "#0b0b0e", savings: "rgba(148,96,0,.16)", verified: "#946000", glowAlpha: .07, minHeatAlpha: .45,
    sectorOverlay: ["rgba(5,5,6,.94)", "rgba(5,5,6,.5)", "rgba(5,5,6,.18)", "rgba(5,5,6,.55)"],
  },
};

export function mount(root: HTMLElement): () => void {
  let palette = PALETTE.dark;
  const IMG: Record<string, string> = Object.fromEntries(["h01","h03","h04","h05","h06","h09","h10","h11"].map(k => [k, `/media/${k}-${window.innerWidth <= 860 ? "960" : "1920"}.webp`]));
  const $ = (id: string) => root.querySelector<HTMLElement>(`#${id}`)!, reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const photoBox = $("photo"), photos: Record<string, HTMLElement> = {};
  const cleanups: (() => void)[] = [];
  const listenerController = new AbortController();
  const listen = (target: EventTarget, type: string, handler: EventListenerOrEventListenerObject, options: AddEventListenerOptions = {}) => target.addEventListener(type, handler, { ...options, signal: listenerController.signal });
  let plateOn = "";
  const plateTimers: number[] = [];
  function setPlate(k) { if (k === plateOn) return; const old = plateOn; plateOn = k; if (k && !photos[k]) { const i = document.createElement("i"); i.style.backgroundImage = `url(${IMG[k]})`; photoBox.appendChild(i); photos[k] = i; } for (const id in photos) photos[id].classList.toggle("on", id === k); if (old && old !== k) plateTimers.push(window.setTimeout(() => { if (plateOn !== old) { photos[old]?.remove(); delete photos[old]; } }, 1250)); }
  const cv = $("field"), g = cv.getContext("2d");
  const C = 36, R = 20, N = C * R;
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  let SRC = palette.sources.map(rgb);
  const SRC_NAME = ["Building systems", "Plant control", "Machines", "Meters", "Sensors", "Utility bills"];
  const CENTRE = [[.17,.2],[.62,.13],[.4,.5],[.84,.47],[.15,.8],[.63,.83]];
  let LAYER = rgb(palette.layer);
  let BARS = [{ v: 5000, y: .2, c: rgb(palette.bars[0]), t: "A cooling plant is using more energy than it should" },
                { v: 600,  y: .5, c: rgb(palette.bars[1]),  t: "Cooling is running in peak-price hours" },
                { v: 498,  y: .76, c: rgb(palette.bars[2]), t: "A pump is running outside its schedule" }];
  const STAGES = [
    ["Collect", "What is actually happening?", "Meters, bills and plant data come in, validated once, at the edge. Your tariff bill is reconstructed and checked line by line, exact to the baisa.", "Validated data · exact bill"],
    ["Understand", "How are we performing?", "Baselines, benchmarks and cost decomposition put your numbers in context, every one of them in OMR, at your actual tariff.", "Cost baseline & benchmarks"],
    ["Diagnose", "Why is this happening?", "Physics-based detection finds the cause: a cooling plant off its curve, equipment idling at full power, a costly start-up pattern. Then it prices the waste per hour.", "Priced findings"],
    ["Improve", "What should we do?", "Prioritised fixes with payback attached: engineer-reviewed, data-assisted audits and retro-commissioning support. People decide; evidence backs them.", "Actions, decided & owned"],
    ["Verify", "Did it work?", "IPMVP-aligned measurement proves the savings against a frozen baseline, and keeps watching, so drift is caught instead of quietly eating the gains.", "Verified savings"],
    ["Report", "Can we prove it?", "Executive evidence with a full audit trail, ready for boards, auditors and carbon reporting. Then the cycle starts again, from a higher floor.", "Evidence pack · new baseline"]];
  const SITES = [
    ["Sohar", 56.71, 24.35, "Factory · process + cooling", "1.42 MW", "kWh per tonne tracked", 0],
    ["Muscat", 58.41, 23.59, "Hotel · cooling-driven peaks", "OMR 4,120", "this month, peak-band share 38 %", 1],
    ["Nizwa", 57.53, 22.93, "Campus · 14 buildings", "0.61 MW", "per-building accountability", 0],
    ["Duqm", 57.70, 19.65, "Data centre · dry coolers", "PUE 1.46", "mechanical overhead drifting", 1],
    ["Salalah", 54.09, 17.02, "Hospital · 24/7 critical", "0.88 MW", "resilience untouched", 0],
    ["Ibri", 56.52, 23.23, "Solar + storage site", "184 kW", "expected 190 · SoC 62 %", 0],
    ["Sur", 59.53, 22.57, "Oil & gas · compression", "2.1 MW", "utility baselines", 0]];
  const OMAN_D = "M 424.2 341.4 L 404.1 381.1 L 379.6 378.1 L 368.4 391.9 L 359.7 421.3 L 366.3 460.1 L 361.3 467.2 L 336.4 467.0 L 302.7 488.7 L 297.5 516.9 L 285.1 529.2 L 251.6 528.7 L 230.4 543.3 L 230.7 566.8 L 204.6 582.9 L 174.8 577.4 L 138.7 597.0 L 113.8 600.2 L 96.2 559.7 L 54.0 464.0 L 215.9 406.0 L 251.8 290.0 L 227.1 248.9 L 228.5 225.6 L 244.2 201.6 L 244.4 177.9 L 268.8 166.4 L 259.3 158.4 L 263.7 120.6 L 291.2 120.4 L 315.4 160.0 L 345.6 181.0 L 385.1 188.6 L 417.1 199.2 L 441.5 232.4 L 456.0 251.7 L 475.3 259.1 L 475.2 272.0 L 455.6 306.6 L 447.0 322.8 L 424.2 341.4 Z M 290.9 64.0 L 283.9 74.6 L 273.6 54.8 L 289.4 35.0 L 296.0 40.1 L 290.9 64.0 Z";
  const proj = (lon, lat) => [(lon - 51) * .9304 * 58, (27 - lat) * 58];
  let RAMP = palette.ramp.map(rgb);
  const mix = (x, y, t) => x + (y - x) * t, clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ramp = x => { const v = clamp(x, 0, .999) * 3, i = Math.floor(v), f = v - i; return [0, 1, 2].map(j => mix(RAMP[i][j], RAMP[i + 1][j], f) | 0); };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const heatCol = h => { const s = palette.heat.map(rgb); const x = clamp(h, 0, .999) * 3, i = Math.floor(x), f = x - i; return [0, 1, 2].map(j => mix(s[i][j], s[i + 1][j], f)); };
  let GLOW = palette.glow.map(rgb);

  /* ---------- act one: the dots ---------- */
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const P = [];
  for (let i = 0; i < N; i++) { const a = rnd(), b = rnd(), c = rnd(), d = rnd(), u = rnd();
    let pick = rnd() * 6098, bar = 0; while (bar < 2 && pick > BARS[bar].v) { pick -= BARS[bar].v; bar++; }
    P.push({ gx: (i % C + .5) / C, gy: (Math.floor(i / C) + .5) / R, a, b, c, d, u, k: i % 6, bar, lifted: u > .52 && c < .62 }); }
  const base = u => .6 + .05 * Math.sin(u * 6.6) + .025 * Math.sin(u * 17 + 1);
  let W = 0, H = 0, rect = { x: 0, y: 0, w: 1, h: 1 }, narrow = false, barW = .84;
  function at(s, p, t) {
    switch (s) {
      case 0: { const cx = .62 + .1 * Math.sin(t * .21), cy = .5 + .12 * Math.cos(t * .17);
        const h = Math.exp(-((p.gx - cx) ** 2 * 1.4 + (p.gy - cy) ** 2) / .07) * (.86 + .14 * Math.sin(t * 1.3 + p.a * 40));
        return [p.gx, p.gy, .1 + .82 * h, heatCol(h), Math.max(palette.minHeatAlpha, .25 + .75 * h)]; }
      case 1: { const c = CENTRE[p.k], r = Math.sqrt(p.a) * .11, th = p.b * 6.2832 + t * .12 * (p.k % 2 ? 1 : -1);
        return [c[0] + Math.cos(th) * r, c[1] + Math.sin(th) * r * 1.25, .2, SRC[p.k], .9]; }
      case 2: return [.14 + p.gx * .72, .12 + p.gy * .76, .2, LAYER, .55 + .45 * (.5 + .5 * Math.sin(t * 1.1 - p.gx * 9))];
      case 3: return [p.u, base(p.u) + (p.a - .5) * .05 + .004 * Math.sin(t + p.d * 20), .2, LAYER, .9];
      case 4: { if (!p.lifted) return [p.u, base(p.u) + (p.a - .5) * .05, .2, LAYER, .8];
        const rp = clamp((p.u - .52) / .48, 0, 1), lift = rp * (.08 + .4 * p.b);
        { const c0 = rgb(palette.wasteStart), c1 = rgb(palette.wasteEnd); return [p.u, base(p.u) - lift + .004 * Math.sin(t * 1.4 + p.d * 20), .24, c0.map((v,j)=>mix(v,c1[j],p.b)), 1]; } }
      default: { const b = BARS[p.bar]; return [p.a * barW * b.v / 5000, b.y + p.b * .1, .2, b.c, .95]; }
    }
  }
  function size() { const d = Math.min(window.devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight;
    if (cv.width !== Math.round(W * d) || cv.height !== Math.round(H * d)) { cv.width = Math.round(W * d); cv.height = Math.round(H * d); }
    g.setTransform(d, 0, 0, d, 0, 0); narrow = W <= 860; barW = narrow ? .66 : .84;
    rect = narrow ? { x: W * .06, y: H * .11, w: W * .88, h: H * .37 } : { x: W * .48, y: H * .17, w: W * .46, h: H * .68 }; }
  const hero = $("what"), story = $("story"), storyTrack = $("storyTrack");
  let storyIndex = 0;
  const wheelQuery = window.matchMedia("(min-width: 861px) and (hover: hover) and (pointer: fine)");
  let wheelMode = wheelQuery.matches, trackPart = 0, settleTimer = 0, userCancelSettle = false;
  const storyInner = story.querySelector<HTMLElement>(".story-inner")!;
  const storySlides = [...story.querySelectorAll<HTMLElement>(".story-slide")];
  const storyRail = $("storyIndex");
  function setWheelMode() { wheelMode = wheelQuery.matches; story.classList.toggle("wheel-mode", wheelMode); storyInner.classList.toggle("wheel-inner", wheelMode); if (!wheelMode) storySlides.forEach(s => { s.style.opacity=""; s.style.transform=""; s.style.visibility=""; s.style.pointerEvents=""; }); }
  setWheelMode();
  const X = x => rect.x + x * rect.w, Y = y => rect.y + y * rect.h;
  const MONO = '500 11px "JetBrains Mono", ui-monospace, monospace';
  // canvas labels use the brand face; Satoshi ships 500 and 700, so anything bolder than regular is drawn at 700
  const SERIF = (w, px) => `${w >= 600 ? 700 : w} ${px}px "Satoshi", "Inter", system-ui, sans-serif`;
  function label(txt, x, y, alpha, col, align, font) { if (alpha <= .02) return; g.globalAlpha = clamp(alpha, 0, 1); g.fillStyle = col; g.textAlign = align || "left"; g.font = font || MONO; g.fillText(txt, x, y); }
  const cells = [...root.querySelectorAll("#board b:not(.sep)")], FINAL = cells.map(c => c.textContent);
  const intervals: number[] = [];
  const timeouts: number[] = [];
  function flap() { if (reduced) return; cells.forEach((c, i) => { let n = 10 + i * 7; const id = window.setInterval(() => { c.textContent = --n > 0 ? String(Math.floor(rnd() * 10)) : FINAL[i];
    c.classList.remove("flip"); void c.offsetWidth; c.classList.add("flip"); if (n <= 0) clearInterval(id); }, 55); intervals.push(id); }); }
  let flapped = false;
  function dots(t) {
    size();
    const heroSpan = Math.max(1, story.offsetTop - hero.offsetTop);
    const heroPart = ease(clamp((window.scrollY - hero.offsetTop) / heroSpan, 0, 1));
    trackPart = wheelMode ? pinProg(story) * 4 : storyTrack.scrollLeft / Math.max(1, storyTrack.clientWidth);
    const activeStory = clamp(Math.round(trackPart),0,4);
    if (activeStory !== storyIndex) { storyIndex=activeStory; const count=$("storyCount"); count.textContent=`${activeStory+1} / 5`; story.querySelector<HTMLButtonElement>(".previous")!.disabled=activeStory===0; story.querySelector<HTMLButtonElement>(".next")!.disabled=activeStory===4; storyRail.querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",String(i===activeStory))); }
    if (wheelMode) storySlides.forEach((slide,i) => { const distance=Math.abs(trackPart-i), alpha=reduced ? (distance < .5 ? 1 : 0) : clamp(1-distance*1.7,0,1); slide.style.opacity=String(alpha); slide.style.transform=reduced ? "none" : `translateX(${(i-trackPart)*56}px)`; slide.style.visibility=alpha ? "visible" : "hidden"; slide.style.pointerEvents=alpha ? "auto" : "none"; });
    const railButtons=[...storyRail.querySelectorAll<HTMLButtonElement>("button")];
    railButtons.forEach((b,i)=>{b.setAttribute("aria-pressed",String(Math.round(trackPart)===i));b.classList.toggle("passed",i<=trackPart);});
    storyRail.style.setProperty("--rail-progress",String(trackPart/4));
    const pos = clamp(heroPart + trackPart, 0, 5);
    g.globalAlpha = 1; g.fillStyle = palette.clear; g.fillRect(0, 0, W, H);
    { const i0 = Math.min(5, Math.floor(pos)), i1 = Math.min(5, i0 + 1), k = pos - i0, c = [0, 1, 2].map(j => mix(GLOW[i0][j], GLOW[i1][j], k) | 0);
      const gx = X(.5 + .08 * Math.sin(t * .13)), gy = Y(.5 + .06 * Math.cos(t * .11)), gd = g.createRadialGradient(gx, gy, 0, gx, gy, Math.max(rect.w, rect.h) * .85);
      gd.addColorStop(0, `rgba(${c},${palette.glowAlpha})`); gd.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gd; g.fillRect(0, 0, W, H); }
    const cell = rect.w / C, near = k => clamp(1 - Math.abs(pos - k) * 1.8, 0, 1);
    const a1 = near(1), a34 = Math.max(near(3), near(4)), a4 = clamp(pos - 3.4, 0, 1) * clamp(4.7 - pos, 0, 1) * 1.6;
    if (a1 > .02) for (let k = 0; k < 6; k++) label(SRC_NAME[k], X(CENTRE[k][0]), Y(CENTRE[k][1] - .17), a1, `rgb(${SRC[k]})`, "center");
    if (a34 > .02) { g.globalAlpha = a34 * .9; g.strokeStyle = palette.expected; g.lineWidth = 1.5; g.beginPath();
      for (let i = 0; i <= 80; i++) { const u = i / 80; i ? g.lineTo(X(u), Y(base(u))) : g.moveTo(X(u), Y(base(u))); } g.stroke();
      label("Expected", X(.02), Y(base(.02)) + 22, a34, palette.expected); label("Time →", X(1), Y(.98), a34, palette.quiet, "right"); }
    if (a4 > .02) { label("Actual", X(.6), Y(base(.6) - .16), a4, palette.primary, "right"); label("Waste", X(.9), Y(.3), a4, palette.wasteLabel, "center", SERIF(600, 15)); }
    const i0 = Math.min(5, Math.floor(pos)), i1 = Math.min(5, i0 + 1), frac = pos - i0;
    for (const p of P) { const tt = i1 === i0 ? 0 : ease(clamp(frac - .16 * p.d, 0, 1)), A = at(i0, p, t), B = tt > 0 ? at(i1, p, t) : at(i1, p, t);
      g.globalAlpha = mix(A[4], B[4], tt); g.fillStyle = `rgb(${mix(A[3][0], B[3][0], tt) | 0},${mix(A[3][1], B[3][1], tt) | 0},${mix(A[3][2], B[3][2], tt) | 0})`;
      g.beginPath(); g.arc(X(mix(A[0], B[0], tt)), Y(mix(A[1], B[1], tt)), Math.max(narrow ? 1.1 : 1.5, cell * .5 * mix(A[2], B[2], tt)), 0, 6.2832); g.fill(); }
    const a5 = clamp(pos - 4.5, 0, 1) * 2;
    if (a5 > .02) for (const b of BARS) { const al = clamp(a5, 0, 1), end = X(barW * b.v / 5000);
      label(b.t, X(0), Y(b.y) - 8, al, palette.primary, "left", SERIF(400, narrow ? 13 : 17));
      label("OMR " + Math.round(b.v * al).toLocaleString("en-US"), end + 12, Y(b.y + .078), al, `rgb(${b.c})`, "left", SERIF(600, narrow ? 15 : 20)); }
    g.globalAlpha = 1;
    if (storyIndex === 4 && !flapped) { flapped = true; flap(); } else if (storyIndex !== 4) flapped = false;
  }


  /* ---------- act two: real things ---------- */
  const pinProg = el => clamp((window.scrollY - el.offsetTop) / Math.max(1, el.offsetHeight - window.innerHeight), 0, 1);
  const enter = el => clamp((window.scrollY + window.innerHeight - el.offsetTop) / window.innerHeight, 0, 1);
  const secHow = $("how"), secWhere = $("where");
  function carousel(trackId, indexId, countId, onChange) {
    const track = $(trackId), index = $(indexId), buttons = [...index.querySelectorAll("button")], tools = index.closest(".carousel-tools")!, section = track.closest("section")!;
    const prev = tools.querySelector<HTMLButtonElement>(".previous")!, next = tools.querySelector<HTMLButtonElement>(".next")!, count = $(countId), hint = tools.querySelector<HTMLElement>(".swipe-hint")!;
    let current = 0, scrollFrame = 0, downX = 0, downLeft = 0, dragging = false;
    const isStory = trackId === "storyTrack";
    const go = (i: number) => { const target=clamp(i,0,buttons.length-1); if(isStory && wheelMode){window.scrollTo({top:story.offsetTop+(story.offsetHeight-window.innerHeight)*target/4,behavior:reduced?"auto":"smooth"});return;} track.scrollTo({ left: target * track.clientWidth, behavior: reduced ? "auto" : "smooth" }); };
    const sync = () => { scrollFrame = 0; const i = clamp(Math.round((isStory ? trackPart : track.scrollLeft / Math.max(1, track.clientWidth))), 0, buttons.length - 1); if (i === current) return; current = i;
      buttons.forEach((b,k)=>b.setAttribute("aria-pressed",String(k===i))); count.textContent = `${i+1} / ${buttons.length}`; prev.disabled = i===0; next.disabled = i===buttons.length-1; hint.hidden = true; onChange(i); };
    const onScrollTrack = () => { hint.hidden = true; if (!scrollFrame) scrollFrame = requestAnimationFrame(sync); };
    const key = (e: KeyboardEvent) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); go((isStory&&wheelMode?Math.round(trackPart):current) + (e.key === "ArrowRight" ? 1 : -1)); } };
    const onPrev=()=>go((isStory&&wheelMode?Math.round(trackPart):current)-1), onNext=()=>go((isStory&&wheelMode?Math.round(trackPart):current)+1);
    const down = (e: PointerEvent) => { if (e.pointerType !== "mouse" || (e.target as Element).closest("button")) return; dragging = true; downX=e.clientX; downLeft=track.scrollLeft; track.classList.add("is-dragging"); track.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (dragging) track.scrollLeft = downLeft - (e.clientX-downX); };
    const up = () => { if (!dragging) return; dragging=false; track.classList.remove("is-dragging"); go(Math.round(track.scrollLeft/Math.max(1,track.clientWidth))); };
    const buttonClicks = buttons.map((b,i)=>{const fn=()=>go(i);b.addEventListener("click",fn);return fn;}); prev.addEventListener("click",onPrev); next.addEventListener("click",onNext);
    track.addEventListener("scroll",onScrollTrack,{passive:true}); section.addEventListener("keydown",key); track.addEventListener("pointerdown",down); track.addEventListener("pointermove",move); track.addEventListener("pointerup",up); track.addEventListener("pointercancel",up);
    prev.disabled=true; next.disabled=buttons.length<=1; count.textContent=`1 / ${buttons.length}`;
    onScrollTrack();
    cleanups.push(()=>{ if(scrollFrame)cancelAnimationFrame(scrollFrame); buttons.forEach((b,i)=>b.removeEventListener("click",buttonClicks[i])); prev.removeEventListener("click",onPrev); next.removeEventListener("click",onNext); track.removeEventListener("scroll",onScrollTrack); section.removeEventListener("keydown",key); track.removeEventListener("pointerdown",down); track.removeEventListener("pointermove",move); track.removeEventListener("pointerup",up); track.removeEventListener("pointercancel",up); });
    return { track, go, get index(){return current;} };
  }
  const storyCarousel = carousel("storyTrack","storyIndex","storyCount",i=>{storyIndex=i;if(!raf)raf=requestAnimationFrame(frame);});
  const goStory = (i: number) => storyCarousel.go(i);
  const stepRailButtons = [...storyRail.querySelectorAll<HTMLButtonElement>("button")];
  stepRailButtons.forEach((b,i)=>listen(b,"click",()=>goStory(i)));
  // Settle carries the visitor on in the direction they were scrolling. Snapping to the *nearest* step pulled
  // people back to the step they had just left whenever they paused mid-way, which fought the wheel.
  let settling = false, lastY = window.scrollY, scrollDir = 0;
  const cancelSettle = () => { userCancelSettle = true; settling = false; if (settleTimer) clearTimeout(settleTimer); settleTimer = 0; };
  const scheduleSettle = () => { if (settleTimer) clearTimeout(settleTimer); userCancelSettle = false;
    settleTimer = window.setTimeout(() => { settleTimer = 0; if (!wheelMode || userCancelSettle || reduced) return;
      const top = story.offsetTop, span = story.offsetHeight - window.innerHeight;
      if (window.scrollY < top - 1 || window.scrollY > top + span + 1) return;
      const fraction = trackPart % 1; if (fraction < .02 || fraction > .98) { settling = false; return; }
      const step = clamp(scrollDir >= 0 ? Math.ceil(trackPart - .08) : Math.floor(trackPart + .08), 0, 4);
      settling = true; window.scrollTo({ top: top + span * step / 4, behavior: "smooth" }); }, 180); };
  const storyScroll = () => { const y = window.scrollY; if (!settling && y !== lastY) scrollDir = y > lastY ? 1 : -1; lastY = y;
    if (wheelMode) scheduleSettle(); if (!raf) raf = requestAnimationFrame(frame); };
  const modeChanged = () => { setWheelMode(); if(!wheelMode)storyTrack.scrollLeft=storyIndex*storyTrack.clientWidth; if(!raf)raf=requestAnimationFrame(frame); };
  listen(wheelQuery,"change",modeChanged);
  listen(window,"scroll",storyScroll,{passive:true});
  for(const event of ["wheel","touchstart","keydown"] as const) listen(window,event,cancelSettle,{passive:true});
  const sectorCarousel = carousel("sectorTrack","secIndex","secCount",i=>{showSector(i);});
  const servicesCarousel = carousel("servicesTrack","svcTabs","svcCount",i=>{showSvc(i);});

  // the cycle, drawn
  const NS = "http://www.w3.org/2000/svg", el = (n, a, parent) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); parent && parent.appendChild(e); return e; };
  const polar = (deg, r) => { const a = (deg - 90) * Math.PI / 180; return [250 + r * Math.cos(a), 250 + r * Math.sin(a)]; };
  const wheel = $("wheel"); wheel.textContent = ""; const spin = el("g", {}, wheel), arcs = [], names = [];
  el("circle", { cx: 250, cy: 250, r: 178, fill: "none", stroke: palette.wheelCircle, "stroke-width": 1 }, spin);
  STAGES.forEach((s, i) => { const p1 = polar(i * 60 - 25, 178), p2 = polar(i * 60 + 25, 178);
    arcs.push(el("path", { d: `M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} A 178 178 0 0 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`, fill: "none", "stroke-linecap": "round", "stroke-width": 6, stroke: palette.wheelTrack }, spin));
    const q = polar(i * 60, 222), t = el("text", { "text-anchor": "middle", "dominant-baseline": "central", fill: palette.wheelInactive }, el("g", { transform: `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)})` }, spin)); t.textContent = (i + 1) + " " + s[0]; names.push(t); });
  const wPointer = el("path", { d: "M 250 44 l -7 -12 h 14 z", fill: palette.primary }, wheel);
  const wName = el("text", { x: 250, y: 246, "text-anchor": "middle", class: "name" }, wheel), wOut = el("text", { x: 250, y: 282, "text-anchor": "middle", fill: palette.wheelOutput }, wheel);
  const stBtns = STAGES.map((_, i) => $("st" + (i + 1)));
  let step = -1, rot = 0;
  function showStage(i) { step = i; const s = STAGES[i]; $("cyQ").textContent = s[1]; $("cyB").textContent = s[2]; $("cyO").textContent = "Produces · " + s[3];
    wName.textContent = s[0]; wOut.textContent = i === 5 ? "back into Understand ↻" : "→ " + s[3];
    stBtns.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
    arcs.forEach((a, k) => { a.setAttribute("stroke", k <= i ? `rgb(${ramp(k / 5)})` : palette.wheelTrack); a.setAttribute("stroke-width", k === i ? 14 : 6); });
    names.forEach((n, k) => n.setAttribute("fill", k === i ? palette.primary : k < i ? `rgb(${ramp(k / 5)})` : palette.wheelInactive)); }
  stBtns.forEach((b, i) => listen(b, "click", () => window.scrollTo({ top: secHow.offsetTop + (secHow.offsetHeight - window.innerHeight) * (i + .5) / 6, behavior: reduced ? "auto" : "smooth" })));

  // the sectors, as type
  const SECT = [["Factories", "Cooling, compressed air, process, priced per unit made.", "h01"], ["Hotels & resorts", "Cooling-driven evening peaks, comfort untouched.", "h03"],
    ["Hospitals", "24/7 critical load; savings without touching resilience.", "h05"], ["Data centres", "Mechanical overhead drift, found and priced.", "h10"],
    ["Campuses & schools", "Many buildings, one owner of the bill.", "h11"], ["Oil & gas", "Compression, pumping and utilities on a baseline.", "h06"],
    ["Telecom", "Hundreds of small sites, solar and storage, one view.", "h04"], ["Government", "Audit-ready governance for estates that never switch off.", "h09"]];
  const sectorSlides = [...root.querySelectorAll<HTMLElement>(".sector-slide")];
  let secOn = -1;
  function setSectorPlates(active: number) { sectorSlides.forEach((slide,i)=>{ const key=SECT[i][2]; if(Math.abs(i-active)<=1) { const stops = ["0%", "42%", "70%", "100%"].map((at, j) => `${palette.sectorOverlay[j]} ${at}`).join(", "); slide.style.backgroundImage=`linear-gradient(to top, ${stops}), url("${IMG[key]}")`; } else slide.style.backgroundImage=""; }); }
  function showSector(i: number) { secOn=i; setSectorPlates(i); }

  // the map, as a survey drawing
  const map = $("map"); map.textContent = ""; const BLUE = palette.mapGrid;
  for (let lon = 52; lon <= 60; lon += 2) { const a = proj(lon, 26.6), b = proj(lon, 16.4); el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: BLUE, "stroke-width": .6 }, map); el("text", { x: a[0] + 3, y: a[1] + 10 }, map).textContent = lon + "°E"; }
  for (let lat = 18; lat <= 26; lat += 2) { const a = proj(51.4, lat), b = proj(60.6, lat); el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: BLUE, "stroke-width": .6 }, map); el("text", { x: a[0] + 3, y: a[1] - 4 }, map).textContent = lat + "°N"; }
  const outline = el("path", { d: OMAN_D, fill: palette.mapFill, stroke: palette.mapOutline, "stroke-width": 1.3, "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": reduced ? 0 : 1 }, map);
  const links = el("g", {}, map), siteG = el("g", {}, map), siteEls = [];
  const SP = SITES.map(s => proj(s[1], s[2]));
  SITES.forEach((s, i) => { const [x, y] = SP[i], col = s[6] ? palette.mapWarning : palette.mapNormal, left = s[0] === "Ibri" || s[0] === "Salalah";
    const gq = el("g", { class: "site", tabindex: 0, role: "button", "aria-label": `${s[0]}, ${s[3]}, ${s[4]}`, "aria-pressed": "false" }, siteG);
    el("circle", { cx: x, cy: y, r: 16, fill: "transparent" }, gq); el("circle", { class: "ring", cx: x, cy: y, r: 7, stroke: col }, gq); el("circle", { cx: x, cy: y, r: 4.5, fill: col, stroke: palette.mapRing, "stroke-width": 2 }, gq);
    el("text", { class: "sname", x: x + (left ? -11 : 11), y: y + 4, "text-anchor": left ? "end" : "start" }, gq).textContent = s[0];
    listen(gq, "mouseenter", () => setSite(i)); listen(gq, "click", () => setSite(i)); listen(gq, "keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSite(i); } }); listen(gq, "focus", () => setSite(i)); siteEls.push(gq); });
  const pick = $("sitePick"); pick.textContent = ""; let site = -1;
  SITES.forEach((s, i) => { const b = document.createElement("button"); b.id = "site" + i; b.textContent = s[0]; listen(b, "click", () => setSite(i)); pick.appendChild(b); });
  function setSite(i) { if (i === site) return; site = i; const s = SITES[i]; $("siK").textContent = s[0] + " · " + s[3]; $("siR").textContent = s[4]; $("siN").textContent = s[5];
    [...pick.children].forEach((b, k) => b.setAttribute("aria-pressed", String(k === i))); siteEls.forEach((e, k) => { e.classList.toggle("on", k === i); e.setAttribute("aria-pressed", String(k === i)); });
    links.textContent = ""; SP.forEach((q, k) => { if (k !== i) el("line", { x1: SP[i][0], y1: SP[i][1], x2: q[0], y2: q[1], stroke: palette.mapLink, "stroke-width": .8, "stroke-dasharray": "3 5", opacity: .7 }, links); }); }
  // services, each with its own drawing
  const secSvc = $("services"), svcArts = [0,1,2,3].map(i=>$(`svcArt${i}`));
  let art = svcArts[0];
  const P2 = (fn, x0, x1, n) => { let d = ""; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; d += (i ? " L " : "M ") + x.toFixed(1) + " " + fn(x).toFixed(1); } return d; };
  const ln = (d, col, w, cls, dash) => el("path", Object.assign({ d, fill: "none", stroke: col, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round" }, cls ? { class: cls, pathLength: 1 } : {}, dash ? { "stroke-dasharray": dash } : {}), art);
  const tx = (s, x, y, o) => { const e = el("text", Object.assign({ x, y }, o || {}), art); e.textContent = s; return e; };
  const axes = (yl, xl) => { ln("M 40 30 L 40 320 L 500 320", palette.axes, 1); tx(yl, 46, 40); tx(xl, 500, 338, { "text-anchor": "end" }); };
  const SVC = [
    ["Energy audits", "Three depths. Pick the one that matches the decision in front of you.", "Stage 4 Improve", () => { const c = palette.ramp[0];
      [["Walk-through", "Screen the estate, find the obvious wins", 150, 4], ["Survey & analysis", "Full equipment survey with costed measures", 250, 9], ["Investment-grade", "Capital-decision rigor, measure by measure", 350, 18]].forEach((r, i) => { const y = 78 + i * 104, x0 = 150;
        tx("Depth " + (i + 1), 0, y + 4); tx(r[0], x0, y - 16, { class: "nm" }); ln(`M ${x0} ${y} L ${x0 + r[2]} ${y}`, c, 2 + i * 1.5, "dr");
        for (let k = 0; k < r[3]; k++) { const x = x0 + r[2] * (k + .5) / r[3]; ln(`M ${x.toFixed(1)} ${y + 6} L ${x.toFixed(1)} ${y + 13}`, c, 1).setAttribute("class", "fd"); }
        tx(r[1], x0, y + 32, { class: "fd" }); }); }],
    ["Consulting & Advisory", "Energy strategy, tariff-option analysis, and decarbonization roadmaps grounded in your validated data.", "Stage 4 Improve", () => { const c = palette.ramp[1]; axes("Cost", "Time →");
      const path = (y1) => `M 70 110 C 220 110, 300 ${y1}, 470 ${y1}`;
      ln(path(96), palette.mapText, 1.5, "dr", null); ln(path(170), palette.mapText, 1.5, "dr"); ln(path(250), c, 3.5, "dr");
      el("circle", { cx: 70, cy: 110, r: 5, fill: palette.primary }, art); tx("Today", 70, 92, { "text-anchor": "middle" });
      tx("As is", 478, 100, { class: "fd" }); tx("Option A", 478, 174, { class: "fd" }); tx("Option B", 478, 254, { class: "nm fd" });
      [[250, 163], [360, 232]].forEach(q => el("circle", { cx: q[0], cy: q[1], r: 4, fill: c, class: "fd" }, art)); tx("Roadmap milestones", 250, 206, { class: "fd" }); }],
    ["Measurement & Verification", "IPMVP-aligned savings verification against frozen baselines. Proof the savings are real, signed by qualified professionals.", "Stage 5 Verify", () => { const c = palette.ramp[2]; axes("Energy use", "Time →");
      const bl = x => 120 + 7 * Math.sin(x * .05), ac = x => bl(x) + (x < 250 ? 5 * Math.sin(x * .21) : (1 - Math.exp(-(x - 250) / 45)) * 110 + 5 * Math.sin(x * .21));
      el("path", { d: P2(ac, 250, 480, 46) + " L 480 " + bl(480).toFixed(1) + " " + P2(bl, 480, 250, 46).replace("M", "L") + " Z", fill: palette.savings, class: "fd" }, art);
      ln(P2(bl, 50, 480, 80), palette.baseline, 1.5, null, "5 6"); ln(P2(ac, 50, 480, 120), c, 3, "dr");
      ln("M 250 40 L 250 320", palette.axes, 1, null, "2 5"); tx("Fix", 250, 34, { "text-anchor": "middle" });
      tx("Frozen baseline", 60, 100); tx("Measured", 400, 262, { class: "fd" }); tx("Verified savings", 372, 180, { class: "nm fd", "text-anchor": "middle", fill: palette.verified }); }],
    ["Retro-Commissioning", "Tune existing systems back to how they should run, guided by the platform's diagnostics, with no capital rebuild.", "Stage 4 Improve", () => { const c = palette.ramp[3]; axes("Performance", "Time →");
      const f = x => 180 + (x < 250 ? 62 : 62 * Math.exp(-(x - 250) / 38)) * Math.sin(x * .085) + (x < 250 ? 26 : 26 * Math.exp(-(x - 250) / 38));
      ln("M 50 180 L 480 180", palette.baseline, 1.5, null, "5 6"); ln(P2(f, 50, 480, 140), c, 3, "dr");
      ln("M 250 40 L 250 320", palette.axes, 1, null, "2 5"); tx("Tuned", 250, 34, { "text-anchor": "middle" });
      tx("As designed", 486, 176, { "text-anchor": "end" }); tx("As found", 70, 300, { class: "fd" }); tx("After", 420, 210, { class: "nm fd" }); }]];
  let svcOn = -1;
  function showSvc(i) { svcOn = i; art = svcArts[i]; art.textContent = ""; SVC[i][3](); tx("Schematic", 500, 356, { "text-anchor": "end" }); }
  showStage(0); setSite(0); showSector(0); showSvc(0);

  let raf = 0; // declared before applyTheme, which schedules a frame when it runs
  const themeButton = root.querySelector<HTMLButtonElement>(".theme-toggle");
  function applyTheme(theme: "dark" | "light") {
    palette = PALETTE[theme]; root.dataset.theme = theme;
    themeButton.textContent = theme === "dark" ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    try { localStorage.setItem("df-theme", theme); } catch {}
    SRC = palette.sources.map(rgb); LAYER = rgb(palette.layer); RAMP = palette.ramp.map(rgb); GLOW = palette.glow.map(rgb);
    BARS = BARS.map((bar, i) => ({ ...bar, c: rgb(palette.bars[i]) }));
    showStage(step < 0 ? 0 : step); showSvc(svcOn < 0 ? 0 : svcOn); setSite(site < 0 ? 0 : site);
    wheel.querySelector("circle").setAttribute("stroke", palette.wheelCircle);
    wheel.querySelectorAll("path").forEach((path, i) => { if (i < arcs.length) path.setAttribute("stroke", i <= step ? `rgb(${ramp(i / 5)})` : palette.wheelTrack); });
    wheel.querySelectorAll("g text").forEach((text, i) => text.setAttribute("fill", i === step ? palette.primary : i < step ? `rgb(${ramp(i / 5)})` : palette.wheelInactive));
    // recolour by reference: a ":last-of-type" query would hit the sixth arc, not the pointer
    wPointer.setAttribute("fill", palette.primary); wOut.setAttribute("fill", palette.wheelOutput);
    map.querySelectorAll("line").forEach(line => line.setAttribute("stroke", palette.mapGrid));
    outline.setAttribute("fill", palette.mapFill); outline.setAttribute("stroke", palette.mapOutline);
    map.querySelectorAll(".site").forEach((group, i) => { const col = SITES[i][6] ? palette.mapWarning : palette.mapNormal; group.querySelector(".ring").setAttribute("stroke", col); group.querySelectorAll("circle")[2].setAttribute("fill", col); group.querySelectorAll("circle")[2].setAttribute("stroke", palette.mapRing); });
    links.querySelectorAll("line").forEach(line => line.setAttribute("stroke", palette.mapLink));
    setSectorPlates(secOn < 0 ? 0 : secOn);
    if (!raf) raf = requestAnimationFrame(frame);
  }
  const params = new URLSearchParams(window.location.search), requested = params.get("theme");
  let stored = ""; try { stored = localStorage.getItem("df-theme") || ""; } catch {}
  applyTheme(requested === "light" || requested === "dark" ? requested : stored === "light" || stored === "dark" ? stored : "dark");
  listen(themeButton, "click", () => applyTheme(root.dataset.theme === "light" ? "dark" : "light"));
  listen($("mailCopy"), "click", e => { const b = e.currentTarget, done = () => { b.textContent = "Copied"; timeouts.push(window.setTimeout(() => b.textContent = "Copy", 1600)); };
    const pick = () => { const r = document.createRange(); r.selectNodeContents($("mailAddr")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText("muath@enerlytics.om").then(done, pick); } catch (err) { pick(); } });

  const navEls = [...root.querySelectorAll(".nav a")], keyed = ["what", "how", "who", "where", "services", "trust", "contact"].map(k => [k, $(k)]);
  let lastKey = "";
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const onResize = () => { if (window.innerWidth <= 860 !== (IMG.h01.endsWith("960.webp"))) { for (const id in photos) photos[id].remove(); for (const id in photos) delete photos[id]; plateOn = ""; for (const k in IMG) IMG[k] = `/media/${k}-${window.innerWidth <= 860 ? "960" : "1920"}.webp`; } setSectorPlates(secOn < 0 ? 0 : secOn); [storyCarousel, sectorCarousel, servicesCarousel].forEach(c => { c.track.scrollLeft = c.index * c.track.clientWidth; }); if (!raf) raf = requestAnimationFrame(frame); };
  const onVisibility = () => { if (!document.hidden && !raf) raf = requestAnimationFrame(frame); };
  function frame(ms) {
    raf = 0;
    const t = reduced ? 0 : ms / 1000; dots(t);
    const st = Math.min(5, Math.floor(pinProg(secHow) * 6)); if (st !== step) showStage(st);
    rot = reduced ? -step * 60 : mix(rot, -step * 60, .09); spin.setAttribute("transform", `rotate(${rot.toFixed(2)} 250 250)`); names.forEach(n => n.setAttribute("transform", `rotate(${(-rot).toFixed(2)})`));
    if (!reduced) outline.setAttribute("stroke-dashoffset", (1 - clamp(enter(secWhere) * .7 + pinProg(secWhere) * 1.2, 0, 1)).toFixed(3));
    let key = "what"; for (const [k, e] of keyed) if (e.getBoundingClientRect().top < window.innerHeight * .5) key = k;
    if (key === "story") key = "what";
    if (key !== lastKey) { lastKey = key; navEls.forEach(a => a.dataset.k === key ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")); }
    setPlate(root.dataset.theme === "light" ? "" : key === "how" ? "h06" : key === "contact" ? "h11" : "");
    if (!reduced && !document.hidden) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  listen(window, "scroll", onScroll, { passive: true });
  listen(window, "resize", onResize);
  listen(document, "visibilitychange", onVisibility);
  return () => { cleanups.forEach(fn=>fn()); listenerController.abort(); if(settleTimer)clearTimeout(settleTimer); cancelAnimationFrame(raf); intervals.forEach(clearInterval); timeouts.forEach(clearTimeout); plateTimers.forEach(clearTimeout); photoBox.textContent = ""; wheel.textContent = ""; map.textContent = ""; svcArts.forEach(a=>a.textContent=""); pick.textContent = ""; };
}
