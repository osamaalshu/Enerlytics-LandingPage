/**
 * Plates that have motion clips in public/media/ (<id>-desktop.webm etc.).
 * Kept explicit so a chapter never requests a clip that does not exist yet:
 * add the id here after `python3 assets-src/generate.py encode` produces it.
 * Until then every plate is a still with the CSS drift (see MediaSource).
 */
export const VIDEO_IDS: ReadonlySet<string> = new Set<string>([]);
