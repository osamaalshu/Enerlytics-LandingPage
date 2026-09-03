"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { VIDEO_IDS } from "@/lib/media";

/**
 * MediaSource — one component for every cinematic plate.
 *
 * Renders the poster first (AVIF → WebP → JPG, 960w for phones, 1920w for
 * desktops) so first paint never waits on video. When `video` is set and the
 * visitor allows motion, a muted, looping, inline video is attached only
 * once the plate is near the viewport, and only on screens ≥ 1024px unless
 * `videoOnMobile` is set. Reduced-motion visitors keep the poster.
 *
 * Files are produced by assets-src/generate.py encode:
 *   /media/<id>-1920.{avif,webp,jpg}  /media/<id>-960.{avif,webp,jpg}
 *   /media/<id>-desktop.{webm,mp4}    /media/<id>-mobile.{webm,mp4}
 * Replace footage by replacing files; no code changes (CINEMATIC_REBUILD.md).
 */
export function MediaSource({
  id,
  alt,
  video = false,
  videoOnMobile = false,
  priority = false,
  drift = false,
  focal = "50% 50%",
  className,
}: {
  id: string;
  alt: string;
  video?: boolean;
  videoOnMobile?: boolean;
  priority?: boolean;
  /** Slow CSS scale drift on the poster (hero only; costs a compositor layer). */
  drift?: boolean;
  /** object-position so mobile crops keep the subject (brief §14). */
  focal?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [wide, setWide] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!video || !VIDEO_IDS.has(id)) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [video]);

  useEffect(() => {
    if (!video || !VIDEO_IDS.has(id) || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "40% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [video]);

  const saveData =
    typeof navigator !== "undefined" &&
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const wantVideo = video && VIDEO_IDS.has(id) && near && !reduced && !saveData && (wide || videoOnMobile);
  const tag = wide ? "desktop" : "mobile";

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden bg-ink", className)}>
      <picture>
        <source
          type="image/avif"
          srcSet={`/media/${id}-960.avif 960w, /media/${id}-1920.avif 1920w`}
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet={`/media/${id}-960.webp 960w, /media/${id}-1920.webp 1920w`}
          sizes="100vw"
        />
        <img
          src={`/media/${id}-1920.jpg`}
          srcSet={`/media/${id}-960.jpg 960w, /media/${id}-1920.jpg 1920w`}
          sizes="100vw"
          alt={alt}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            drift && !reduced && "media-drift",
            playing && "opacity-0",
          )}
          style={{ objectPosition: focal }}
        />
      </picture>
      {wantVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: focal }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onPlaying={() => setPlaying(true)}
          onError={() => setPlaying(false)}
        >
          <source src={`/media/${id}-${tag}.webm`} type="video/webm" />
          <source src={`/media/${id}-${tag}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
