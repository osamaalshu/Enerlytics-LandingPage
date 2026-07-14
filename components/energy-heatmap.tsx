"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";

/**
 * A year of energy at a glance — a GitHub-style calendar where every square is a
 * day and brightness = kilowatt-hours. Weeks run as columns, weekdays as rows,
 * and the months label the x-axis. The Gulf cooling season blazes through
 * summer, weekends read cooler, and a live year-to-date meter keeps ticking.
 * Hovering any day reads out its consumption.
 *
 * Deterministic on a fixed reference year so SSR matches the client; "today" and
 * the live counter only light up after mount.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SEASON = [0.4, 0.42, 0.54, 0.68, 0.84, 0.96, 1.0, 0.99, 0.87, 0.68, 0.5, 0.43];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const REF_YEAR = 2025;
const CELL = 13; // px, includes gap
const DAY_MS = 86400000;

function seeded(m: number, d: number) {
  const x = Math.sin((m + 1) * 928.3 + (d + 1) * 113.7) * 43758.5453;
  return x - Math.floor(x);
}

type Day = { m: number; d: number; v: number; kwh: number; col: number; row: number };

const { DAYS, COLS, MONTH_COLS } = (() => {
  const start = new Date(REF_YEAR, 0, 1);
  const startWeekday = start.getDay(); // 0 Sun
  const days: Day[] = [];
  const t = new Date(start);
  while (t.getFullYear() === REF_YEAR) {
    const m = t.getMonth();
    const d = t.getDate();
    const weekday = t.getDay();
    const dayOfYear = Math.round((t.getTime() - start.getTime()) / DAY_MS);
    const col = Math.floor((dayOfYear + startWeekday) / 7);
    const weekend = weekday === 5 || weekday === 6 ? -0.18 : 0;
    const v = Math.max(0.05, Math.min(1, SEASON[m] + weekend + (seeded(m, d) - 0.5) * 0.2));
    days.push({ m, d, v, kwh: Math.round(1500 + v * 5200), col, row: weekday });
    t.setDate(t.getDate() + 1);
  }
  const cols = Math.max(...days.map((x) => x.col)) + 1;
  const monthCols = MONTHS.map((_, m) => days.find((x) => x.m === m)?.col ?? 0);
  return { DAYS: days, COLS: cols, MONTH_COLS: monthCols };
})();

const colOf = (m: number, d: number) => DAYS.find((x) => x.m === m && x.d === d) ?? null;

const mix = (a: number[], b: number[], t: number) => a.map((c, i) => Math.round(c + (b[i] - c) * t));
const C_LOW = [16, 27, 64];
const C_MID = [37, 99, 235];
const C_HIGH = [245, 158, 11];
function colorFor(v: number) {
  const [r, g, b] = v < 0.55 ? mix(C_LOW, C_MID, v / 0.55) : mix(C_MID, C_HIGH, (v - 0.55) / 0.45);
  return `rgb(${r} ${g} ${b})`;
}
const LEGEND = [0.1, 0.35, 0.55, 0.78, 1];

export function EnergyHeatmap() {
  const [hover, setHover] = useState<Day | null>(null);
  const [today, setToday] = useState<{ col: number; row: number } | null>(null);
  const [ytd, setYtd] = useState<number | null>(null);
  const ytdRef = useRef(0);

  const yearTotal = useMemo(() => DAYS.reduce((s, c) => s + c.kwh, 0), []);

  useEffect(() => {
    const now = new Date();
    const ref = colOf(now.getMonth(), now.getDate());
    if (ref) setToday({ col: ref.col, row: ref.row });

    const passed = DAYS.filter((x) => x.m < now.getMonth() || (x.m === now.getMonth() && x.d <= now.getDate()));
    const sum = passed.reduce((s, c) => s + c.kwh, 0);
    ytdRef.current = sum;
    setYtd(sum);
    const id = setInterval(() => {
      ytdRef.current += Math.round(8 + Math.random() * 22);
      setYtd(ytdRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="year" className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-dotgrid opacity-30" aria-hidden />
      <div className="container-narrow relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow text-blue-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-soft opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-soft" />
            </span>
            Live · year view
          </span>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl">
            A year of energy, in one glance.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/65">
            Every square is a day; the brighter it burns, the more kilowatt-hours
            it drew. The cooling season, the quiet weekends, and the months that
            quietly cost the most — all readable in a single look.
          </p>
        </Reveal>

        <Reveal y={24} duration={0.85} className="mt-10">
          {/* readout + legend */}
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10.5px] tracking-[0.16em] text-white/45">
                {hover ? `${MONTHS[hover.m].toUpperCase()} ${String(hover.d).padStart(2, "0")}` : "YEAR TO DATE"}
              </div>
              <div className="tabular mt-1 font-mono text-3xl font-bold text-white sm:text-4xl">
                {(hover ? hover.kwh : ytd ?? Math.round(yearTotal * 0.5)).toLocaleString("en-US")}
                <span className="ml-1.5 text-base font-medium text-white/45">kWh</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-wide text-white/45">
              <span>LESS</span>
              {LEGEND.map((v) => (
                <span key={v} className="h-3 w-3 rounded-[3px]" style={{ background: colorFor(v) }} />
              ))}
              <span>MORE</span>
            </div>
          </div>

          {/* calendar */}
          <div className="overflow-x-auto pb-2">
            <div className="inline-block">
              {/* x-axis: months */}
              <div className="relative mb-1.5 ml-8 h-4" style={{ width: COLS * CELL }}>
                {MONTHS.map((mo, m) => (
                  <span
                    key={mo}
                    className="absolute font-mono text-[10px] text-white/45"
                    style={{ left: MONTH_COLS[m] * CELL }}
                  >
                    {mo}
                  </span>
                ))}
              </div>

              <div className="flex">
                {/* y-axis: weekdays */}
                <div className="mr-1 flex flex-col" style={{ gap: 3 }}>
                  {WEEKDAYS.map((w, r) => (
                    <span key={r} className="flex items-center font-mono text-[8.5px] text-white/30" style={{ height: 10 }}>
                      {w}
                    </span>
                  ))}
                </div>

                {/* week columns */}
                <div className="flex" style={{ gap: 3 }}>
                  {Array.from({ length: COLS }, (_, col) => (
                    <div key={col} className="flex flex-col" style={{ gap: 3 }}>
                      {Array.from({ length: 7 }, (_, row) => {
                        const cell = DAYS.find((x) => x.col === col && x.row === row);
                        if (!cell) return <span key={row} style={{ width: 10, height: 10 }} />;
                        const isToday = today?.col === col && today?.row === row;
                        const isHover = hover?.m === cell.m && hover?.d === cell.d;
                        return (
                          <span
                            key={row}
                            onMouseEnter={() => setHover(cell)}
                            onMouseLeave={() => setHover(null)}
                            className={`cursor-pointer rounded-[2px] ${isHover ? "ring-2 ring-white" : ""} ${
                              isToday ? "ring-2 ring-green-soft" : ""
                            }`}
                            style={{
                              width: 10,
                              height: 10,
                              background: colorFor(cell.v),
                              boxShadow: isToday ? "0 0 10px rgba(34,197,94,0.85)" : undefined,
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
