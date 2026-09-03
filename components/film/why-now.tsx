"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChapterMarker } from "@/components/film/chapter-marker";
import { InView } from "@/components/cinematic/in-view";

/**
 * I · The cost you cannot see — the year view, in money.
 *
 * The original site's calendar: every square is a day, weeks run as
 * columns, weekdays as rows, and the colour burns from navy through blue to
 * amber as the day costs more. Under the cost-reflective tariff the summer
 * cooling season lights up — not only because the facility uses more, but
 * because those hours are priced higher. A live year-to-date meter ticks.
 * Deterministic on a fixed reference year so SSR matches the client.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SEASON = [0.4, 0.42, 0.54, 0.68, 0.84, 0.96, 1.0, 0.99, 0.87, 0.68, 0.5, 0.43];
// Summer weekdays carry the day-peak band → the same kWh costs more.
const TARIFF = [1, 1, 1, 1, 1.35, 1.45, 1.5, 1.5, 1.35, 1, 1, 1];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const REF_YEAR = 2025;
const CELL = 16;
const SQ = 12;
const GAP = CELL - SQ;
const DAY_MS = 86400000;

function seeded(m: number, d: number) {
  const x = Math.sin((m + 1) * 928.3 + (d + 1) * 113.7) * 43758.5453;
  return x - Math.floor(x);
}

type Day = { m: number; d: number; v: number; kwh: number; omr: number; col: number; row: number };

const { DAYS, COLS, MONTH_COLS, MAX_OMR } = (() => {
  const start = new Date(REF_YEAR, 0, 1);
  const startWeekday = start.getDay();
  const days: Day[] = [];
  const t = new Date(start);
  while (t.getFullYear() === REF_YEAR) {
    const m = t.getMonth();
    const d = t.getDate();
    const weekday = t.getDay();
    const dayOfYear = Math.round((t.getTime() - start.getTime()) / DAY_MS);
    const col = Math.floor((dayOfYear + startWeekday) / 7);
    const weekend = weekday === 5 || weekday === 6;
    const load = Math.max(0.05, Math.min(1, SEASON[m] + (weekend ? -0.18 : 0) + (seeded(m, d) - 0.5) * 0.2));
    const kwh = Math.round(1500 + load * 5200);
    const omr = Math.round(kwh * 0.028 * (weekend ? 1 : TARIFF[m]));
    days.push({ m, d, v: 0, kwh, omr, col, row: weekday });
    t.setDate(t.getDate() + 1);
  }
  const max = Math.max(...days.map((x) => x.omr));
  const min = Math.min(...days.map((x) => x.omr));
  for (const x of days) x.v = (x.omr - min) / (max - min);
  const cols = Math.max(...days.map((x) => x.col)) + 1;
  const monthCols = MONTHS.map((_, m) => days.find((x) => x.m === m)?.col ?? 0);
  return { DAYS: days, COLS: cols, MONTH_COLS: monthCols, MAX_OMR: max };
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

function YearCalendar() {
  const [hover, setHover] = useState<Day | null>(null);
  const [today, setToday] = useState<{ col: number; row: number } | null>(null);
  const [ytd, setYtd] = useState<number | null>(null);
  const ytdRef = useRef(0);
  const yearTotal = useMemo(() => DAYS.reduce((s, c) => s + c.omr, 0), []);

  useEffect(() => {
    const now = new Date();
    const ref = colOf(now.getMonth(), now.getDate());
    if (ref) setToday({ col: ref.col, row: ref.row });
    const passed = DAYS.filter((x) => x.m < now.getMonth() || (x.m === now.getMonth() && x.d <= now.getDate()));
    ytdRef.current = passed.reduce((s, c) => s + c.omr, 0);
    setYtd(ytdRef.current);
    const id = setInterval(() => {
      ytdRef.current += Math.round(1 + Math.random() * 3) / 10;
      setYtd(ytdRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-navy/60 p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="instrument text-white/55">
            {hover ? `${MONTHS[hover.m].toUpperCase()} ${String(hover.d).padStart(2, "0")} · ${hover.kwh.toLocaleString("en-US")} kWh` : "SPENT ON POWER · YEAR TO DATE"}
          </div>
          <div className="tabular mt-1 font-mono text-3xl font-bold text-white sm:text-4xl">
            <span className="text-white/45">OMR </span>
            {(hover ? hover.omr : Math.round(ytd ?? yearTotal * 0.5)).toLocaleString("en-US")}
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-wide text-white/50">
          <span>LESS</span>
          {LEGEND.map((v) => (
            <span key={v} className="h-3 w-3 rounded-[3px]" style={{ background: colorFor(v) }} />
          ))}
          <span>MORE</span>
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto pb-2">
        <div className="inline-block">
          <div className="relative mb-1.5 ml-8 h-4" style={{ width: COLS * CELL }}>
            {MONTHS.map((mo, m) => (
              <span key={mo} className="absolute font-mono text-[10px] text-white/50" style={{ left: MONTH_COLS[m] * CELL }}>{mo}</span>
            ))}
          </div>
          <div className="flex">
            <div className="mr-1 flex flex-col" style={{ gap: GAP }}>
              {WEEKDAYS.map((w, r) => (
                <span key={r} className="flex items-center font-mono text-[8.5px] text-white/35" style={{ height: SQ }}>{w}</span>
              ))}
            </div>
            <div className="flex" style={{ gap: GAP }} role="img" aria-label="A year of daily electricity cost. The summer cooling season burns amber: more energy, at a higher price.">
              {Array.from({ length: COLS }, (_, col) => (
                <div key={col} className="flex flex-col" style={{ gap: GAP }}>
                  {Array.from({ length: 7 }, (_, row) => {
                    const cell = DAYS.find((x) => x.col === col && x.row === row);
                    if (!cell) return <span key={row} style={{ width: SQ, height: SQ }} />;
                    const isToday = today?.col === col && today?.row === row;
                    const isHover = hover?.m === cell.m && hover?.d === cell.d;
                    return (
                      <span
                        key={row}
                        onMouseEnter={() => setHover(cell)}
                        onMouseLeave={() => setHover(null)}
                        className={`cursor-pointer rounded-[2px] ${isHover ? "ring-2 ring-white" : ""} ${isToday ? "ring-2 ring-green-soft" : ""}`}
                        style={{ width: SQ, height: SQ, background: colorFor(cell.v), boxShadow: isToday ? "0 0 10px rgba(34,197,94,0.85)" : undefined }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="instrument mt-3 text-[9px] text-white/40">Illustrative facility · summer weekdays priced at the day-peak band · peak day OMR {MAX_OMR.toLocaleString("en-US")}</p>
    </div>
  );
}

export function WhyNow() {
  const summer = DAYS.filter((x) => x.m >= 4 && x.m <= 8).reduce((s, c) => s + c.omr, 0);
  const total = DAYS.reduce((s, c) => s + c.omr, 0);
  return (
    <>
      <ChapterMarker id="why" numeral="I" title="The cost you cannot see." line="One facility, one year, one square per day. The invoice shows a total. This is where it goes." />
      <section className="relative bg-ink pb-24 text-white sm:pb-32" aria-labelledby="why-title">
        <div className="container-narrow">
          <InView className="max-w-3xl">
            <h3 id="why-title" className="text-balance text-[40px] font-black leading-[0.94] tracking-[-0.04em] sm:text-[56px] lg:text-[72px]">
              Summer is not a season. It is a bill.
            </h3>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/68">
              Cooling load climbs through the hot months — and since the tariff reform, those are also the
              months and hours that are priced highest. Two curves multiply. A facility&apos;s year concentrates
              into one burning block nobody sees until the invoice.
            </p>
          </InView>
          <InView delay={0.1} className="mt-12"><YearCalendar /></InView>
          <InView delay={0.15} className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              ["May to September", `${Math.round((summer / total) * 100)} %`, "of the year's electricity cost"],
              ["Same five months", "42 %", "of the year's days"],
              ["Summer weekday, day-peak band", "×3", "the off-peak price per kWh"],
            ].map(([k, v, n]) => (
              <div key={k} className="bg-navy px-5 py-4">
                <p className="instrument text-[9px] text-white/60">{k}</p>
                <p className="tabular mt-1 font-mono text-[26px] font-semibold text-amber">{v}</p>
                <p className="font-mono text-[10px] text-white/50">{n}</p>
              </div>
            ))}
          </InView>
        </div>
      </section>
    </>
  );
}
