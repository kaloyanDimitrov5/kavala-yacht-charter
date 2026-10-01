"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CaretDown, PencilSimpleLine } from "@phosphor-icons/react";
import type { RouteId } from "@/config/site";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/*
 * Positions come from real coordinates, projected as x = (lon − 23.2) × 200, y = (41.1 − lat) × 200.
 * No coastline is drawn, so nothing about the shape of the land is invented.
 */
const W = 520;
const H = 500;
const KAVALA = { x: 242, y: 32 };

type Geo = {
  x: number;
  y: number;
  /** SVG path from Kavala to the island */
  d: string;
  /** Label placement */
  label: { x: number; y: number; align: "left" | "center" | "right" };
  /** Elbow leader from dot to label, for the tight Sporades cluster */
  leader?: number;
};

const K = `M${KAVALA.x} ${KAVALA.y}`;
/** Sporades routes share one trunk that passes east of Mount Athos, then fan out to each island. */
const TRUNK = `${K} C300 100 312 170 280 226`;
const branch = (x: number, y: number) => `${TRUNK} Q${Math.round((280 + x) / 2 + 30)} ${Math.round((226 + y) / 2 - 24)} ${x} ${y}`;

const geo: Record<RouteId, Geo> = {
  thasos: { x: 290, y: 84, d: `${K} Q284 42 290 84`, label: { x: 302, y: 84, align: "left" } },
  samothraki: { x: 466, y: 126, d: `${K} Q380 58 466 126`, label: { x: 466, y: 150, align: "center" } },
  "kyra-panagia": { x: 174, y: 356, d: branch(174, 356), label: { x: 236, y: 404, align: "left" }, leader: 404 },
  alonissos: { x: 134, y: 390, d: branch(134, 390), label: { x: 236, y: 430, align: "left" }, leader: 430 },
  skopelos: { x: 104, y: 396, d: branch(104, 396), label: { x: 236, y: 456, align: "left" }, leader: 456 },
  skiathos: { x: 58, y: 388, d: branch(58, 388), label: { x: 236, y: 482, align: "left" }, leader: 482 },
};

