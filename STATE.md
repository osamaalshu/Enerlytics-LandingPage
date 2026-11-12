# STATE — enerlytics-lp-redesign

## Last run
2026-11-11 · **The data film** — founder-directed redesign replacing the home page (see CHANGES.log). Gates: tsc clean ·
next build clean · browser 1360/390 px 0 errors · verifier PASS 10/10. Shipped on the founder's "go live".

## In progress
Nothing on the site. Waiting on the founder for: `RESEND_API_KEY` in Netlify (enquiry emails), real footage decision.

## Done
- 11-chapter cinematic narrative, reusable motion/media primitives (components/cinematic/).
- Shot library: 15 stills via Codex CLI image tool; 7 plates encoded to public/media (1.8 MB).
- Truth pass against docs/business_model/02_CLAIMS_REGISTER.md and founder site laws.
- Pre-existing prod hydration bug in the cycle ring fixed (rounded path coordinates).

## Escalated (founder decisions)
1. **Motion clips** — OpenAI API has zero credits. ~USD 20 of credit lets `generate.py motion` run
   sora-2 on the 6 chosen stills (8 s each), then `encode` + list ids in lib/media.ts. Alternative:
   Higgsfield clips from PROMPTS_FOR_CHATGPT.md dropped into assets-src/gen/<ID>.mp4.
2. **"Pilot deployment underway · OQ Accelerator"** line was removed from the contact block
   (pilot wording must come from the source of truth). Restore if the wording is current.
3. **Hero frame** — H01_v3 chosen; v2 and v4 are in assets-src/gen/ if he prefers another.

## Lessons
- Codex CLI image tool stalls (never returns) on any prompt with a human element, even a gloved hand. The engineer
  shot (H07) needs Sora/Higgsfield or a real photo; the generator now skips stalled shots after 420 s.
- After ~20 images in one session the tool also stalled on a people-free prompt (H08) — likely a rate limit.
  Retry H07/H08 in a later session; 'Prove it' uses the switchgear room (h02) meanwhile.
- Codex CLI's image tool works with the ChatGPT login and needs no API credits; it does not do video.
- `<span>` inside SVG `<text>` silently drops the number AND breaks hydration — use `<tspan>` + animate.
- Tailwind `relative` + `absolute` on the same element: `relative` wins → zero-height plate. Never both.
- ffmpeg here lacks libwebp/libaom; sharp (already in node_modules) is the poster encoder.
- `next lint` is interactive without an ESLint config; `tsc --noEmit` + `next build` are the gates.
- Floating-point SVG path strings differ server vs client → round coordinates.

## Next immediate step
Founder adds `RESEND_API_KEY` (and optionally `ENQUIRY_FROM`) in Netlify → redeploy → send one test enquiry and confirm it
arrives at muath@enerlytics.om. Then decide on real footage and whether the team section returns.

Earlier (2026-09):

Footage: top up OpenAI credit (~USD 20) or export Higgsfield clips from assets-src/PROMPTS_FOR_CHATGPT.md, then `generate.py motion` → `encode`, list ids in lib/media.ts, PR. Also: retry the engineer plate (H07) in a fresh Codex session.

Earlier: Merge PR #7 (founder or Osama). After merge: confirm the Netlify deploy state via api.netlify.com/api/v1/sites/af712a52-80f4-4ed3-b130-52b8d3115d32/deploys, then open enerlytics.om on a phone. Then footage.

Earlier: v4 running locally: heat map (I), drift chart (IV), site map (V + VII), defensibility columns (VIII).
Founder scores it; if it clears → commit + PR. Footage still the last lever (USD ~20 OpenAI credit or Higgsfield).

Earlier: Founder reviews v2 at http://localhost:3000 and scores it. If it clears, commit + PR. Motion clips still need
USD ~20 of OpenAI credit (or Higgsfield clips) — the one thing left between this and a 9.

Previous: Founder opens http://localhost:3000 (or `npm run build && npm start` on the branch), reviews, and
says commit/PR — or picks a different hero frame. Then top up OpenAI credits for motion.
