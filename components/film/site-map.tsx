"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { OMAN_PATH, UAE_PATH, MAP_W, MAP_H, proj } from "@/lib/gulf-map";
import { StateChip } from "@/components/cinematic/metric-overlay";
import { cn } from "@/lib/cn";

/**
 * SiteMap — assets in different places, on one map.
 *
 * A quiet outline of Oman (UAE faint for context), sites as lit points,
 * each with its type, its reading and its state. Hover or tap a site to
 * read it; the panel shows the portfolio total. Used by Control it (solar +
 * storage across sites) and Every facility (every sector, one model).
 * All sites and readings are illustrative.
 */
export type Site = {
  name: string;
  lon: number;
  lat: number;
  kind: string;
  read: string;
  note?: string;
  state: React.ComponentProps<typeof StateChip>["state"];
};

export function SiteMap({
  sites,
  title,
  total,
  className,
}: {
  sites: Site[];
  title: string;
  total: { label: string; value: string; note?: string }[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const s = sites[active];
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10", className)}>
      <div className="relative rounded-2xl border border-white/10 bg-navy/50 p-3">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${title}: ${sites.length} sites across Oman`}>
          <defs>
            <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.08)" />
            </pattern>
            <clipPath id="oman"><path d={OMAN_PATH} /></clipPath>
          </defs>
          <path d={UAE_PATH} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          <rect width={MAP_W} height={MAP_H} fill="url(#dots)" clipPath="url(#oman)" />
          <path d={OMAN_PATH} fill="rgba(52,160,164,0.06)" stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} strokeLinejoin="round" />
          {/* links: every site to the active one — one model */}
          {sites.map((t, i) => {
            if (i === active) return null;
            const [x1, y1] = proj(s.lon, s.lat);
            const [x2, y2] = proj(t.lon, t.lat);
            return <line key={t.name} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(52,160,164,0.25)" strokeWidth={1} strokeDasharray="3 5" />;
          })}
          {sites.map((t, i) => {
            const [x, y] = proj(t.lon, t.lat);
            const on = i === active;
            const warn = t.state === "WARNING" || t.state === "FAULT";
            return (
              <g key={t.name} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} className="cursor-pointer" role="button" aria-label={`${t.name} — ${t.kind}, ${t.read}`}>
                {!reduced && on && (
                  <motion.circle cx={x} cy={y} r={8} fill="none" stroke={warn ? "#ef4444" : "#34a0a4"} initial={{ r: 8, opacity: 0.8 }} animate={{ r: 26, opacity: 0 }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />
                )}
                <circle cx={x} cy={y} r={14} fill="transparent" />
                <circle cx={x} cy={y} r={on ? 6 : 4} fill={warn ? "#ef4444" : "#34a0a4"} stroke="#06090f" strokeWidth={2} />
                <text x={x + 11} y={y + 4} className="fill-white font-mono" fontSize="11" fontWeight={on ? 700 : 400} opacity={on ? 1 : 0.7}>{t.name}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-col">
        <p className="instrument text-white/55">{title}</p>
        <motion.div key={s.name} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-4 rounded-2xl border border-white/12 bg-ink/70 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[24px] font-bold tracking-tight">{s.name}</p>
              <p className="font-mono text-[11px] tracking-wide text-white/55">{s.kind}</p>
            </div>
            <StateChip state={s.state} />
          </div>
          <p className="tabular mt-4 font-mono text-[30px] font-semibold leading-none">{s.read}</p>
          {s.note && <p className="mt-1.5 font-mono text-[11px] text-white/55">{s.note}</p>}
        </motion.div>
        <ul className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
          {total.map((t) => (
            <li key={t.label} className="bg-navy px-4 py-3">
              <p className="instrument text-[9px] text-white/60">{t.label}</p>
              <p className="tabular mt-1 font-mono text-[18px] font-semibold">{t.value}</p>
              {t.note && <p className="font-mono text-[9.5px] text-white/50">{t.note}</p>}
            </li>
          ))}
        </ul>
        <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Sites">
          {sites.map((t, i) => (
            <li key={t.name}>
              <button type="button" onClick={() => setActive(i)} aria-pressed={i === active}
                className={cn("instrument rounded-full border px-2.5 py-1 text-[9.5px] transition-colors", i === active ? "border-teal-soft bg-teal/20 text-white" : "border-white/15 text-white/55 hover:text-white")}>
                {t.name}
              </button>
            </li>
          ))}
        </ol>
        <p className="instrument mt-4 text-[9px] text-white/40">Illustrative portfolio · sites and readings are examples</p>
      </div>
    </div>
  );
}
