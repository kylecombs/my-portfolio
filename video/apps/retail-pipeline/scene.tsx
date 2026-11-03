// The pipeline diagram, drawn in the config's 3200x1800 viewport. It builds up beat by beat,
// keyed to the clip events in video.config.ts, and stays settled after its last beat.
import { spring } from "remotion";
import type { VideoConfig } from "../../src/types";
import { fontFamily } from "../../src/remotion/template";
import { type Camera, timeline } from "../../src/remotion/timeline";

const ADDED = "#2E8B5E"; // models added on top of the inherited pipeline
const LINE = "#D9D5CC";
const MESSY = "#B5543C";
const MID_Y = 750;
const DOT = "#7B8F87"; // accent at 55% over white
const ADDED_DOT = "#8CBFA6"; // ADDED at 55% over white
/** Content offset; the config's regions include it. */
export const SHIFT_Y = 100;
const DOT_PERIOD = 75; // frames per dot lap; the loop length is a multiple of this

type P = [number, number];

/** Horizontal S-curve from a to b. */
function edge(a: P, b: P) {
  const mx = (a[0] + b[0]) / 2;
  const d = `M${a[0]} ${a[1]} C${mx} ${a[1]} ${mx} ${b[1]} ${b[0]} ${b[1]}`;
  const at = (t: number): P => {
    const u = 1 - t;
    const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return [
      w[0] * a[0] + w[1] * mx + w[2] * mx + w[3] * b[0],
      w[0] * a[1] + w[1] * a[1] + w[2] * b[1] + w[3] * b[1],
    ];
  };
  return { d, at };
}

const SOURCES = ["Shopify", "Amazon", "Meta Ads", "Google Ads", "Bing Ads"].map(
  (name, i) => ({ name, y: 440 + i * 130 })
);
const FIVETRAN = { x: 760, w: 320, h: 120 };
const SNOW = { x: 1260, w: 320, top: 640, bottom: 860 };
const CLEAN = [520, 635, 750, 865, 980].map((y): P => [1800, y]);
const COMBINE = [600, 750, 900].map((y): P => [2020, y]);
const READY = [680, 820].map((y): P => [2320, y]);
const ADDS = [
  {
    at: [2020, 440] as P,
    from: CLEAN[0],
    label: "Merchandising fields",
    above: true,
  },
  {
    at: [2320, 540] as P,
    from: COMBINE[0],
    label: "Wholesale partners",
    above: true,
  },
  {
    at: [2320, 960] as P,
    from: COMBINE[2],
    label: "Repeat purchase & LTV",
    above: false,
  },
];
const PANEL = { x: 2425, y: 550, w: 720, h: 415 }; // the Looker card holding charts and teams
const LOOKER_IN: P = [PANEL.x, MID_Y];
const CARD = { y: 620, w: 210, h: 240, xs: [2450, 2680, 2910] };
const TEAMS = ["Merchandising", "Marketing", "Leadership"];
const FIXES = [
  { messy: ["SKU A-102", "sku a102"], clean: "SKU A-102 ✓" },
  { messy: ["Refund", "Order"], clean: "Refund = Order ✓" },
  { messy: ["Ad click", "Ad click"], clean: "Ad click ×1 ✓" },
];

