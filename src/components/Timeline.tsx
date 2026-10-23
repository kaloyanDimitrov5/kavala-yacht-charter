"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { CloudSun, Compass } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

export type TimelineStep = { label: string; title: string; body: string; note?: string };

type Props = {
  id: string;
  title: string;
  steps: TimelineStep[];
  proposal: { title: string; body: string };
};

/*
 * Day by day plan. The days are a real sequence, so "Day 1, Day 2" is honest numbering.
 * Motion (explanation): each segment between two days fills as the visitor scrolls through it
 * (useScroll, rAF batched), and a day's dot fills once the line reaches it. Transform only.
 * Reduced motion: fully drawn and filled.
 * Desktop: the heading and the "proposal, not a fixed route" note stay pinned beside the days.
 */
export function Timeline({ id, title, steps, proposal }: Props) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.6"] });
  const gaps = Math.max(1, steps.length - 1);
  const [reached, setReached] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(steps.length - 1, Math.floor(p * gaps + 0.001));
    setReached((prev) => (prev === next ? prev : next));
  });

  return (
    <section aria-labelledby={id} className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <h2 id={id} className="text-3xl font-semibold tracking-tight text-aegean lg:text-5xl">
              {title}
            </h2>
            <aside className="mt-8 rounded-2xl bg-white p-6">
              <p className="flex items-center gap-2 text-base font-semibold text-aegean">
                <Compass size={20} aria-hidden className="shrink-0 text-shoal-deep" />
                {proposal.title}
              </p>
              <p className="mt-2 text-base text-aegean-soft">{proposal.body}</p>
            </aside>
          </div>
        </div>

        <ol ref={listRef} className="lg:col-span-7 lg:col-start-6">
          {steps.map((step, i) => {
            const lit = reduce || i <= reached;
            const last = i === steps.length - 1;
            return (
              <li key={step.label + step.title} className={`relative pl-12 ${last ? "" : "pb-12 lg:pb-16"}`}>
                {!last && <Segment index={i} gaps={gaps} progress={scrollYProgress} reduce={reduce} />}
                {/* Dot: 24px, centred on the line at 12px */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-1 h-6 w-6 rounded-full ring-2 ring-inset ring-shoal-deep transition-colors duration-300 ease-press ${
                    lit ? "bg-shoal-deep" : "bg-limestone"
                  }`}
                />
                <p className="text-sm font-semibold text-shoal-deep">{step.label}</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-aegean lg:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-measure text-lg text-aegean-soft">{step.body}</p>
                {step.note && (
                  <p className="mt-4 inline-flex items-start gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-aegean">
                    <CloudSun size={20} aria-hidden className="shrink-0 text-shoal-deep" />
                    {step.note}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** The line from one day's dot to the next. Fills with its share of the scroll progress. */
function Segment({
  index,
  gaps,
  progress,
  reduce,
}: {
  index: number;
  gaps: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const fill = useTransform(progress, (p) => {
    const local = Math.min(1, Math.max(0, p * gaps - index));
    return `scaleY(${local})`;
  });
  return (
    <span aria-hidden className="absolute left-3 top-3 h-full w-0.5 -translate-x-1/2 bg-aegean/10">
      <motion.span
        className="absolute inset-0 origin-top bg-shoal-deep"
        style={{ transform: reduce ? "scaleY(1)" : fill }}
      />
    </span>
  );
}
