// Poster encoder: master PNG/JPG → public/media/<slug>-{1920,960}.{avif,webp,jpg}
// Usage: node assets-src/encode_images.mjs <slug> <source> [more slug source pairs…]
// Uses sharp (already in node_modules via Next) because the system ffmpeg
// lacks libwebp/libaom.
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(repo, "public/media");
mkdirSync(out, { recursive: true });

const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2) {
  console.error("usage: encode_images.mjs <slug> <source> [...]");
  process.exit(1);
}

for (let i = 0; i < args.length; i += 2) {
  const [slug, src] = [args[i], resolve(args[i + 1])];
  for (const w of [1920, 960]) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: false, kernel: "lanczos3" });
    const targets = [
      ["avif", (s) => s.avif({ quality: w === 1920 ? 52 : 50, effort: 6 })],
      ["webp", (s) => s.webp({ quality: 74 })],
      ["jpg", (s) => s.jpeg({ quality: 78, mozjpeg: true })],
    ];
    for (const [ext, fn] of targets) {
      const dst = `${out}/${slug}-${w}.${ext}`;
      await fn(base.clone()).toFile(dst);
      console.log(`${slug}-${w}.${ext}`.padEnd(22), (statSync(dst).size / 1024).toFixed(0).padStart(5), "KB");
    }
  }
}
