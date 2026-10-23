"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Church, HouseLine, Umbrella } from "@phosphor-icons/react";
import {
  THASOS_VIEW,
  imagesSearchUrl,
  limenas,
  thasosCoast,
  type PlaceKey,
  type PlaceType,
} from "@/config/places";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { SectionHeading } from "./SectionHeading";

export type PlacePin = {
  key: PlaceKey;
  type: PlaceType;
  x: number;
  y: number;
  name: string;
  /** Google Images search terms */
  query: string;
};

type Props = {
  places: PlacePin[];
  labels: {
    title: string;
    lead: string;
    note: string;
    island: string;
    kavala: string;
    limenas: string;
    photos: string;
    opensInNewTab: string;
    types: Record<PlaceType, string>;
  };
};

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;
const { w: W, h: H } = THASOS_VIEW;

const typeIcon = {
  beach: Umbrella,
  village: HouseLine,
  monastery: Church,
} as const;

/** Closed Catmull-Rom spline through the coast points, as cubic Béziers */
function smoothClosed(pts: { x: number; y: number }[]) {
  const n = pts.length;
  const at = (i: number) => pts[(i + n) % n];
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x} ${p2.y}`;
  }
  return `${d} Z`;
}

const COAST = smoothClosed(thasosCoast);
/** The crossing from Kavala (off the map to the north west) into Limenas */
const CROSSING = `M16 12 C80 12 ${limenas.x - 90} ${limenas.y - 60} ${limenas.x} ${limenas.y}`;
/** Little wave marks on the sea, placed clear of the island */
const WAVES = [
  [40, 120],
  [70, 380],
  [150, 440],
  [360, 40],
  [392, 320],
  [330, 430],
  [24, 210],
];

/*
 * Thasos cruises: the owner's places on a schematic island map, numbered clockwise from Limenas,
 * beside a matching list. Sand band (teak tint) so the section stands apart from the limestone
 * timeline above and the white gallery below.
 * Motion: the coast draws itself, the dotted crossing from Kavala fades in, then the pins pop in 70ms apart.
 * Pointing at (or focusing) a place in the list, or a pin, highlights both and names it in a chip on the map.
 * Each list item links to the place's Google Images results in a new tab.
 * Reduced motion: everything drawn at once. The map is decoration (aria-hidden); the list carries it.
 */
export function PlacesMap({ places, labels }: Props) {
  const reduce = useReducedMotionSafe();
  const [active, setActive] = useState<PlaceKey | null>(null);
  const activeIndex = places.findIndex((p) => p.key === active);
  const t = (duration: number, delay = 0) =>
    reduce ? { duration: 0 } : { duration, delay, ease: EASE_FLUID };

  return (
    // Teak tint over white, not over limestone, so the band reads as sand rather than grey
    <section aria-labelledby="places-title" className="bg-white">
      <div className="bg-teak/15 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="places-title"
            title={labels.title}
            lead={labels.lead}
          />

          <div className="mt-12 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <figure className="lg:col-span-6">
              <div className="relative rounded-3xl bg-white p-4 sm:p-6">
                <motion.svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="block h-auto w-full"
                  aria-hidden
                  initial="hidden"
                  whileInView="shown"
                  viewport={{ once: true, amount: 0.4 }}
                >
                  {/* Sea */}
                  <g
                    className="text-shoal/40"
                    stroke="currentColor"
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                  >
                    {WAVES.map(([x, y]) => (
                      <path
                        key={`${x}-${y}`}
                        d={`M${x} ${y} q6 -6 12 0 t12 0`}
                      />
                    ))}
                  </g>

                  {/* North arrow */}
                  <g
                    className="text-aegean-soft"
                    transform={`translate(${W - 28} 28)`}
                  >
                    <path d="M0 -14 L6 6 L0 2 L-6 6 Z" fill="currentColor" />
                    <text
                      y={22}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={600}
                      fill="currentColor"
                    >
                      N
                    </text>
                  </g>

                  {/* Island: sand fill fades in under a coastline that draws itself */}
                  <motion.path
                    d={COAST}
                    className="fill-teak/20"
                    variants={{
                      hidden: { opacity: 0 },
                      shown: { opacity: 1, transition: t(0.8, 0.5) },
                    }}
                  />
                  <motion.path
                    d={COAST}
                    fill="none"
                    className="stroke-teak"
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    variants={{
                      hidden: { pathLength: reduce ? 1 : 0 },
                      shown: { pathLength: 1, transition: t(1.2) },
                    }}
                  />
                  <text
                    x={210}
                    y={250}
                    textAnchor="middle"
                    fontSize={28}
                    fontWeight={600}
                    letterSpacing={-0.5}
                    className="fill-teak"
                  >
                    {labels.island}
                  </text>

                  {/* The crossing from Kavala into Limenas */}
                  <motion.path
                    d={CROSSING}
                    fill="none"
                    className="stroke-aegean/50"
                    strokeWidth={3}
                    strokeDasharray="1 7"
                    strokeLinecap="round"
                    variants={{
                      hidden: { opacity: 0 },
                      shown: { opacity: 1, transition: t(0.6, 0.6) },
                    }}
                  />
                  <text
                    x={16}
                    y={34}
                    fontSize={13}
                    fontWeight={600}
                    className="fill-aegean-soft"
                  >
                    {labels.kavala}
                  </text>
                  <circle
                    cx={limenas.x}
                    cy={limenas.y}
                    r={5}
                    className="fill-white stroke-aegean"
                    strokeWidth={2.5}
                  />
                  <text
                    x={limenas.x - 10}
                    y={limenas.y - 10}
                    textAnchor="end"
                    fontSize={13}
                    fontWeight={600}
                    className="fill-aegean"
                  >
                    {labels.limenas}
                  </text>

                  {/* Pins */}
                  {places.map((p, i) => {
                    const on = active === p.key;
                    return (
                      <motion.g
                        key={p.key}
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "center",
                        }}
                        variants={{
                          hidden: {
                            opacity: 0,
                            transform: reduce ? "scale(1)" : "scale(0.4)",
                          },
                          shown: {
                            opacity: 1,
                            transform: "scale(1)",
                            transition: t(0.45, 1 + i * 0.07),
                          },
                        }}
                        onPointerEnter={() => setActive(p.key)}
                        onPointerLeave={() => setActive(null)}
                      >
                        <g
                          className="transition-transform duration-200 ease-press"
                          style={{
                            transformBox: "fill-box",
                            transformOrigin: "center",
                            transform: on ? "scale(1.15)" : "scale(1)",
                          }}
                        >
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={22}
                            className={`fill-shoal-deep/20 transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`}
                          />
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={15}
                            className={`stroke-white transition-colors duration-200 ${on ? "fill-shoal-deep" : "fill-aegean"}`}
                            strokeWidth={2.5}
                          />
                          <text
                            x={p.x}
                            y={p.y + 5}
                            textAnchor="middle"
                            fontSize={14}
                            fontWeight={600}
                            className="pointer-events-none fill-white"
                          >
                            {i + 1}
                          </text>
                        </g>
                      </motion.g>
                    );
                  })}

                </motion.svg>
                {/* Name of the place being pointed at, in a fixed corner so it never covers a pin */}
                <p
                  aria-hidden
                  className={`pointer-events-none absolute bottom-4 left-4 inline-flex max-w-full items-center gap-2 rounded-full bg-aegean py-1 pl-1 pr-3 text-sm font-semibold text-white transition-[opacity,transform] duration-200 ease-press sm:bottom-6 sm:left-6 ${
                    activeIndex >= 0 ? "opacity-100" : "translate-y-1 opacity-0"
                  }`}
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-shoal-deep">
                    {activeIndex + 1}
                  </span>
                  <span className="truncate">{places[activeIndex]?.name}</span>
                </p>
              </div>
              <figcaption className="mt-3 text-sm text-aegean-soft">
                {labels.note}
              </figcaption>
            </figure>

            <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-1">
              {places.map((p, i) => {
                const Icon = typeIcon[p.type];
                const on = active === p.key;
                return (
                  <li key={p.key}>
                    {/* Each place opens its Google Images results, so guests can see it before choosing */}
                    <a
                      href={imagesSearchUrl(p.query)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onPointerEnter={() => setActive(p.key)}
                      onPointerLeave={() => setActive(null)}
                      onFocus={() => setActive(p.key)}
                      onBlur={() => setActive(null)}
                      className={`group flex h-full items-center gap-4 rounded-2xl bg-white p-4 ring-inset transition-[box-shadow,transform] duration-200 ease-press active:scale-[0.99] ${
                        on ? "ring-2 ring-shoal-deep" : "ring-1 ring-aegean/5"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white transition-colors duration-200 ${
                          on ? "bg-shoal-deep" : "bg-aegean"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-semibold text-aegean">{p.name}</span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
                          <span className="text-aegean-soft">{labels.types[p.type]}</span>
                          <span aria-hidden className="text-aegean/20">·</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-shoal-deep underline decoration-shoal-deep/30 underline-offset-4 transition-colors duration-160 group-hover:decoration-shoal-deep">
                            {labels.photos}
                            <ArrowUpRight size={16} weight="bold" aria-hidden />
                          </span>
                          <span className="sr-only">{labels.opensInNewTab}</span>
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                          on ? "bg-aegean text-white" : "bg-teak/15 text-aegean"
                        }`}
                      >
                        <Icon size={20} />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
