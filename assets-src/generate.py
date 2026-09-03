#!/usr/bin/env python3
"""
Enerlytics cinematic asset pipeline — stills, motion, web encodes.

  python3 assets-src/generate.py stills  [--only H01,H04] [--variants N]
  python3 assets-src/generate.py motion  --pick H01=2,H04=1 [--seconds 8]
  python3 assets-src/generate.py encode  [--only H01]

Stills : OpenAI Images (gpt-image-2) from assets-src/shots.json →
         assets-src/gen/<ID>_v<n>.png  (masters, never served)
Motion : OpenAI Videos (sora-2) image-to-video from a chosen still →
         assets-src/gen/<ID>.mp4        (master, never served)
Encode : ffmpeg → public/media/<id>.{webm,mp4}, poster .{avif,webp,jpg}
         desktop 1920w + mobile 960w, targets ≤6 MB / ≤2.5 MB (hero),
         ≤3 MB below the fold.

Every run appends to assets-src/manifest.json (provenance: model, prompt
hash, size, seconds). Nothing here runs at site runtime — outputs are
static files, per the brief (§18: Higgsfield/AI tools are asset
production only, never a runtime dependency).
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
GEN = ROOT / "gen"
PUBLIC_MEDIA = REPO / "public" / "media"
MANIFEST = ROOT / "manifest.json"
SHOTS = json.loads((ROOT / "shots.json").read_text())

API = "https://api.openai.com/v1"
KEY = os.environ.get("OPENAI_API_KEY", "")

SIZE_FOR_ASPECT = {"16:9": "1536x1024", "4:5": "1024x1536", "1:1": "1024x1024"}
# sora-2 accepts these output sizes; the input_reference must match exactly.
VIDEO_SIZE_FOR_ASPECT = {"16:9": "1280x720", "4:5": "720x1280"}


def _headers(json_body: bool = True) -> dict[str, str]:
    if not KEY:
        sys.exit("OPENAI_API_KEY is not set")
    h = {"Authorization": f"Bearer {KEY}"}
    if json_body:
        h["Content-Type"] = "application/json"
    return h


def _post_json(path: str, body: dict) -> dict:
    req = urllib.request.Request(
        f"{API}{path}", data=json.dumps(body).encode(), headers=_headers()
    )
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} on {path}: {e.read().decode()[:600]}")


def _get_json(path: str) -> dict:
    req = urllib.request.Request(f"{API}{path}", headers=_headers(False))
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def _load_manifest() -> list[dict]:
    return json.loads(MANIFEST.read_text()) if MANIFEST.exists() else []


def _record(entry: dict) -> None:
    m = _load_manifest()
    m.append({"at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), **entry})
    MANIFEST.write_text(json.dumps(m, indent=2))


# ----------------------------------------------------------------- stills
def cmd_stills(only: set[str] | None, variants: int | None, model: str) -> None:
    GEN.mkdir(parents=True, exist_ok=True)
    suffix = SHOTS["still_common_suffix"]
    for shot in SHOTS["shots"]:
        if only and shot["id"] not in only:
            continue
        n = variants or shot.get("variants", 1)
        prompt = shot["prompt"] + suffix
        size = SIZE_FOR_ASPECT[shot["aspect"]]
        for v in range(1, n + 1):
            out = GEN / f"{shot['id']}_v{v}.png"
            if out.exists():
                print(f"skip {out.name} (exists)")
                continue
            t = time.time()
            print(f"gen {out.name} …", flush=True)
            d = _post_json(
                "/images/generations",
                {
                    "model": model,
                    "prompt": prompt,
                    "size": size,
                    "quality": "high",
                    "output_format": "png",
                    "n": 1,
                },
            )
            out.write_bytes(base64.b64decode(d["data"][0]["b64_json"]))
            _record(
                {
                    "kind": "still",
                    "id": shot["id"],
                    "variant": v,
                    "file": str(out.relative_to(REPO)),
                    "model": model,
                    "size": size,
                    "prompt_sha256": hashlib.sha256(prompt.encode()).hexdigest()[:16],
                    "chapter": shot["chapter"],
                    "seconds": round(time.time() - t, 1),
                    "usage": d.get("usage"),
                }
            )
            print(f"  ok {out.stat().st_size // 1024} KB in {time.time() - t:.0f}s")


# ----------------------------------------------------------------- motion
def _resize_for_video(src: Path, size: str) -> Path:
    """sora-2 requires input_reference to match the output size exactly."""
    w, h = size.split("x")
    dst = src.with_name(f"{src.stem}_{size}.jpg")
    if not dst.exists():
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(src),
                "-vf", f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}",
                "-q:v", "2", str(dst),
            ],
            check=True,
        )
    return dst


def cmd_motion(picks: dict[str, int], seconds: int, model: str) -> None:
    for shot in SHOTS["shots"]:
        sid = shot["id"]
        if sid not in picks:
            continue
        still = GEN / f"{sid}_v{picks[sid]}.png"
        if not still.exists():
            sys.exit(f"missing still {still}")
        out = GEN / f"{sid}.mp4"
        if out.exists():
            print(f"skip {out.name} (exists)")
            continue
        size = VIDEO_SIZE_FOR_ASPECT[shot["aspect"]]
        ref = _resize_for_video(still, size)
        prompt = (
            f"{shot['motion']} Keep the scene, lighting and every object exactly as in the "
            f"reference image. Photorealistic, no text, no people, no flicker, no camera shake."
        )
        # multipart upload
        boundary = "----enerlytics" + hashlib.md5(str(time.time()).encode()).hexdigest()
        fields = {"model": model, "prompt": prompt, "size": size, "seconds": str(seconds)}
        body = b""
        for k, v in fields.items():
            body += (
                f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n"
            ).encode()
        body += (
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"input_reference\"; "
            f"filename=\"{ref.name}\"\r\nContent-Type: image/jpeg\r\n\r\n"
        ).encode() + ref.read_bytes() + b"\r\n"
        body += f"--{boundary}--\r\n".encode()
        req = urllib.request.Request(
            f"{API}/videos",
            data=body,
            headers={**_headers(False), "Content-Type": f"multipart/form-data; boundary={boundary}"},
        )
        print(f"motion {sid} ({size}, {seconds}s) …", flush=True)
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                job = json.load(r)
        except urllib.error.HTTPError as e:
            sys.exit(f"HTTP {e.code} on /videos: {e.read().decode()[:600]}")
        vid = job["id"]
        t = time.time()
        while job.get("status") not in ("completed", "failed"):
            time.sleep(10)
            job = _get_json(f"/videos/{vid}")
            print(f"  {job.get('status')} {job.get('progress', '')}  {time.time() - t:.0f}s", flush=True)
        if job.get("status") != "completed":
            sys.exit(f"video job failed: {job}")
        req = urllib.request.Request(f"{API}/videos/{vid}/content", headers=_headers(False))
        with urllib.request.urlopen(req, timeout=600) as r:
            out.write_bytes(r.read())
        _record(
            {
                "kind": "motion",
                "id": sid,
                "from_variant": picks[sid],
                "file": str(out.relative_to(REPO)),
                "model": model,
                "size": size,
                "seconds": seconds,
                "prompt_sha256": hashlib.sha256(prompt.encode()).hexdigest()[:16],
                "chapter": shot["chapter"],
                "job": vid,
            }
        )
        print(f"  ok {out.stat().st_size // 1024} KB")


# ----------------------------------------------------------------- encode
def _run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def cmd_encode(only: set[str] | None, picks: dict[str, int]) -> None:
    PUBLIC_MEDIA.mkdir(parents=True, exist_ok=True)
    for shot in SHOTS["shots"]:
        sid = shot["id"]
        if only and sid not in only:
            continue
        slug = sid.lower()
        still = GEN / f"{sid}_v{picks.get(sid, 1)}.png"
        if still.exists():
            # Posters: AVIF + WebP + JPG, 1920w and 960w. sharp is in node_modules.
            for w in (1920, 960):
                for ext, opts in (("avif", "-c:v libaom-av1 -still-picture 1 -crf 28 -b:v 0 -cpu-used 6"),
                                  ("webp", "-c:v libwebp -q:v 72"),
                                  ("jpg", "-q:v 4")):
                    dst = PUBLIC_MEDIA / f"{slug}-{w}.{ext}"
                    _run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(still),
                          "-vf", f"scale={w}:-2", *opts.split(), str(dst)])
            print(f"posters {sid} ok")
        mp4 = GEN / f"{sid}.mp4"
        if mp4.exists():
            for w, tag in ((1920, "desktop"), (960, "mobile")):
                # VP9 two-pass-ish CRF; AV1 is slower to encode, VP9 decodes everywhere modern.
                _run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp4), "-an",
                      "-vf", f"scale={w}:-2", "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0",
                      "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
                      str(PUBLIC_MEDIA / f"{slug}-{tag}.webm")])
                _run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp4), "-an",
                      "-vf", f"scale={w}:-2", "-c:v", "libx264", "-crf", "24", "-preset", "slow",
                      "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                      str(PUBLIC_MEDIA / f"{slug}-{tag}.mp4")])
            print(f"video {sid} ok")
    for p in sorted(PUBLIC_MEDIA.iterdir()):
        print(f"  {p.name:28s} {p.stat().st_size / 1e6:5.2f} MB")


# ----------------------------------------------------------------- main
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["stills", "motion", "encode"])
    ap.add_argument("--only")
    ap.add_argument("--variants", type=int)
    ap.add_argument("--pick", default="", help="H01=2,H04=1")
    ap.add_argument("--seconds", type=int, default=8)
    ap.add_argument("--image-model", default="gpt-image-2")
    ap.add_argument("--video-model", default="sora-2")
    a = ap.parse_args()
    only = set(a.only.split(",")) if a.only else None
    picks = {k: int(v) for k, v in (p.split("=") for p in a.pick.split(",") if p)}
    if a.cmd == "stills":
        cmd_stills(only, a.variants, a.image_model)
    elif a.cmd == "motion":
        cmd_motion(picks, a.seconds, a.video_model)
    else:
        cmd_encode(only, picks)


if __name__ == "__main__":
    main()
