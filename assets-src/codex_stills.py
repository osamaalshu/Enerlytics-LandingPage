#!/usr/bin/env python3
"""
Generate stills through the Codex CLI (ChatGPT login, no API credits).

  python3 assets-src/codex_stills.py H01:4 H04:3      # id:variants ...

Each image is one `codex exec` call with the visual-bible preamble + shot
prompt from shots.json. Outputs land in assets-src/gen/<ID>_v<n>.png and
are recorded in assets-src/manifest.json with provenance. Masters only —
public/media/ is produced by generate.py encode.
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
GEN = ROOT / "gen"
MANIFEST = ROOT / "manifest.json"
SHOTS = json.loads((ROOT / "shots.json").read_text())
BY_ID = {s["id"]: s for s in SHOTS["shots"]}

PREAMBLE = (
    "Photorealistic still, shot on a full-frame cinema camera. One consistent location "
    "reused across all shots: an industrial facility on flat interior desert in Oman at blue "
    "hour (15-25 minutes after sunset). Natural, physically plausible lighting; real-world "
    "texture (a film of dust on metal, sand, concrete). Neutral-dark colour grade: deep "
    "graphite-blue sky (not saturated electric blue), desaturated sand, restrained warm "
    "practical lights, no bloom. Keep one third of the frame as quiet dark negative space for "
    "typography. No people, no text, no signage, no logos, no watermark, no lens flare, no "
    "glowing lines, no holograms, no sci-fi."
)


def record(entry: dict) -> None:
    m = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else []
    m.append({"at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), **entry})
    MANIFEST.write_text(json.dumps(m, indent=2))


def gen_one(sid: str, v: int) -> None:
    shot = BY_ID[sid]
    out = GEN / f"{sid}_v{v}.png"
    if out.exists():
        print(f"skip {out.name}", flush=True)
        return
    aspect = "landscape 16:9" if shot["aspect"] == "16:9" else "portrait 4:5"
    prompt = f"{PREAMBLE} {aspect}. {shot['prompt']}"
    task = (
        f"Generate ONE image with your image-generation tool at the highest resolution "
        f"available, {aspect}, and save it as ./{out.name} in the current directory. "
        f"Do not write any other file. Do not add text to the image. Image prompt:\n\n{prompt}"
    )
    t = time.time()
    print(f"gen {out.name} …", flush=True)
    try:
        r = subprocess.run(
            ["codex", "exec", "--skip-git-repo-check", "--sandbox", "workspace-write", task],
            cwd=GEN, capture_output=True, text=True, timeout=420,
        )
    except subprocess.TimeoutExpired:
        # The image tool stalls indefinitely on some prompts (observed: anything
        # with a person, even a gloved hand). Skip and move on; do not block the batch.
        print(f"  TIMEOUT {out.name} — skipped", flush=True)
        return
    if not out.exists():
        print(f"  FAILED {out.name}\n{r.stdout[-800:]}\n{r.stderr[-400:]}", flush=True)
        return
    record({
        "kind": "still", "id": sid, "variant": v,
        "file": str(out.relative_to(REPO)), "model": "codex-cli image tool (ChatGPT)",
        "aspect": shot["aspect"], "prompt_sha256": hashlib.sha256(prompt.encode()).hexdigest()[:16],
        "chapter": shot["chapter"], "seconds": round(time.time() - t, 1),
        "bytes": out.stat().st_size,
    })
    print(f"  ok {out.stat().st_size // 1024} KB in {time.time() - t:.0f}s", flush=True)


def main() -> None:
    GEN.mkdir(parents=True, exist_ok=True)
    for arg in sys.argv[1:]:
        sid, _, n = arg.partition(":")
        for v in range(1, int(n or BY_ID[sid].get("variants", 1)) + 1):
            gen_one(sid, v)


if __name__ == "__main__":
    main()