export function PipelineScene({
  c,
  frame,
  cam,
}: {
  c: VideoConfig;
  frame: number;
  cam: Camera;
}) {
  const t = timeline(c);
  /** Stage frame of `sec` into a beat's clip. */
  const T = (clip: string, sec = 0) => {
    const b = t.beats.find((x) => x.clip === clip)!;
    return b.start + b.frameOf(sec);
  };
  const ev = (clip: string, name: string, offset = 0) =>
    T(clip, c.capture.events[clip][name].t + offset);
  /** 0 -> 1 from stage frame `from`. */
  const p = (from: number, frames = 24) =>
    spring({
      frame: frame - from,
      fps: c.fps,
      config: { damping: 200 },
      durationInFrames: frames,
    });
  const pop = (from: number) => ({
    opacity: p(from, 14),
    transform: `scale(${0.6 + 0.4 * p(from)})`,
    transformBox: "fill-box" as const,
    transformOrigin: "center",
  });

  // Every edge, with when it draws in; dots ride the ones that have finished drawing.
  const edges: { a: P; b: P; from: number; color?: string }[] = [
    ...SOURCES.map((s, i) => ({
      a: [520, s.y + 48] as P,
      b: [FIVETRAN.x, MID_Y] as P,
      from: T("01-sources", 1.0) + i * 3,
    })),
    {
      a: [FIVETRAN.x + FIVETRAN.w, MID_Y],
      b: [SNOW.x, MID_Y],
      from: T("02-ingest", 0.9),
    },
    ...CLEAN.map((n, i) => ({
      a: [SNOW.x + SNOW.w, MID_Y] as P,
      b: n,
      from: T("03-transform", 0.3) + i * 2,
    })),
    ...(
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 2],
        [4, 2],
      ] as const
    ).map(([i, j]) => ({
      a: CLEAN[i],
      b: COMBINE[j],
      from: T("03-transform", 1.0),
    })),
    ...(
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ] as const
    ).map(([i, j]) => ({
      a: COMBINE[i],
      b: READY[j],
      from: T("03-transform", 1.7),
    })),
    ...ADDS.map((n, i) => ({
      a: n.from,
      b: n.at,
      from: T("05-features", 0.3 + i * 0.6),
      color: ADDED,
    })),
    ...[...READY, ADDS[1].at, ADDS[2].at].map((n) => ({
      a: n,
      b: LOOKER_IN,
      from: ev("06-explores", "cards"),
    })),
  ];

  const cardsIn = ev("06-explores", "cards");
  const charts = ev("06-explores", "charts");
  const teams = ev("06-explores", "teams");
  const fixIn = T("04-fixes", 0.2);
  const fixOut = ev("04-fixes", "out");

  return (
    <svg
      width={3200}
      height={1800}
      viewBox={`${-cam.tx / cam.k} ${-cam.ty / cam.k} ${3200 / cam.k} ${1800 / cam.k}`}
      style={{ fontFamily, background: c.colors.surface }}
    >
      {/* Content sits 100px down so the full view is centered vertically. */}
      <g transform={`translate(0 ${SHIFT_Y})`}>
        {edges.map((e, i) => (
          <path
            key={`edge-${i}`}
            d={edge(e.a, e.b).d}
            pathLength={1}
            fill="none"
            stroke={e.color ?? LINE}
            strokeWidth={e.color ? 5 : 4}
            strokeDasharray={1}
            strokeDashoffset={1 - p(e.from, 30)}
          />
        ))}
        {/* Dots after every line, so none passes under one. Opaque, so lines don't show through. */}
        {edges.map((e, i) =>
          p(e.from, 30) > 0.99
            ? [0, 0.5].map((k) => {
                const [x, y] = edge(e.a, e.b).at(
                  ((((frame + i * 17) / DOT_PERIOD + k) % 1) + 1) % 1
                );
                return (
                  <circle
                    key={`dot-${i}-${k}`}
                    cx={x}
                    cy={y}
                    r={8}
                    fill={e.color ? ADDED_DOT : DOT}
                  />
                );
              })
            : null
        )}

        {SOURCES.map((s, i) => (
          <g key={s.name} style={pop(T("01-sources", 0.2) + i * 4)}>
            <rect
              x={120}
              y={s.y}
              width={400}
              height={96}
              rx={18}
              fill={c.colors.background}
              stroke={c.colors.accent}
              strokeWidth={3}
            />
            <text
              x={160}
              y={s.y + 62}
              fontSize={40}
              fontWeight={500}
              fill={c.colors.text}
            >
              {s.name}
            </text>
          </g>
        ))}

        <g style={pop(T("02-ingest", 0.2))}>
          <rect
            x={FIVETRAN.x}
            y={MID_Y - FIVETRAN.h / 2}
            width={FIVETRAN.w}
            height={FIVETRAN.h}
            rx={22}
            fill={c.colors.accent}
          />
          <text
            x={FIVETRAN.x + FIVETRAN.w / 2}
            y={MID_Y + 14}
            fontSize={42}
            fontWeight={600}
            fill="#fff"
            textAnchor="middle"
          >
            Fivetran
          </text>
        </g>

        <g style={pop(T("02-ingest", 0.6))}>
          <path
            d={`M${SNOW.x} ${SNOW.top} V${SNOW.bottom} A${SNOW.w / 2} 36 0 0 0 ${SNOW.x + SNOW.w} ${SNOW.bottom} V${SNOW.top}`}
            fill={c.colors.background}
            stroke={c.colors.accent}
            strokeWidth={4}
          />
          <ellipse
            cx={SNOW.x + SNOW.w / 2}
            cy={SNOW.top}
            rx={SNOW.w / 2}
            ry={36}
            fill={c.colors.surface}
            stroke={c.colors.accent}
            strokeWidth={4}
          />
          <text
            x={SNOW.x + SNOW.w / 2}
            y={MID_Y + 40}
            fontSize={42}
            fontWeight={600}
            fill={c.colors.text}
            textAnchor="middle"
          >
            Snowflake
          </text>
        </g>

        {[
          {
            nodes: CLEAN,
            label: "Clean",
            at: 0.3,
            r: 26,
            fill: c.colors.surface,
          },
          {
            nodes: COMBINE,
            label: "Combine",
            at: 1.0,
            r: 26,
            fill: c.colors.surface,
          },
          {
            nodes: READY,
            label: "Business-ready",
            at: 1.7,
            r: 32,
            fill: c.colors.accent,
          },
        ].map((layer) => (
          <g key={layer.label}>
            {layer.nodes.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={layer.r}
                fill={layer.fill}
                stroke={c.colors.accent}
                strokeWidth={4}
                style={pop(T("03-transform", layer.at) + i * 2)}
              />
            ))}
            <text
              x={layer.nodes[0][0]}
              y={1200}
              fontSize={32}
              fill={c.colors.muted}
              textAnchor="middle"
              opacity={p(T("03-transform", layer.at) + 6)}
            >
              {layer.label}
            </text>
          </g>
        ))}

        {ADDS.map((n, i) => {
          const from = T("05-features", 0.3 + i * 0.6) + 10;
          return (
            <g key={n.label}>
              <circle
                cx={n.at[0]}
                cy={n.at[1]}
                r={30}
                fill={ADDED}
                style={pop(from)}
              />
              <text
                x={n.at[0]}
                y={n.at[1] + (n.above ? -50 : 76)}
                fontSize={30}
                fontWeight={500}
                fill={ADDED}
                textAnchor="middle"
                opacity={p(from + 4)}
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {/* Fixes: each pair of mismatched rows merges into one clean row. Placeholder values only. */}
        {frame >= fixIn && (
          <g opacity={p(fixIn) * (1 - p(fixOut, 14))}>
            <rect
              x={1420}
              y={45}
              width={820}
              height={400}
              rx={24}
              fill={c.colors.surface}
              stroke={LINE}
              strokeWidth={3}
            />
            {FIXES.map((f, i) => {
              const y = 120 + i * 125;
              const m = p(T("04-fixes", 1.6 + i * 0.6), 20);
              return (
                <g key={i}>
                  {f.messy.map((label, k) => {
                    const dy = (k ? 28 : -28) * (1 - m);
                    return (
                      <g
                        key={k}
                        opacity={1 - m}
                        transform={`translate(${m * 300} ${dy})`}
                      >
                        <rect
                          x={1460}
                          y={y - 22}
                          width={250}
                          height={44}
                          rx={10}
                          fill={c.colors.background}
                          stroke={MESSY}
                          strokeWidth={2.5}
                          strokeDasharray={k ? "8 6" : undefined}
                        />
                        <text x={1480} y={y + 10} fontSize={26} fill={MESSY}>
                          {label}
                        </text>
                      </g>
                    );
                  })}
                  <path
                    d={`M1740 ${y} H1820 M1806 ${y - 12} L1822 ${y} L1806 ${y + 12}`}
                    fill="none"
                    stroke={c.colors.muted}
                    strokeWidth={3}
                    opacity={1 - m}
                  />
                  <g opacity={m}>
                    <rect
                      x={1860}
                      y={y - 26}
                      width={340}
                      height={52}
                      rx={12}
                      fill={c.colors.accent}
                    />
                    <text
                      x={1884}
                      y={y + 10}
                      fontSize={28}
                      fontWeight={500}
                      fill="#fff"
                    >
                      {f.clean}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        )}

        {/* Looker: one card with three abstract charts (no axes or numbers), then the teams under them. */}
        <rect
          x={PANEL.x}
          y={PANEL.y}
          width={PANEL.w}
          height={PANEL.h}
          rx={24}
          fill={c.colors.background}
          stroke={LINE}
          strokeWidth={3}
          opacity={p(cardsIn)}
        />
        <text
          x={CARD.xs[0]}
          y={CARD.y - 25}
          fontSize={32}
          fontWeight={600}
          fill={c.colors.text}
          opacity={p(cardsIn)}
        >
          Looker
        </text>
        {CARD.xs.map((x, i) => {
          const q = p(charts + i * 6, 36);
          const pad = 28;
          return (
            <g key={`chart-${i}`} opacity={p(cardsIn + i * 4)}>
              <rect
                x={x}
                y={CARD.y}
                width={CARD.w}
                height={CARD.h}
                rx={18}
                fill={c.colors.surface}
                stroke={LINE}
                strokeWidth={3}
              />
              {i === 0 &&
                [0.45, 0.7, 0.55, 0.85, 1].map((h, k) => {
                  const bh = (CARD.h - 2 * pad) * h * p(charts + k * 3, 24);
                  return (
                    <rect
                      key={k}
                      x={x + pad + 2 + k * 33}
                      y={CARD.y + CARD.h - pad - bh}
                      width={24}
                      height={bh}
                      rx={4}
                      fill={c.colors.accent}
                    />
                  );
                })}
              {i === 1 && (
                <polyline
                  points={[0.25, 0.45, 0.38, 0.72, 0.88]
                    .map(
                      (v, k) =>
                        `${x + pad + k * 39} ${CARD.y + CARD.h - pad - v * (CARD.h - 2 * pad)}`
                    )
                    .join(" ")}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - q}
                  fill="none"
                  stroke={ADDED}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {i === 2 && (
                <g
                  transform={`rotate(-90 ${x + CARD.w / 2} ${CARD.y + CARD.h / 2})`}
                >
                  <circle
                    cx={x + CARD.w / 2}
                    cy={CARD.y + CARD.h / 2}
                    r={66}
                    fill="none"
                    stroke={LINE}
                    strokeWidth={26}
                  />
                  <circle
                    cx={x + CARD.w / 2}
                    cy={CARD.y + CARD.h / 2}
                    r={66}
                    fill="none"
                    stroke={c.colors.accent}
                    strokeWidth={26}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - 0.68 * q}
                  />
                </g>
              )}
            </g>
          );
        })}
        {TEAMS.map((name, i) => {
          const x = CARD.xs[i];
          return (
            <g key={name} style={pop(teams + i * 6)}>
              <rect
                x={x}
                y={880}
                width={CARD.w}
                height={60}
                rx={30}
                fill={c.colors.surface}
                stroke={c.colors.accent}
                strokeWidth={3}
              />
              <text
                x={x + CARD.w / 2}
                y={920}
                fontSize={25}
                fontWeight={500}
                fill={c.colors.text}
                textAnchor="middle"
              >
                {name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
