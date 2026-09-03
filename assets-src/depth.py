#!/usr/bin/env python3
"""
Depth maps for DepthPlate parallax.

  <venv>/bin/python assets-src/depth.py h01=assets-src/gen/H01_v3.png h04=...

Runs Depth Anything V2 (small) locally on CPU and writes
public/media/<slug>-depth.jpg — a 960-px-wide greyscale map, near = white,
far = black, lightly blurred so the displacement shader never tears on
hard edges. Provenance appended to assets-src/manifest.json.
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from transformers import pipeline

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
OUT = REPO / "public" / "media"
MANIFEST = ROOT / "manifest.json"
MODEL = "depth-anything/Depth-Anything-V2-Small-hf"


def main() -> None:
    pipe = pipeline("depth-estimation", model=MODEL)
    for arg in sys.argv[1:]:
        slug, _, src = arg.partition("=")
        t = time.time()
        img = Image.open(src).convert("RGB")
        w = 960
        img = img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
        depth = np.asarray(pipe(img)["depth"], dtype=np.float32)
        # Depth Anything returns inverse-depth (near = large). Normalise 0..1.
        d = (depth - depth.min()) / max(1e-6, depth.max() - depth.min())
        out = Image.fromarray((d * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(2.2))
        dst = OUT / f"{slug}-depth.jpg"
        out.save(dst, quality=80, optimize=True)
        m = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else []
        m.append({"at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "kind": "depth", "id": slug,
                  "file": str(dst.relative_to(REPO)), "model": MODEL, "source": src,
                  "seconds": round(time.time() - t, 1)})
        MANIFEST.write_text(json.dumps(m, indent=2))
        print(f"{dst.name} {dst.stat().st_size // 1024} KB in {time.time() - t:.0f}s", flush=True)


if __name__ == "__main__":
    main()
