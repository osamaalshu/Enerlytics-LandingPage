import { ArrowDownRight, ArrowUpRight, TriangleAlert, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

type Delta = {
  value: string;
  direction: "up" | "down";
  positive: boolean;
};

type Tile = {
  label: string;
  value: string;
  unit?: string;
  delta?: Delta;
};

const tiles: Tile[] = [
  {
    label: "Current load",
    value: "482",
    unit: "kW",
    delta: { value: "3.1%", direction: "up", positive: false },
  },
  {
    label: "Peak forecast",
    value: "1.2",
    unit: "MW",
    delta: { value: "in 15 min", direction: "up", positive: false },
  },
  {
    label: "CRT surcharge",
    value: "+72",
    unit: "%",
    delta: { value: "vs baseline", direction: "up", positive: false },
  },
  {
    label: "Efficiency",
    value: "94.2",
    unit: "%",
    delta: { value: "1.8%", direction: "up", positive: true },
  },
];

// Synthesized 24-point Actual vs Baseline series (kW)
const actual = [
  280, 290, 305, 295, 310, 340, 380, 430, 470, 510, 540, 560, 580, 590, 600,
  610, 590, 560, 520, 482, 450, 420, 390, 360,
];
const baseline = [
  300, 305, 310, 315, 320, 330, 350, 380, 400, 420, 440, 460, 480, 490, 500,
  500, 490, 470, 450, 430, 410, 395, 380, 360,
];

function buildPath(series: number[], width: number, height: number) {
  const min = Math.min(...series, ...baseline);
  const max = Math.max(...series, ...baseline);
  const range = max - min || 1;
  const stepX = width / (series.length - 1);
  return series
    .map((y, i) => {
      const px = i * stepX;
      const py = height - ((y - min) / range) * height;
      return `${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`;
    })
    .join(" ");
}

interface DashboardMockProps {
  className?: string;
  variant?: "hero" | "framed";
}

export function DashboardMock({
  className,
  variant = "hero",
}: DashboardMockProps) {
  const w = 720;
  const h = 220;
  const actualPath = buildPath(actual, w, h);
  const baselinePath = buildPath(baseline, w, h);
  const areaPath = `${actualPath} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0e1a44] via-[#0a1330] to-[#070d22] text-white shadow-[var(--shadow-soft)]",
        variant === "framed" && "ring-1 ring-navy/5",
        className,
      )}
    >
      {/* Top chrome */}
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] tracking-wide text-white/45">
            app.enerlytics.om/dashboard
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
          </span>
          LIVE
        </span>
      </div>

      <div className="space-y-5 p-5">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tiles.map((t) => (
            <div
              key={t.label}
              className="rounded-2xl border border-white/8 bg-white/[0.04] p-4"
            >
              <p className="eyebrow text-white/45">{t.label}</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="tabular text-[26px] font-bold leading-none">
                  {t.value}
                </span>
                {t.unit && (
                  <span className="text-xs font-medium text-white/55">
                    {t.unit}
                  </span>
                )}
              </div>
              {t.delta && (
                <div
                  className={cn(
                    "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium",
                    t.delta.positive
                      ? "bg-green/15 text-green-soft"
                      : "bg-amber/15 text-amber",
                  )}
                >
                  {t.delta.direction === "up" ? (
                    <ArrowUpRight size={11} />
                  ) : (
                    <ArrowDownRight size={11} />
                  )}
                  {t.delta.value}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chart card */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="eyebrow text-white/45">
                Real-time power · Actual vs Baseline
              </p>
              <p className="mt-1 text-[13px] text-white/65">
                Last 24 hours · TOU bands shown
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full bg-blue" />
                Actual
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-px w-3 bg-white/40" />
                Baseline
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="h-44 w-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>

            {/* horizontal grid */}
            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                x1="0"
                x2={w}
                y1={h * p}
                y2={h * p}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="2 4"
              />
            ))}

            {/* peak window highlight */}
            <rect
              x={(w / 24) * 14}
              y="0"
              width={(w / 24) * 4}
              height={h}
              fill="rgba(245, 158, 11, 0.07)"
            />

            <path d={areaPath} fill="url(#chartFill)" />
            <path
              d={baselinePath}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
            <path
              d={actualPath}
              fill="none"
              stroke="url(#chartStroke)"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* current point */}
            <circle
              cx={(w / 23) * 19}
              cy={h - ((actual[19] - 280) / (610 - 280)) * h}
              r="5"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Peak warning */}
        <div className="flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/[0.08] p-4">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/20 text-amber">
            <TriangleAlert size={16} />
          </span>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-white">
              Peak warning · CRT threshold exceeded
            </p>
            <p className="mt-0.5 text-[12px] text-white/65">
              Predicted load exceeds contractual capacity in 15 minutes.
            </p>
          </div>
          <button
            type="button"
            className="hidden shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-navy hover:bg-white/90 sm:inline-flex"
          >
            <Zap size={12} /> Mitigate
          </button>
        </div>
      </div>
    </div>
  );
}