type Props = {
  locale: string;
  routes: RouteId[];
  /** Cruise slug each island belongs to; the list links to that cruise page */
  cruiseFor: Record<RouteId, string>;
  labels: {
    mapLabel: string;
    mapNote: string;
    kavala: string;
    names: Record<RouteId, string>;
    notes: Record<RouteId, string>;
    ask: string;
    customTitle: string;
    customBody: string;
    customCta: string;
  };
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function Routes({ locale, routes, cruiseFor, labels }: Props) {
  const [selected, setSelected] = useState<RouteId>(routes[0]);
  const reduce = useReducedMotionSafe();

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Map */}
      <figure className="lg:col-span-7">
        <div className="rounded-3xl bg-white p-4 sm:p-6">
          <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label={labels.mapLabel}>
              {/* Chart graticule: 24°E, 25°E, 40°N */}
              <g aria-hidden className="text-aegean/10" stroke="currentColor" strokeWidth={1}>
                <line x1={160} y1={0} x2={160} y2={H} />
                <line x1={360} y1={0} x2={360} y2={H} />
                <line x1={0} y1={220} x2={W} y2={220} />
              </g>

              {/* Leaders for the Sporades labels */}
              <g aria-hidden fill="none" stroke="currentColor" strokeWidth={1} className="text-aegean/25">
                {routes.map((id) => {
                  const g = geo[id];
                  if (!g.leader) return null;
                  return <path key={id} d={`M${g.x} ${g.y + 7} V${g.leader} H${g.label.x - 6}`} />;
                })}
              </g>

              {/* Route lines, drawn from Kavala once in view */}
              {routes.map((id, i) => {
                const g = geo[id];
                const active = id === selected;
                return (
                  <motion.path
                    key={id}
                    d={g.d}
                    fill="none"
                    strokeLinecap="round"
                    strokeWidth={active ? 3 : 1.5}
                    className={`transition-[stroke,stroke-width] duration-700 ease-fluid ${
                      active ? "stroke-shoal-deep" : "stroke-shoal/60"
                    }`}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={reduce ? { duration: 0 } : { duration: 1.4, delay: 0.2 + i * 0.12, ease: [0.32, 0.72, 0, 1] }}
                  />
                );
              })}

              {/* Island markers */}
              {routes.map((id) => {
                const g = geo[id];
                const active = id === selected;
                return (
                  <g key={id}>
                    <circle
                      cx={g.x}
                      cy={g.y}
                      r={12}
                      className={`fill-shoal/20 transition-opacity duration-700 ease-fluid ${active ? "opacity-100" : "opacity-0"}`}
                    />
                    <circle cx={g.x} cy={g.y} r={5} className="fill-aegean" />
                  </g>
                );
              })}

              {/* Kavala, the home port, in teak */}
              <circle cx={KAVALA.x} cy={KAVALA.y} r={7} className="fill-teak" />
            </svg>

            {/* HTML labels keep a readable text size at any map width */}
            {[
              // Longitude labels sit just below 40°N, clear of the Kavala label and the Sporades leaders
              { text: "24°E", x: 164, y: 226 },
              { text: "25°E", x: 364, y: 226 },
              { text: "40°N", x: 4, y: 204 },
            ].map((g) => (
              <span
                key={g.text}
                aria-hidden
                className="absolute text-xs text-aegean-soft"
                style={{ left: pct(g.x, W), top: pct(g.y, H) }}
              >
                {g.text}
              </span>
            ))}
            {/* Kavala label sits left of its marker, clear of the route lines */}
            <span
              className="absolute -translate-x-full -translate-y-1/2 text-xs font-semibold text-aegean sm:text-sm"
              style={{ left: pct(KAVALA.x - 12, W), top: pct(KAVALA.y, H) }}
            >
              {labels.kavala}
            </span>
            {routes.map((id) => {
              const { label } = geo[id];
              const shift =
                label.align === "center" ? "-translate-x-1/2" : label.align === "right" ? "-translate-x-full" : "";
              return (
                <span
                  key={id}
                  aria-hidden
                  className={`absolute -translate-y-1/2 whitespace-nowrap text-xs transition-colors duration-700 ease-fluid sm:text-sm ${shift} ${
                    id === selected ? "font-semibold text-aegean" : "font-medium text-aegean-soft"
                  }`}
                  style={{ left: pct(label.x, W), top: pct(label.y, H) }}
                >
                  {labels.names[id]}
                </span>
              );
            })}
          </div>
        </div>
        <figcaption className="mt-3 text-sm text-aegean-soft">{labels.mapNote}</figcaption>
      </figure>

      {/* Route list */}
      <div className="lg:col-span-5">
        <ul className="flex flex-col gap-1">
          {routes.map((id) => {
            const open = id === selected;
            const panelId = `route-${id}`;
            return (
              <li key={id} className={`rounded-2xl transition-colors duration-160 ease-press ${open ? "bg-white" : ""}`}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setSelected(id)}
                    className={`flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left text-xl font-semibold tracking-tight text-aegean transition-colors duration-160 ease-press ${
                      open ? "" : "hover:bg-white/60 active:bg-white"
                    }`}
                  >
                    {labels.names[id]}
                    <CaretDown
                      size={20}
                      aria-hidden
                      className={`shrink-0 text-aegean-soft transition-transform duration-200 ease-press ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>
                <div id={panelId} hidden={!open} className="px-4 pb-4">
                  <p className="text-base text-aegean-soft">{labels.notes[id]}</p>
                  <a
                    href={`/${locale}/cruises/${cruiseFor[id]}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg text-base font-semibold text-shoal-deep underline decoration-shoal-deep/30 underline-offset-4 transition-colors duration-160 ease-press hover:decoration-shoal-deep"
                  >
                    {labels.ask}
                    <ArrowRight size={16} aria-hidden />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 rounded-2xl bg-white/60 p-4 ring-1 ring-inset ring-aegean/10">
          <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-aegean">
            <PencilSimpleLine size={20} aria-hidden className="text-aegean-soft" />
            {labels.customTitle}
          </h3>
          <p className="mt-2 text-base text-aegean-soft">{labels.customBody}</p>
          <a
            href={`/${locale}/book?cruise=other#request`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg text-base font-semibold text-shoal-deep underline decoration-shoal-deep/30 underline-offset-4 transition-colors duration-160 ease-press hover:decoration-shoal-deep"
          >
            {labels.customCta}
            <ArrowRight size={16} aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
