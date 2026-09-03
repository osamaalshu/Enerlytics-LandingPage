# Enerlytics — the film. Creative treatment v2 (CMO cut)

Founder verdict on v1: 5.5/10. "One image is not cinema. Don't mirror the MVP. Sell the vision to
investors and clients. Look at how neat film sites are." This is the answer.

## Who we are talking to, and what they must feel

| Reader | What they must believe after one scroll |
|---|---|
| Facility owner / CFO | My energy is a large cost I cannot see, and these people can make it visible, priced and provable. |
| Investor | This is the operating intelligence layer for physical energy in the Gulf: a category, a local wedge (tariff + solar), a model that compounds (the cycle), and a team that can execute. |
| Engineer | Serious, physical, honest. Not an AI dashboard demo. |

## The one line

**The operating intelligence layer for physical energy.**
(Vision-level category. Everything else on the site earns this.)

## Message discipline

- Speak in **systems, not parts**: *cooling, electrical, process loads, solar, storage, grid.* Never
  chillers / compressors / AHUs / pumps / approach temperature on the marketing site.
- **One idea per frame.** A chapter is a plate, a title, at most three short lines.
- **Numbers are cinema, not dashboards.** One money figure per chapter, at most.
- **Investor arc is explicit**: why now (I), what we see (II–III), how it pays (IV), where it goes
  (V), why it's defensible (VI), how big (VII), who (VIII).

## The film — eight chapters

| # | Title card | Plate | The statement | Device |
|---|---|---|---|---|
| 00 | *cold open* | black → H09 tower | *The largest cost in your facility is the one nobody can see.* → **Watch your facility spend in real time.** | letterbox, text on black, plate fades in beneath, depth parallax |
| I | THE COST YOU CANNOT SEE | H09 / black | Tariff reform priced every hour differently. The sun made every roof a power plant. Reporting became law. *The energy bill stopped being a bill.* | three lines of large type, staggered on scroll |
| II | SEE IT | H01 site (depth) | Your facility, made legible. Cooling. Electrical. Solar. Storage. Grid. One live picture. | "SEE IT" as an image-filled word, then anchored instruments |
| III | UNDERSTAND IT | H10 meter macro | It knows what normal looks like — for your site, your climate, your tariff. Then it sees what is wrong. | one baseline-vs-actual line drawn on scroll; the cycle ring as a compact aside |
| IV | PRICE IT | H03 cooling plant | A fault is not an alert. It is money leaving. *OMR 340 a month* → cause → action → verified. | amber, once |
| V | CONTROL IT | H04 → H05 | Solar, storage, load and grid, one decision every fifteen minutes. | pinned scene, energy flow (labels: Solar · Storage · Facility · Grid) |
| VI | PROVE IT | H07 engineer | The analysis is software. The judgment is human. Every saving verified, every finding signed. | split reveal |
| VII | EVERY FACILITY | H06 pullback | Factories. Hotels. Hospitals. Data centres. Campuses. Oil & gas. One site, then every site. | typographic list, no cards |
| VIII | THE COMPANY | H11 dawn | *We are building the operating layer for physical energy in the Gulf.* Team, partners, engagement, demo. | quiet, light, the form |

## Cinematic grammar (what changes vs v1)

1. **Depth.** Every plate gets a depth map (Depth Anything V2, run locally) and renders through a
   small WebGL displacement shader: the scene shifts in true parallax with scroll and pointer.
   Still image + poster fallback on reduced motion / low-power / no WebGL.
2. **Title cards.** Each chapter opens on black with a roman numeral and one line, letterboxed,
   ~60 vh of scroll. The film structure *is* the navigation.
3. **Type as image.** Chapter II's title is filled with the plate (background-clip: text).
4. **Masked transitions.** Plates arrive through a scroll-linked clip-path reveal, not a cut.
5. **Vignette + grain + letterbox bars** on every plate; bars recede when copy lands.
6. **Scale.** Display type 96–140 px on desktop, Satoshi 900, tracking −0.04em. Body ≤ 3 lines.
7. **Chrome disappears.** Nav is a wordmark and one button; chapter index appears on scroll.
8. **Fewer instruments.** Asset graph → gone. Dashboards → gone. One EnergyFlow, one money line,
   one anomaly ladder.

## Still missing after this cut (needs money or a login)

- **Motion footage.** OpenAI API has zero credits (sora-2 refused). ~USD 20 unblocks 6 clips.
  Higgsfield clips from `assets-src/PROMPTS_FOR_CHATGPT.md` work the same way.
- **Sound.** None by design (brief: never autoplay audio).
